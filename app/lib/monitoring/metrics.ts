import { logger } from './logger'
import type { Metrics } from './types'

class MetricsCollector {
  private static instance: MetricsCollector
  private metrics: Map<string, Metrics[]>

  private constructor() {
    this.metrics = new Map()
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector()
    }
    return MetricsCollector.instance
  }

  record(metric: Metrics) {
    const { name } = metric
    const timestamp = metric.timestamp || Date.now()
    const metricWithTimestamp = { ...metric, timestamp }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    this.metrics.get(name)?.push(metricWithTimestamp)
    logger.debug('Metric recorded', { metric: metricWithTimestamp })
  }

  getMetrics(name: string): Metrics[] {
    return this.metrics.get(name) || []
  }

  clear(name?: string) {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }

  // 集計関数
  aggregate(name: string, timeRange: { start: number; end: number }) {
    const metrics = this.getMetrics(name).filter(
      (m) => m.timestamp && m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    )

    if (metrics.length === 0) {
      return null
    }

    const values = metrics.map((m) => m.value)
    return {
      name,
      count: metrics.length,
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / metrics.length,
      min: Math.min(...values),
      max: Math.max(...values),
      timeRange,
    }
  }
}

export const metricsCollector = MetricsCollector.getInstance()
