import { NextRequest, NextResponse } from "next/server";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(
  req: NextRequest,
  keyPrefix: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60_000 }
): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  response?: NextResponse;
} {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(0, config.limit - bucket.count);
  const allowed = bucket.count <= config.limit;

  if (!allowed) {
    const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetAt: bucket.resetAt,
      response: NextResponse.json(
        {
          error: "Too many requests. Please retry shortly.",
          retryAfterSeconds: retryAfterSec,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(config.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.floor(bucket.resetAt / 1000)),
            "Retry-After": String(retryAfterSec),
          },
        }
      ),
    };
  }

  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetAt: bucket.resetAt,
  };
}
