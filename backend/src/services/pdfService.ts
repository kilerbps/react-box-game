import PDFDocument from 'pdfkit'
import fs from 'fs-extra'
import path from 'path'
import { GameResult } from '../types/game'
import { logger } from '../utils/logger'
import { readJson, writeJson, pathExists } from 'fs-extra'
import { remove as removeDiacritics } from 'diacritics'

const PRIZE_STOCK_FILE = path.join(__dirname, '../../data/prize_stock.json')

async function getPrizeStock() {
  if (!(await pathExists(PRIZE_STOCK_FILE))) {
    const initial = { vip: 10, canal: 10, goodies: 30 }
    await writeJson(PRIZE_STOCK_FILE, initial, { spaces: 2 })
    return initial
  }
  return await readJson(PRIZE_STOCK_FILE)
}

async function updatePrizeStock(key: string) {
  const stock = await getPrizeStock()
  if (stock[key] > 0) {
    stock[key] -= 1
    await writeJson(PRIZE_STOCK_FILE, stock, { spaces: 2 })
  }
}

async function isAllPrizesDepleted() {
  const stock = await getPrizeStock()
  return Object.values(stock as Record<string, number>).reduce((acc, v: number) => acc + v, 0) <= 0
}

function normalizeName(name: string): string {
  return removeDiacritics(name).toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
}

export class PDFService {
  private dataDir: string
  private resultsFile: string
  private pdfDir: string
  private globalPdfFile: string

