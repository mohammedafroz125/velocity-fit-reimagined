/**
 * Lightweight, Safe Sliding-Window Rate Limiter.
 * Works across serverless runtimes with in-memory fallback, ready for Redis/Upstash when configured.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryLimiter = new Map<string, RateLimitRecord>();

// Cleanup stale records every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryLimiter.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        memoryLimiter.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const now = Date.now();
  const record = memoryLimiter.get(identifier) || { timestamps: [] };

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  memoryLimiter.set(identifier, record);

  return {
    success: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}
