import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map<string, number[]>()

const LIMIT = 10 // Max 10 requests
const WINDOW = 60 * 1000 // 1 minute window
const MAX_BODY_SIZE = 50 * 1024 // 50 KB limit for form submissions

export function proxy(request: NextRequest) {
  // Only apply rate limiting and size limits to POST requests (form submissions / Server Actions)
  if (request.method === 'POST') {
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()

    // 1. Request Size Limit Check
    const contentLengthHeader = request.headers.get('content-length')
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10)
      if (!isNaN(contentLength) && contentLength > MAX_BODY_SIZE) {
        return new NextResponse(
          JSON.stringify({ error: 'Payload too large.' }),
          { status: 413, headers: { 'content-type': 'application/json' } }
        )
      }
    }

    // 2. Rate Limiting Check
    const timestamps = rateLimitMap.get(ip) || []
    // Filter timestamps within the window
    const recentTimestamps = timestamps.filter((time) => now - time < WINDOW)

    if (recentTimestamps.length >= LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please wait a minute.' }),
        { status: 429, headers: { 'content-type': 'application/json' } }
      )
    }

    recentTimestamps.push(now)
    rateLimitMap.set(ip, recentTimestamps)
  }

  return NextResponse.next()
}

// Apply proxy to application submit action paths and api routes
export const config = {
  matcher: ['/', '/admin', '/api/:path*'],
}