  constructor() {
    this.dataDir = path.join(__dirname, '../../data')
    this.resultsFile = path.join(this.dataDir, 'game_results.json')
    this.pdfDir = path.join(this.dataDir, 'reports')
    this.globalPdfFile = path.join(this.pdfDir, 'tous_les_resultats.pdf')
    
    this.ensureDirectories()
    this.initializeResultsFile()
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await fs.ensureDir(this.dataDir)
      await fs.ensureDir(this.pdfDir)
      logger.info('Répertoires de données créés')
    } catch (error) {
      logger.error('Erreur lors de la création des répertoires:', error)
    }
  }

  private async initializeResultsFile(): Promise<void> {
    try {
      const exists = await fs.pathExists(this.resultsFile)
      if (!exists) {
        await fs.writeJson(this.resultsFile, [])
        logger.info('Fichier de résultats initialisé')
      }
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation du fichier de résultats:', error)
    }
  }

  async saveGameResult(result: GameResult): Promise<void> {
    try {
      if (await isAllPrizesDepleted()) {
        logger.warn('Tous les lots sont épuisés, aucun résultat n\'est enregistré.')
        return
      }
      const results = await this.getAllResults()
      if (result.hasWon && result.prizeName) {
        let prizeKey = null
        if (/vip/i.test(result.prizeName)) prizeKey = 'vip'
        else if (/canal/i.test(result.prizeName)) prizeKey = 'canal'
        else if (/goodies?/i.test(result.prizeName)) prizeKey = 'goodies'
        if (prizeKey) {
          const stock = await getPrizeStock()
          if (stock[prizeKey] > 0) {
            await updatePrizeStock(prizeKey)
          } else {
            logger.warn(`Le lot ${result.prizeName} est épuisé, gain non attribué.`)
            return
          }
        }
      }
      results.push(result)
      await fs.writeJson(this.resultsFile, results, { spaces: 2 })
      
      // Générer le PDF global avec tous les résultats
      await this.generateGlobalPDF(results)
      
      logger.info(`Résultat enregistré: ${result.userId} - ${result.hasWon ? 'gagné' : 'perdu'}`)
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement:', error)
      throw new Error('Impossible d\'enregistrer le résultat')
    }
  }

  async checkIdentityExists(email: string, phone: string, fullName?: string): Promise<boolean> {
    try {
      const results = await this.getAllResults()
      const emailExists = results.some(r => r.email.toLowerCase() === email.toLowerCase())
      if (emailExists) return true
      const normalizedPhone = phone.replace(/\s/g, '')
      const phoneExists = results.some(r => r.phone.replace(/\s/g, '') === normalizedPhone)
      if (phoneExists) return true

      if (fullName) {
        const normName = normalizeName(fullName)
        for (const r of results) {
          const rNormName = normalizeName(r.fullName)
          if (rNormName === normName && (r.email.toLowerCase() === email.toLowerCase() || r.phone.replace(/\s/g, '') === normalizedPhone)) {
            return true
          }
        }
      }
      return false
    } catch (error) {
      logger.error('Erreur lors de la vérification d\'identité:', error)
      throw error
    }
  }

  async checkUserCanPlay(userId: string): Promise<boolean> {
    try {
      const results = await this.getAllResults()
      return !results.some(r => r.userId === userId)
    } catch (error) {
      logger.error('Erreur lors de la vérification utilisateur:', error)
      throw error
    }
  }

  async getAllResults(): Promise<GameResult[]> {
    try {
      const exists = await fs.pathExists(this.resultsFile)
      if (!exists) return []
      
      const data = await fs.readJson(this.resultsFile)
      return Array.isArray(data) ? data : []
    } catch (error) {
      logger.error('Erreur lors de la lecture des résultats:', error)
      return []
    }
  }

  async getStats(): Promise<{
    totalPlayers: number
    winners: number
    winRate: number
    mostSelectedBox: number
    boxStats: Record<number, number>
  }> {
    try {
      const results = await this.getAllResults()
      
      const totalPlayers = results.length
      const winners = results.filter(r => r.hasWon).length
      const winRate = totalPlayers > 0 ? (winners / totalPlayers) * 100 : 0
      
      const boxStats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
      results.forEach(r => {
        if (r.selectedBox >= 1 && r.selectedBox <= 4) {
          boxStats[r.selectedBox] = (boxStats[r.selectedBox] || 0) + 1
        }
      })
      
      const mostSelectedBox = Object.entries(boxStats).reduce((a, b) => 
        (boxStats[parseInt(a[0])] || 0) > (boxStats[parseInt(b[0])] || 0) ? a : b
      )[0]

      return {
        totalPlayers,
        winners,
        winRate,
        mostSelectedBox: parseInt(mostSelectedBox),
        boxStats
      }
    } catch (error) {
      logger.error('Erreur lors du calcul des statistiques:', error)
      throw error
    }
  }

  async getRecentResults(limit: number = 10): Promise<GameResult[]> {
    try {
      const results = await this.getAllResults()
      return results.slice(-limit).reverse()
    } catch (error) {
      logger.error('Erreur lors de la récupération des résultats récents:', error)
      throw error
    }
  }

  async deleteUserData(userId: string): Promise<void> {
    try {
      const results = await this.getAllResults()
      const filteredResults = results.filter(r => r.userId !== userId)
      await fs.writeJson(this.resultsFile, filteredResults, { spaces: 2 })
      
      // Régénérer le PDF global
      await this.generateGlobalPDF(filteredResults)
      
      logger.info(`Données utilisateur supprimées: ${userId}`)
    } catch (error) {
      logger.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  private async generateGlobalPDF(results: GameResult[]): Promise<void> {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      })

      const stream = fs.createWriteStream(this.globalPdfFile)
      doc.pipe(stream)

      // En-tête
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('🎁 RAPPORT COMPLET - JEU DE BOÎTES MYSTÈRES', { align: 'center' })
        .moveDown()

      // Statistiques générales
      const stats = await this.getStats()
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .text('📊 STATISTIQUES GÉNÉRALES')
        .moveDown(0.5)

      doc.fontSize(12)
        .font('Helvetica')
        .text(`Total des participants: ${stats.totalPlayers}`)
        .text(`Nombre de gagnants: ${stats.winners}`)
        .text(`Taux de réussite: ${stats.winRate.toFixed(2)}%`)
        .text(`Boîte la plus populaire: ${stats.mostSelectedBox}`)
        .moveDown()

      // Répartition des boîtes
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .text('📦 RÉPARTITION DES CHOIX DE BOÎTES')
        .moveDown(0.5)

      Object.entries(stats.boxStats).forEach(([box, count]) => {
        const percentage = stats.totalPlayers > 0 ? ((count / stats.totalPlayers) * 100).toFixed(1) : '0'
        doc.fontSize(10)
          .font('Helvetica')
          .text(`Boîte ${box}: ${count} sélection(s) (${percentage}%)`)
      })

      doc.moveDown()

      // Liste de tous les participants
      if (results.length > 0) {
        doc.fontSize(16)
          .font('Helvetica-Bold')
          .text('👥 LISTE COMPLÈTE DES PARTICIPANTS')
          .moveDown(0.5)

        // Trier par date (plus récent en premier)
        const sortedResults = [...results].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        sortedResults.forEach((result, index) => {
          const date = new Date(result.timestamp).toLocaleString('fr-FR')
          const status = result.hasWon ? '🎉 GAGNÉ' : '😔 Perdu'
          const prize = result.hasWon && result.prizeName ? ` - ${result.prizeName}` : ''
          
          doc.fontSize(9)
            .font('Helvetica-Bold')
            .text(`${index + 1}. ${result.fullName}`, { continued: true })
            .font('Helvetica')
            .fontSize(8)
            .text(` - ${result.email} - ${result.phone} - Boîte ${result.selectedBox} - ${status}${prize} - ${date}`)
          
          // Ajouter une ligne de séparation si ce n'est pas le dernier
          if (index < sortedResults.length - 1) {
            doc.moveDown(0.2)
          }
        })

        doc.moveDown()

        // Section détaillée des informations
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .text('📋 INFORMATIONS DÉTAILLÉES DES PARTICIPANTS')
          .moveDown(0.5)

        sortedResults.forEach((result, index) => {
          doc.fontSize(10)
            .font('Helvetica-Bold')
            .text(`Participant ${index + 1}:`)
          doc.font('Helvetica').fontSize(9)
          doc.text(`   Nom complet: ${result.fullName}`)
          doc.text(`   Email: ${result.email}`)
          doc.text(`   Téléphone: ${result.phone}`)
          doc.text(`   Boîte sélectionnée: ${result.selectedBox}`)
          doc.text(`   Résultat: ${result.hasWon ? '🎉 GAGNÉ' : '😔 Perdu'}`)
          if (result.hasWon && result.prizeName) {
            doc.text(`   Prix gagné: ${result.prizeName}`)
            if (result.prizeDescription) {
              doc.text(`   Description: ${result.prizeDescription}`)
            }
          }
          doc.text(`   Date de participation: ${new Date(result.timestamp).toLocaleString('fr-FR')}`)
          doc.text(`   ID utilisateur: ${result.userId}`)
          // Ajouter une ligne de séparation
          if (index < sortedResults.length - 1) {
            doc.moveDown(0.3)
          }
        })
      }

      // Pied de page
      doc.moveDown(2)
        .fontSize(8)
        .font('Helvetica')
        .text('Document généré automatiquement par le système de jeu de boîtes mystères', { align: 'center' })
        .text(`Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}`, { align: 'center' })
        .text(`Total des participants: ${results.length}`, { align: 'center' })

      doc.end()

      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          logger.info(`PDF global mis à jour: ${this.globalPdfFile} (${results.length} participants)`)
          resolve()
        })
        stream.on('error', reject)
      })
    } catch (error) {
      logger.error('Erreur lors de la génération du PDF global:', error)
      throw error
    }
  }

  // Méthode pour obtenir le chemin du PDF global
  getGlobalPdfPath(): string {
    return this.globalPdfFile
  }

  // Méthode pour vérifier si le PDF global existe
  async globalPdfExists(): Promise<boolean> {
    return await fs.pathExists(this.globalPdfFile)
  }
}

export const pdfService = new PDFService() 