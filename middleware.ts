import { clerkMiddleware } from '@clerk/nextjs/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

let redis: Redis | null = null
let limiters: Record<string, Ratelimit> | null = null

function getRedis(): Redis | null {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (url && token) redis = new Redis({ url, token })
  }
  return redis
}

function getLimiters(r: Redis): Record<string, Ratelimit> {
  if (!limiters) {
    limiters = {
      groq:     new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(5,  '1 d'), prefix: 'rl_groq' }),
      file:     new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(10, '1 d'), prefix: 'rl_file' }),
      excel:    new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(10, '1 d'), prefix: 'rl_excel' }),
      feedback: new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(5,  '1 h'), prefix: 'rl_feedback' }),
      waitlist: new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(3,  '1 d'), prefix: 'rl_waitlist' }),
    }
  }
  return limiters
}

const ROUTE_LIMITER: Record<string, string> = {
  '/api/parse-cv':           'file',
  '/api/generate-questions': 'groq',
  '/api/synthesise':         'groq',
  '/api/generate-excel':     'excel',
  '/api/feedback':           'feedback',
  '/api/waitlist':           'waitlist',
}

async function applyRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const r = getRedis()
  if (!r) return null

  const limiterKey = ROUTE_LIMITER[req.nextUrl.pathname]
  if (!limiterKey) return null

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous'
  const { success, limit, remaining, reset } = await getLimiters(r)[limiterKey].limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a while.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    )
  }

  return null
}

export default clerkMiddleware(async (_auth, req: NextRequest) => {
  const limited = await applyRateLimit(req)
  if (limited) return limited
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/(api|trpc)(.*)',
  ],
}
