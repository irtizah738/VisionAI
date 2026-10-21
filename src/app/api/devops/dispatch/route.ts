import { NextRequest, NextResponse } from "next/server";
import { getVisionAiStore } from "@/lib/prisma";
import {
  dispatchToSocialNetwork,
  SupportedSocialProvider,
} from "@/lib/social-publisher";
import {
  processDispatchQueueSweep,
  summarizeDispatchQueue,
  ensureValidOAuthTokens,
} from "@/lib/devops-engine";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const { state } = getVisionAiStore();
  const summary = summarizeDispatchQueue(state.dispatchQueue);

  return NextResponse.json({
    queue: state.dispatchQueue,
    summary,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const startMs = Date.now();
  const rate = checkRateLimit(request, "devops_dispatch", {
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed && rate.response) {
    return rate.response;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || "sweep");
    const { state, save, enqueueDispatchJob } = getVisionAiStore();
    const nowIso = new Date().toISOString();

    ensureValidOAuthTokens();

    if (action === "enqueue_test") {
      const provider = (body.network || "twitter") as SupportedSocialProvider;
      const simulateFailure = Boolean(body.simulateFailure);
      const account = state.socialAccounts.find((a) => a.provider === provider);
      const handle = account?.handle || `@VisionAI_${provider}`;
      const content =
        body.content ||
        `[Scheduled Dispatch] Omnichannel AI benchmark live on ${provider.toUpperCase()} — 4.2x pipeline attribution. https://visionai.studio/launch`;

      if (simulateFailure) {
        const backoffSec = 4;
        const job = enqueueDispatchJob({
          postId: `post_${provider}_${Date.now()}`,
          network: provider,
          handle,
          content,
          scheduledTime: nowIso,
          status: "retrying",
          attempts: 1,
          latencyMs: 295,
          lastError: `HTTP 429 Upstream Rate Limit on ${provider} API — Exponential Backoff (${backoffSec}s)`,
        });
        job.nextRetryAt = new Date(Date.now() + backoffSec * 1000).toISOString();
        save();

        return NextResponse.json({
          success: true,
          action: "enqueue_test",
          job,
          queue: state.dispatchQueue,
          summary: summarizeDispatchQueue(state.dispatchQueue),
        });
      }

      const job = enqueueDispatchJob({
        postId: `post_${provider}_${Date.now()}`,
        network: provider,
        handle,
        content,
        scheduledTime: nowIso,
        status: "queued",
        attempts: 0,
      });

      return NextResponse.json({
        success: true,
        action: "enqueue_test",
        job,
        queue: state.dispatchQueue,
        summary: summarizeDispatchQueue(state.dispatchQueue),
      });
    }

    if (action === "replay") {
      const jobId = String(body.jobId || "");
      const target = state.dispatchQueue.find((j) => j.id === jobId);
      if (!target) {
        return NextResponse.json(
          { error: `Dispatch job ${jobId} not found` },
          { status: 404 }
        );
      }

      const dispatchStart = Date.now();
      const result = await dispatchToSocialNetwork({
        provider: target.network,
        content: target.contentPreview,
        handle: target.handle,
        accessToken: "connected",
      });
      const latencyMs = Math.max(48, Date.now() - dispatchStart + 95);

      target.status = "published";
      target.attempts = Math.min(target.maxAttempts, target.attempts + 1);
      target.lastError = undefined;
      target.nextRetryAt = undefined;
      target.externalUrl = result.externalUrl;
      target.latencyMs = latencyMs;
      target.updatedAt = new Date().toISOString();

      const post = state.posts.find((p) => p.id === target.postId);
      if (post) {
        post.status = "published";
        post.publishedAt = target.updatedAt;
        post.updatedAt = target.updatedAt;
      }

      save();

      return NextResponse.json({
        success: true,
        action: "replay",
        replayedJob: target,
        queue: state.dispatchQueue,
        summary: summarizeDispatchQueue(state.dispatchQueue),
      });
    }

    // Default: run full backend queue & dead-letter sweep
    const sweepResult = await processDispatchQueueSweep({
      includeDeadLetterRecovery: true,
      forceImmediate: true,
    });

    return NextResponse.json({
      success: true,
      action: "sweep",
      ...sweepResult,
    });
  } catch (error: any) {
    logger.recordTrace({
      level: "ERROR",
      service: "visionai-dispatch-worker",
      route: "/api/devops/dispatch",
      method: "POST",
      statusCode: 500,
      durationMs: Date.now() - startMs,
      message: error?.message || "Dispatch worker sweep failed",
    });
    return NextResponse.json(
      { error: error?.message || "Failed to execute dispatch worker action" },
      { status: 500 }
    );
  }
}
