import { Router, Request, Response } from 'express'
import { pdfService } from '../services/pdfService'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { 
  IdentityCheckResponse, 
  GameSubmissionRequest, 
  GameSubmissionResponse,
  GameResult,
  ApiResponse 
} from '../types/game'
import { logger } from '../utils/logger'
import { sanitizeObject, sanitize } from '../utils/sanitize'
import fs from 'fs-extra'
import path from 'path'

const router = Router()

// Vérifier si une identité existe déjà
router.post('/check-identity', asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, fullName }: { email: string, phone: string, fullName?: string } = req.body

  if (!email || !phone) {
    throw createError('Email et téléphone sont requis', 400)
  }
  
  // Nettoyer les entrées avant la vérification
  const sanitizedEmail = sanitize(email)
  const sanitizedPhone = sanitize(phone)

  try {
    const exists = await pdfService.checkIdentityExists(sanitizedEmail, sanitizedPhone, fullName)
    
    const response: IdentityCheckResponse = {
      exists,
      canPlay: !exists,
      message: exists 
        ? 'Cette identité a déjà participé au jeu' 
        : 'Identité valide pour participer'
    }

    logger.info(`Vérification d'identité: ${sanitizedEmail} - ${exists ? 'existe' : 'nouvelle'}`)
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de la vérification d\'identité:', error)
    throw createError('Erreur lors de la vérification d\'identité', 500)
  }
}))

// Vérifier si un utilisateur peut jouer
router.get('/check-user/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params

  if (!userId) {
    throw createError('User ID requis', 400)
  }

  try {
    const canPlay = await pdfService.checkUserCanPlay(userId)
    
    const response: ApiResponse<boolean> = {
      success: true,
      data: canPlay,
      message: canPlay 
        ? 'Utilisateur peut jouer' 
        : 'Utilisateur a déjà joué'
    }

    logger.info(`Vérification utilisateur: ${userId} - ${canPlay ? 'peut jouer' : 'a déjà joué'}`)
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de la vérification utilisateur:', error)
    throw createError('Erreur lors de la vérification utilisateur', 500)
  }
}))

// Enregistrer un résultat de jeu
router.post('/game-result', asyncHandler(async (req: Request, res: Response) => {
  // 1. Nettoyer toutes les données entrantes pour prévenir les attaques XSS
  const sanitizedGameData = sanitizeObject<GameSubmissionRequest>(req.body)
  const { userId, fullName, email, phone, selectedBox, hasWon, prizeName, prizeDescription } = sanitizedGameData

  // 2. Validation des données (après nettoyage)
  if (!userId || !fullName || !email || !phone || !selectedBox) {
    throw createError('Toutes les données utilisateur sont requises', 400)
  }

  if (selectedBox < 1 || selectedBox > 4) {
    throw createError('Boîte sélectionnée invalide', 400)
  }

  try {
    const canPlay = await pdfService.checkUserCanPlay(userId)
    if (!canPlay) {
      throw createError('Cet utilisateur a déjà participé au jeu', 400)
    }

    const identityExists = await pdfService.checkIdentityExists(email, phone, fullName)
    if (identityExists) {
      throw createError('Cette identité a déjà participé au jeu', 400)
    }

    // 3. Créer le résultat complet avec les données nettoyées
    const gameResult: GameResult = {
      userId,
      fullName,
      email,
      phone,
      selectedBox,
      hasWon,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    }

    // Ajoute les propriétés optionnelles uniquement si elles existent après nettoyage
    if (prizeName) {
      gameResult.prizeName = prizeName
    }
    if (prizeDescription) {
      gameResult.prizeDescription = prizeDescription
    }

    // Sauvegarder et mettre à jour le PDF global
    await pdfService.saveGameResult(gameResult)

    const response: GameSubmissionResponse = {
      success: true,
      result: gameResult,
      message: hasWon 
        ? 'Félicitations ! Votre gain a été enregistré.' 
        : 'Merci d\'avoir participé !'
    }

    logger.info(`Résultat de jeu enregistré: ${userId} - ${hasWon ? 'gagné' : 'perdu'} - Boîte ${selectedBox}`)
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de l\'enregistrement du résultat:', error)
    if (error instanceof Error && error.message.includes('déjà participé')) {
      throw createError(error.message, 400)
    }
    throw createError('Erreur lors de l\'enregistrement du résultat', 500)
  }
}))

