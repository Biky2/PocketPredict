// Simple in-memory rate limiter for serverless environment instance spikes.
// In production, an external provider like Upstash Redis would be preferred,
// but this memory-based token bucket prevents runaway local test loops and API abuse.

type RateLimitRecord = {
  tokens: number;
  lastRefill: number;
};

const cache = new Map<string, RateLimitRecord>();

// Clean up expired items every 5 minutes to prevent memory leaks
if (typeof global !== 'undefined') {
  if (!(global as any)._rateLimitCache) {
    (global as any)._rateLimitCache = cache;
    setInterval(() => {
      const now = Date.now();
      for (const [ip, record] of cache.entries()) {
        // If it's been idle for more than 10 minutes, remove it
        if (now - record.lastRefill > 10 * 60 * 1000) {
          cache.delete(ip);
        }
      }
    }, 5 * 60 * 1000);
  }
}

interface RateLimitConfig {
  limit: number;      // Maximum tokens
  windowMs: number;   // Time window to refill completely
}

export function rateLimit(ip: string, config: RateLimitConfig = { limit: 20, windowMs: 60 * 1000 }) {
  const activeCache: Map<string, RateLimitRecord> = (global as any)._rateLimitCache || cache;
  const now = Date.now();
  const record = activeCache.get(ip) || { tokens: config.limit, lastRefill: now };

  // Calculate elapsed time and tokens to add
  const elapsed = now - record.lastRefill;
  const refillRate = config.limit / config.windowMs;
  const newTokens = Math.min(config.limit, record.tokens + elapsed * refillRate);

  if (newTokens >= 1) {
    activeCache.set(ip, {
      tokens: newTokens - 1,
      lastRefill: now,
    });
    return {
      success: true,
      remaining: Math.floor(newTokens - 1),
      limit: config.limit,
    };
  } else {
    // Keep lastRefill to avoid reset by constant spamming
    activeCache.set(ip, {
      tokens: newTokens,
      lastRefill: record.lastRefill, // keep tracking from the original checkpoint
    });
    return {
      success: false,
      remaining: 0,
      limit: config.limit,
    };
  }
}
