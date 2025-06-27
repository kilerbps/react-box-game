import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler'
import gameRoutes from './routes/game'
import healthRoutes from './routes/health'
import { logger } from './utils/logger'

const app = express()
const PORT = process.env['PORT'] || 3002

// Configuration CORS simplifiée
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173']

// Ajouter l'URL de production si elle existe
if (process.env['NODE_ENV'] === 'production' && process.env['FRONTEND_URL']) {
  allowedOrigins.push(process.env['FRONTEND_URL']);
}

// Configuration CORS simplifiée
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware CORS (doit être avant helmet)
app.use(cors(corsOptions))

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  handler: (req: Request, res: Response, _next: NextFunction, options) => {
    logger.warn(`Rate limit dépassé pour IP: ${req.ip}`)
    res.status(429).json({ error: options.message })
  }
})

app.use(limiter)

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Route de base
app.get('/', (_req, res) => {
  res.json({ 
    message: '🎁 API Mystery Box Game',
    version: '1.0.0',
    status: 'running'
  })
})

// Middleware de logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// Routes
app.use('/api', gameRoutes)
app.use('/api', healthRoutes)

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler)

// Démarrage du serveur
app.listen(PORT, () => {
  logger.info(`🚀 Serveur démarré sur le port ${PORT}`)
  logger.info(`📊 Environnement: ${process.env['NODE_ENV'] || 'development'}`)
  logger.info(`🔗 URL: http://localhost:${PORT}`)
  logger.info(`🌐 Origines autorisées: ${allowedOrigins.join(', ')}`)
})

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt gracieux du serveur...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT reçu, arrêt gracieux du serveur...')
  process.exit(0)
}) 