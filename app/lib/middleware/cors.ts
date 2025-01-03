import type { AppLoadContext } from '@remix-run/node'

const ALLOWED_ORIGINS = ['http://localhost:3000']
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
const ALLOWED_HEADERS = ['Content-Type', 'Authorization']
const MAX_AGE = 86400 // 24時間

/**
 * CORS middleware
 * Adds CORS headers to all responses
 */
export const corsHeaders = async (
  request: Request,
  loadContext: AppLoadContext,
  entrypoint: (request: Request, loadContext: AppLoadContext) => Promise<Response>
) => {
  // プリフライトリクエストの処理
  if (request.method === 'OPTIONS') {
    const headers = new Headers()
    const origin = request.headers.get('Origin')

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
      headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '))
      headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '))
      headers.set('Access-Control-Max-Age', MAX_AGE.toString())
    }

    return new Response(null, {
      status: 204,
      headers,
    })
  }

  // 通常のリクエストの処理
  const response = await entrypoint(request, loadContext)
  const headers = new Headers(response.headers)
  const origin = request.headers.get('Origin')

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
