import { NextRequest, NextResponse } from "next/server";
import { getVisionAiStore } from "@/lib/prisma";
import {
  dispatchToSocialNetwork,
  SupportedSocialProvider,
} from "@/lib/social-publisher";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const startMs = Date.now();
  const rate = checkRateLimit(request, "social_publish", {
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.allowed && rate.response) {
    return rate.response;
  }

  try {
    const body = await request.json();
    const content = String(body.content || "").trim();
    const platforms: SupportedSocialProvider[] = Array.isArray(body.platforms)
      ? body.platforms
      : [body.network || "twitter"];
    const mediaUrl = body.mediaUrl || undefined;
    const publishNow = Boolean(body.publishNow ?? body.status === "published");
    const scheduledTime =
      body.scheduledTime || (publishNow ? "Published Live" : "Today, 4:30 PM");

    if (!content) {
      return NextResponse.json(
        { error: "Post content cannot be empty." },
        { status: 400 }
      );
    }

    const { state, save, enqueueDispatchJob } = getVisionAiStore();
    const results = [];
    const createdPosts = [];
    const dispatchJobs = [];

    for (const rawNet of platforms) {
      const provider =
        (rawNet.toLowerCase() as SupportedSocialProvider) || "twitter";
      const account = state.socialAccounts.find((a) => a.provider === provider);
      const handle = account?.handle || body.handle || `@VisionAI_${provider}`;

      const dispatchStart = Date.now();
      const dispatchResult = await dispatchToSocialNetwork({
        provider,
        content,
        mediaUrl,
        handle,
        accessToken: account?.status === "connected" ? "connected" : undefined,
      });
      const latencyMs = Math.max(45, Date.now() - dispatchStart + 72);

      results.push(dispatchResult);

      const postId = `post_${provider}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      const newPost = {
        id: postId,
        network: provider,
        platforms: [provider],
        handle,
        content,
        mediaUrl,
        scheduledTime,
        status: publishNow ? ("published" as const) : ("scheduled" as const),
        likes: 0,
        comments: 0,
        shares: 0,
        reach: publishNow ? "Live • 0 engagements" : "Scheduled",
        userId: "usr_visionai_admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.posts.unshift(newPost);
      createdPosts.push(newPost);

      const job = enqueueDispatchJob({
        postId,
        network: provider,
        handle,
        content,
        scheduledTime,
        status: publishNow ? "published" : "queued",
        attempts: publishNow ? 1 : 0,
        externalUrl: publishNow ? dispatchResult.externalUrl : undefined,
        latencyMs: publishNow ? latencyMs : undefined,
      });
      dispatchJobs.push(job);
    }

    save();

    const durationMs = Math.max(25, Date.now() - startMs);
    logger.recordTrace({
      level: "INFO",
      service: "visionai-social-publisher",
      route: "/api/social/publish",
      method: "POST",
      statusCode: 200,
      durationMs,
      message: `${publishNow ? "Published" : "Enqueued"} omnichannel broadcast across [${platforms.join(", ")}]`,
      metadata: {
        platforms,
        publishNow,
        jobIds: dispatchJobs.map((j) => j.id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        results,
        posts: createdPosts,
        dispatchJobs,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
        },
      }
    );
  } catch (error: any) {
    logger.recordTrace({
      level: "ERROR",
      service: "visionai-social-publisher",
      route: "/api/social/publish",
      method: "POST",
      statusCode: 400,
      durationMs: Date.now() - startMs,
      message: error?.message || "Failed to publish social post",
    });
    return NextResponse.json(
      { error: error?.message || "Failed to publish social post" },
      { status: 400 }
    );
  }
}
