import type { AppLoadContext } from '@remix-run/node'
import { randomUUID } from 'node:crypto'
import { logger } from '../monitoring/logger'
import { metricsCollector } from '../monitoring/metrics'

/**
 * Monitoring middleware
 * Adds request logging and metrics collection
 */
export const monitoringMiddleware = async (
  request: Request,
  loadContext: AppLoadContext,
  entrypoint: (request: Request, loadContext: AppLoadContext) => Promise<Response>
) => {
  const startTime = Date.now()
  const requestId = randomUUID()

  // リクエストのログ記録
  logger.info('Request received', {
    requestId,
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  })

  try {
    // レスポンスの処理
    const response = await entrypoint(request, loadContext)
    const endTime = Date.now()
    const duration = endTime - startTime

    // メトリクスの記録
    metricsCollector.record({
      name: 'request_duration',
      value: duration,
      tags: {
        method: request.method,
        path: new URL(request.url).pathname,
        status: response.status.toString(),
      },
    })

    // レスポンスのログ記録
    logger.info('Response sent', {
      requestId,
      status: response.status,
      duration,
    })

    return response
  } catch (error) {
    const endTime = Date.now()
    const duration = endTime - startTime

    // エラーメトリクスの記録
    metricsCollector.record({
      name: 'request_error',
      value: 1,
      tags: {
        method: request.method,
        path: new URL(request.url).pathname,
        error: error instanceof Error ? error.name : 'UnknownError',
      },
    })

    // エラーのログ記録
    logger.error('Request failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration,
    })

    throw error
  }
}
