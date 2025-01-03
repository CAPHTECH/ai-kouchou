import type { LogLevel } from './types'

class Logger {
  private static instance: Logger
  private env: string

  private constructor() {
    this.env = process.env.NODE_ENV || 'development'
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  static forceNewInstance(): Logger {
    Logger.instance = new Logger()
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      environment: this.env,
      message,
      ...meta,
    })
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.env === 'development') {
      console.debug(this.formatMessage('DEBUG', message, meta))
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    console.info(this.formatMessage('INFO', message, meta))
  }

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(this.formatMessage('WARN', message, meta))
  }

  error(message: string, meta?: Record<string, unknown>) {
    console.error(this.formatMessage('ERROR', message, meta))
  }

  fatal(message: string, meta?: Record<string, unknown>) {
    console.error(this.formatMessage('FATAL', message, meta))
  }
}

const instance = Logger.getInstance()

export const logger = {
  debug: instance.debug.bind(instance),
  info: instance.info.bind(instance),
  warn: instance.warn.bind(instance),
  error: instance.error.bind(instance),
  fatal: instance.fatal.bind(instance),
  forceNewInstance: () => {
    const newInstance = Logger.forceNewInstance()
    return {
      debug: newInstance.debug.bind(newInstance),
      info: newInstance.info.bind(newInstance),
      warn: newInstance.warn.bind(newInstance),
      error: newInstance.error.bind(newInstance),
      fatal: newInstance.fatal.bind(newInstance),
    }
  },
}
