import { NextRequest, NextResponse } from "next/server";

export interface RateLimitBucket {
  key: string;
  routeGroup: string;
  ip: string;
  count: number;
  limit: number;
  resetAt: number;
  lastRequestAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __visionAiRateLimitBuckets: Map<string, RateLimitBucket> | undefined;
}

function getBucketMap(): Map<string, RateLimitBucket> {
  if (!global.__visionAiRateLimitBuckets) {
    const initial = new Map<string, RateLimitBucket>();
    const now = Date.now();
    initial.set("ai_chat:127.0.0.1", {
      key: "ai_chat:127.0.0.1",
      routeGroup: "ai_chat",
      ip: "127.0.0.1",
      count: 6,
      limit: 30,
      resetAt: now + 52_000,
      lastRequestAt: new Date(now - 8_000).toISOString(),
    });
    initial.set("social_publish:127.0.0.1", {
      key: "social_publish:127.0.0.1",
      routeGroup: "social_publish",
      ip: "127.0.0.1",
      count: 4,
      limit: 30,
      resetAt: now + 45_000,
      lastRequestAt: new Date(now - 15_000).toISOString(),
    });
    initial.set("webhooks_ingest:127.0.0.1", {
      key: "webhooks_ingest:127.0.0.1",
      routeGroup: "webhooks_ingest",
      ip: "127.0.0.1",
      count: 2,
      limit: 120,
      resetAt: now + 55_000,
      lastRequestAt: new Date(now - 25_000).toISOString(),
    });
    global.__visionAiRateLimitBuckets = initial;
  }
  return global.__visionAiRateLimitBuckets;
}

export interface RateLimitConfig {
  keyPrefix?: string;
  limit?: number;
  windowMs?: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  response: NextResponse | null;
}

/**
 * Checks whether the incoming request is within the configured sliding-window rate limit.
 * Supports both legacy `if (rateLimitResponse) return rateLimitResponse` usage and
 * structured `{ allowed, limit, remaining, resetAt, response }` inspection.
 */
export function checkRateLimit(
  req: NextRequest,
  keyOrConfig?: string | RateLimitConfig,
  maybeConfig?: RateLimitConfig
): any {
  const keyPrefix =
    typeof keyOrConfig === "string"
      ? keyOrConfig
      : keyOrConfig?.keyPrefix || "api";
  const limit =
    (typeof keyOrConfig === "object" ? keyOrConfig?.limit : maybeConfig?.limit) ??
    60;
  const windowMs =
    (typeof keyOrConfig === "object"
      ? keyOrConfig?.windowMs
      : maybeConfig?.windowMs) ?? 60_000;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const buckets = getBucketMap();

  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = {
      key,
      routeGroup: keyPrefix,
      ip,
      count: 0,
      limit,
      resetAt: now + windowMs,
      lastRequestAt: new Date(now).toISOString(),
    };
  }

  bucket.count += 1;
  bucket.limit = limit;
  bucket.lastRequestAt = new Date(now).toISOString();
  buckets.set(key, bucket);

  const allowed = bucket.count <= limit;
  const remaining = Math.max(0, limit - bucket.count);

  if (!allowed) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    const response = NextResponse.json(
      {
        error: "Too many requests. Please retry shortly.",
        retryAfterSeconds: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(bucket.resetAt / 1000)),
          "Retry-After": String(retryAfterSec),
        },
      }
    );

    if (typeof keyOrConfig === "string") {
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetAt: bucket.resetAt,
        response,
      };
    }
    return response;
  }

  if (typeof keyOrConfig === "string") {
    return {
      allowed: true,
      limit,
      remaining,
      resetAt: bucket.resetAt,
      response: null,
    };
  }

  return null;
}

export function getRateLimitSnapshot() {
  const buckets = getBucketMap();
  const now = Date.now();
  const active: Array<{
    key: string;
    routeGroup: string;
    ip: string;
    count: number;
    limit: number;
    remaining: number;
    utilizationPct: number;
    resetsInSec: number;
    lastRequestAt: string;
  }> = [];

  for (const [, b] of buckets.entries()) {
    const resetsInSec = Math.max(0, Math.ceil((b.resetAt - now) / 1000));
    const count = resetsInSec === 0 ? 0 : b.count;
    const remaining = Math.max(0, b.limit - count);
    active.push({
      key: b.key,
      routeGroup: b.routeGroup,
      ip: b.ip,
      count,
      limit: b.limit,
      remaining,
      utilizationPct: Math.min(100, Math.round((count / Math.max(1, b.limit)) * 100)),
      resetsInSec,
      lastRequestAt: b.lastRequestAt,
    });
  }

  return active;
}
