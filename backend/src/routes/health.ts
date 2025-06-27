import { Router, Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

const router = Router()

// Route de santé simple
router.get('/health', asyncHandler(async (_req: Request, res: Response) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    title: process.title,
    nodeEnv: process.env['NODE_ENV'],
    port: process.env['PORT'],
    frontendUrl: process.env['FRONTEND_URL']
  }

  logger.info('Health check effectué')
  res.json(healthData)
}))

// Route de santé détaillée
router.get('/health/detailed', asyncHandler(async (_req: Request, res: Response) => {
  const detailedHealthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    uptime: process.uptime(),
    memory: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external,
      arrayBuffers: process.memoryUsage().arrayBuffers
    },
    cpu: process.cpuUsage(),
    version: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    title: process.title,
    nodeEnv: process.env['NODE_ENV'],
    port: process.env['PORT'],
    frontendUrl: process.env['FRONTEND_URL'],
    logLevel: process.env['LOG_LEVEL']
  }

  logger.info('Health check détaillé effectué')
  res.json(detailedHealthData)
}))

export default router 