const submissions = new Map<string, number[]>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of submissions.entries()) {
    const recent = timestamps.filter((t) => now - t < 300000)
    if (recent.length === 0) {
      submissions.delete(key)
    } else {
      submissions.set(key, recent)
    }
  }
}, 300000)

/**
 * Simple in-memory rate limiter.
 * Returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowMs: number = 60000,
): boolean {
  const now = Date.now()
  const timestamps = submissions.get(ip) || []
  const recent = timestamps.filter((t) => now - t < windowMs)

  if (recent.length >= maxRequests) {
    return false
  }

  recent.push(now)
  submissions.set(ip, recent)
  return true
}

/**
 * Anti-bot timing check.
 * Returns true if submission speed is human-like (> minMs).
 */
export function checkSubmissionTiming(renderedAt: number, minMs: number = 3000): boolean {
  return Date.now() - renderedAt >= minMs
}
