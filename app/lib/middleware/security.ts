import type { AppLoadContext } from '@remix-run/node'

/**
 * Security headers middleware
 * Adds security headers to all responses
 */
export const securityHeaders = async (
  request: Request,
  loadContext: AppLoadContext,
  entrypoint: (request: Request, loadContext: AppLoadContext) => Promise<Response>
) => {
  const response = await entrypoint(request, loadContext)
  const headers = new Headers(response.headers)

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'block-all-mixed-content',
      'upgrade-insecure-requests',
    ].join('; ')
  )

  // Security headers
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
