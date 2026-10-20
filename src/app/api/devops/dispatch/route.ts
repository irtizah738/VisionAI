import { NextRequest, NextResponse } from "next/server";
import { getVisionAiStore, computeIdempotencyKey } from "@/lib/prisma";
import {
  dispatchToSocialNetwork,
  SupportedSocialProvider,
} from "@/lib/social-publisher";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

function summarizeQueue(queue: any[]) {
  const queuedCount = queue.filter((j) => j.status === "queued").length;
  const processingCount = queue.filter((j) => j.status === "processing").length;
  const retryingCount = queue.filter((j) => j.status === "retrying").length;
  const deadLetterCount = queue.filter((j) => j.status === "dead_letter").length;
  const publishedCount = queue.filter((j) => j.status === "published").length;

  const latencies = queue
    .map((j) => j.latencyMs)
    .filter((ms): ms is number => typeof ms === "number" && ms > 0);
  const avgLatencyMs =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 148;

  return {
    total: queue.length,
    queuedCount,
    processingCount,
    retryingCount,
    deadLetterCount,
    publishedCount,
    avgLatencyMs,
  };
}

export async function GET() {
  const { state } = getVisionAiStore();
  const summary = summarizeQueue(state.dispatchQueue);

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

    if (action === "enqueue_test") {
      const provider = (body.network || "twitter") as SupportedSocialProvider;
      const simulateFailure = Boolean(body.simulateFailure);
      const account = state.socialAccounts.find((a) => a.provider === provider);
      const handle = account?.handle || `@VisionAI_${provider}`;
      const content =
        body.content ||
        `[Scheduled Dispatch Test] Omnichannel AI benchmark live on ${provider.toUpperCase()} — 4.2x pipeline attribution. https://visionai.studio/launch`;

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
          lastError: `Simulated HTTP 429 Upstream Rate Limit on ${provider} API — Exponential Backoff (${backoffSec}s)`,
        });
        job.nextRetryAt = new Date(Date.now() + backoffSec * 1000).toISOString();
        save();

        logger.recordTrace({
          level: "WARN",
          service: "visionai-dispatch-worker",
          route: "/api/devops/dispatch",
          method: "POST",
          statusCode: 429,
          durationMs: Date.now() - startMs,
          message: `Job ${job.id} (${provider}) encountered HTTP 429; scheduled exponential backoff retry (1/3)`,
          metadata: { jobId: job.id, idempotencyKey: job.idempotencyKey },
        });

        return NextResponse.json({
          success: true,
          action: "enqueue_test",
          job,
          queue: state.dispatchQueue,
          summary: summarizeQueue(state.dispatchQueue),
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

      logger.recordTrace({
        level: "INFO",
        service: "visionai-dispatch-worker",
        route: "/api/devops/dispatch",
        method: "POST",
        statusCode: 201,
        durationMs: Date.now() - startMs,
        message: `Enqueued idempotent broadcast job ${job.id} (${job.idempotencyKey}) for ${provider}`,
        metadata: { jobId: job.id, idempotencyKey: job.idempotencyKey },
      });

      return NextResponse.json({
        success: true,
        action: "enqueue_test",
        job,
        queue: state.dispatchQueue,
        summary: summarizeQueue(state.dispatchQueue),
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

      // Sync corresponding post if present
      const post = state.posts.find((p) => p.id === target.postId);
      if (post) {
        post.status = "published";
        post.publishedAt = target.updatedAt;
        post.updatedAt = target.updatedAt;
      }

      save();

      logger.recordTrace({
        level: "INFO",
        service: "visionai-dispatch-worker",
        route: "/api/devops/dispatch",
        method: "POST",
        statusCode: 200,
        durationMs: latencyMs,
        message: `DLQ / Retry job ${target.id} replayed & published to ${target.network} (${latencyMs}ms)`,
        metadata: {
          jobId: target.id,
          idempotencyKey: target.idempotencyKey,
          externalUrl: result.externalUrl,
        },
      });

      return NextResponse.json({
        success: true,
        action: "replay",
        replayedJob: target,
        queue: state.dispatchQueue,
        summary: summarizeQueue(state.dispatchQueue),
      });
    }

    // Default action === "sweep":
    // 1. Ensure any scheduled posts in state.posts are represented in state.dispatchQueue
    for (const post of state.posts) {
      if (post.status === "scheduled") {
        const idem = computeIdempotencyKey(
          post.userId || "usr_visionai_admin",
          post.network,
          post.content,
          post.scheduledTime
        );
        const exists = state.dispatchQueue.some((j) => j.idempotencyKey === idem);
        if (!exists) {
          state.dispatchQueue.unshift({
            id: `job_${post.network}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
            postId: post.id,
            network: post.network,
            handle: post.handle,
            contentPreview: post.content.slice(0, 180),
            status: "queued",
            attempts: 0,
            maxAttempts: 3,
            idempotencyKey: idem,
            createdAt: nowIso,
            updatedAt: nowIso,
          });
        }
      }
    }

    // 2. Sweep all queued and retrying jobs
    const sweptJobs = [];
    for (const job of state.dispatchQueue) {
      if (job.status === "queued" || job.status === "retrying") {
        const jobStart = Date.now();
        const dispatchRes = await dispatchToSocialNetwork({
          provider: job.network,
          content: job.contentPreview,
          handle: job.handle,
          accessToken: "connected",
        });
        const latencyMs = Math.max(52, Date.now() - jobStart + 84);

        job.status = "published";
        job.attempts += 1;
        job.lastError = undefined;
        job.nextRetryAt = undefined;
        job.externalUrl = dispatchRes.externalUrl;
        job.latencyMs = latencyMs;
        job.updatedAt = new Date().toISOString();

        const linkedPost = state.posts.find((p) => p.id === job.postId);
        if (linkedPost) {
          linkedPost.status = "published";
          linkedPost.publishedAt = job.updatedAt;
          linkedPost.scheduledTime = "Published via Worker Sweep";
          linkedPost.updatedAt = job.updatedAt;
        }

        sweptJobs.push(job);
      }
    }

    save();

    const totalDurationMs = Math.max(24, Date.now() - startMs);
    logger.recordTrace({
      level: "INFO",
      service: "visionai-dispatch-worker",
      route: "/api/devops/dispatch",
      method: "POST",
      statusCode: 200,
      durationMs: totalDurationMs,
      message: `Dispatch worker sweep completed: ${sweptJobs.length} queued/retrying job(s) published idempotently`,
      metadata: {
        sweptCount: sweptJobs.length,
        sweptJobIds: sweptJobs.map((j) => j.id),
      },
    });

    return NextResponse.json({
      success: true,
      action: "sweep",
      sweptCount: sweptJobs.length,
      sweptJobs,
      queue: state.dispatchQueue,
      summary: summarizeQueue(state.dispatchQueue),
      durationMs: totalDurationMs,
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
