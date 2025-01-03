import { describe, expect, it, vi } from 'vitest'
import { logger } from '~/lib/monitoring/logger'

describe('Logger', () => {
  it('should log debug messages only in development', () => {
    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const originalEnv = process.env.NODE_ENV

    // Development環境
    process.env.NODE_ENV = 'development'
    // loggerインスタンスを再作成
    const devLogger = logger.forceNewInstance()
    devLogger.debug('test message')
    expect(consoleSpy).toHaveBeenCalled()

    // Production環境
    process.env.NODE_ENV = 'production'
    // loggerインスタンスを再作成
    const prodLogger = logger.forceNewInstance()
    prodLogger.debug('test message')
    expect(consoleSpy).toHaveBeenCalledTimes(1) // 開発環境での1回のみ

    // 環境変数を元に戻す
    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    logger.info('test message')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should log warn messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    logger.warn('test message')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should log error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.error('test message')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should log fatal messages', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.fatal('test message')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should include metadata in log messages', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const metadata = { userId: '123', action: 'test' }
    logger.info('test message', metadata)
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"userId":"123"'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"action":"test"'))
    consoleSpy.mockRestore()
  })
})
