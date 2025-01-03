export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  environment: string
  message: string
  [key: string]: unknown
}

export interface Metrics {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp?: number
}