// Télécharger le PDF global avec tous les résultats
router.get('/download-pdf', asyncHandler(async (_req: Request, res: Response) => {
  try {
    const pdfPath = pdfService.getGlobalPdfPath()
    const exists = await pdfService.globalPdfExists()
    
    if (!exists) {
      throw createError('Aucun rapport PDF disponible', 404)
    }

    const stats = await fs.stat(pdfPath)
    const fileName = `rapport_boites_mysteres_${new Date().toISOString().split('T')[0]}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Content-Length', stats.size)

    const fileStream = fs.createReadStream(pdfPath)
    fileStream.pipe(res)

    logger.info(`PDF téléchargé: ${fileName}`)
  } catch (error) {
    logger.error('Erreur lors du téléchargement du PDF:', error)
    throw createError('Erreur lors du téléchargement du PDF', 500)
  }
}))

// Voir le PDF global dans le navigateur
router.get('/view-pdf', asyncHandler(async (_req: Request, res: Response) => {
  try {
    const pdfPath = pdfService.getGlobalPdfPath()
    const exists = await pdfService.globalPdfExists()
    
    if (!exists) {
      throw createError('Aucun rapport PDF disponible', 404)
    }

    const stats = await fs.stat(pdfPath)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', stats.size)
    res.setHeader('Cache-Control', 'no-cache')

    const fileStream = fs.createReadStream(pdfPath)
    fileStream.pipe(res)

    logger.info('PDF affiché dans le navigateur')
  } catch (error) {
    logger.error('Erreur lors de l\'affichage du PDF:', error)
    throw createError('Erreur lors de l\'affichage du PDF', 500)
  }
}))

// Récupérer tous les résultats (pour l'administration)
router.get('/results', asyncHandler(async (_req: Request, res: Response) => {
  try {
    const results = await pdfService.getAllResults()
    
    const response: ApiResponse<GameResult[]> = {
      success: true,
      data: results,
      message: `${results.length} résultats trouvés`
    }

    logger.info(`Récupération des résultats: ${results.length} entrées`)
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de la récupération des résultats:', error)
    throw createError('Erreur lors de la récupération des résultats', 500)
  }
}))

// Récupérer les résultats récents
router.get('/recent-results', asyncHandler(async (req: Request, res: Response) => {
  try {
    const limit = parseInt((req.query as any)['limit'] as string) || 10
    const results = await pdfService.getRecentResults(limit)
    
    const response: ApiResponse<GameResult[]> = {
      success: true,
      data: results,
      message: `${results.length} résultats récents trouvés`
    }

    logger.info(`Récupération des résultats récents: ${results.length} entrées`)
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de la récupération des résultats récents:', error)
    throw createError('Erreur lors de la récupération des résultats récents', 500)
  }
}))

// Récupérer les statistiques du jeu
router.get('/stats', asyncHandler(async (_req: Request, res: Response) => {
  try {
    const stats = await pdfService.getStats()
    
    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      message: 'Statistiques récupérées avec succès'
    }

    logger.info('Statistiques récupérées')
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error)
    throw createError('Erreur lors de la récupération des statistiques', 500)
  }
}))

// Supprimer les données d'un utilisateur (admin)
router.delete('/user/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params

  if (!userId) {
    throw createError('User ID requis', 400)
  }

  try {
    await pdfService.deleteUserData(userId)
    
    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Données utilisateur supprimées avec succès et PDF mis à jour'
    }

    logger.info(`Données utilisateur supprimées: ${userId}`)
    
    res.json(response)
  } catch (error) {
    logger.error('Erreur lors de la suppression des données utilisateur:', error)
    throw createError('Erreur lors de la suppression des données utilisateur', 500)
  }
}))

// Route pour obtenir le stock des prix
router.get('/prize-stock', asyncHandler(async (_req: Request, res: Response) => {
  const stockPath = path.join(__dirname, '../../data/prize_stock.json')
  if (!(await fs.pathExists(stockPath))) {
    res.json({ vip: 10, canal: 10, goodies: 30 })
  }
  const stock = await fs.readJson(stockPath)
  res.json(stock)
}))

export default router 