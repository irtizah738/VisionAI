import { NextRequest, NextResponse } from "next/server";
import { getVisionAiStore } from "@/lib/prisma";
import {
  dispatchToSocialNetwork,
  SupportedSocialProvider,
} from "@/lib/social-publisher";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
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

    const { state, save } = getVisionAiStore();
    const results = [];
    const createdPosts = [];

    for (const rawNet of platforms) {
      const provider = (rawNet.toLowerCase() as SupportedSocialProvider) || "twitter";
      const account = state.socialAccounts.find((a) => a.provider === provider);
      const handle = account?.handle || body.handle || `@VisionAI_${provider}`;

      const dispatchResult = await dispatchToSocialNetwork({
        provider,
        content,
        mediaUrl,
        handle,
        accessToken: account?.status === "connected" ? "connected" : undefined,
      });

      results.push(dispatchResult);

      const newPost = {
        id: `post_${provider}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        network: provider,
        platforms: [provider],
        handle,
        content,
        mediaUrl,
        scheduledTime,
        status: publishNow ? ("published" as const) : ("scheduled" as const),
        engagement: publishNow ? "Live • 0 engagements" : undefined,
        userId: "usr_visionai_admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.posts.unshift(newPost);
      createdPosts.push(newPost);
    }

    save();

    return NextResponse.json(
      {
        success: true,
        results,
        posts: createdPosts,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to publish social post" },
      { status: 400 }
    );
  }
}
