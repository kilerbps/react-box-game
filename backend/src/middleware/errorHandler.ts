import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

// Interface pour une erreur standardisée
interface AppError extends Error {
  statusCode: number;
}

// Fonction pour créer une erreur
export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
}

// Middleware de gestion des erreurs
export const errorHandler = (
  err: AppError, 
  req: Request, 
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  // Log de l'erreur
  logger.error(`Erreur ${statusCode}: ${message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: process.env['NODE_ENV'] === 'development' ? err.stack : undefined
  });

  // Ne pas exposer les détails de l'erreur en production
  if (process.env['NODE_ENV'] === 'production' && statusCode === 500) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
    return;
  }
  
  res.status(statusCode).json({ error: message });
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
} 