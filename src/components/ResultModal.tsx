import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { GameResult } from '../types/game'
import { Trophy, Gift, Calendar, User, Mail, Phone } from 'lucide-react'

interface ResultModalProps {
  result: GameResult
  onPlayAgain: () => void
}

export default function ResultModal({ result, onPlayAgain }: ResultModalProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {result.hasWon ? '🎉 Félicitations !' : '😔 Dommage !'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résultat principal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            {result.hasWon ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Vous avez gagné !
                </h3>
                {result.prizeName && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-gray-900">{result.prizeName}</p>
                    {result.prizeDescription && (
                      <p className="text-sm text-gray-600 mt-1">{result.prizeDescription}</p>
                    )}
                  </div>
                )}
                <p className="text-green-700">
                  Un email de confirmation vous sera envoyé prochainement.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">😔</span>
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Pas de chance cette fois-ci
                </h3>
                <p className="text-red-700">
                  Vous avez choisi la boîte {result.selectedBox}, mais le prix était dans une autre boîte.
                </p>
              </div>
            )}
          </motion.div>

          {/* Détails de la partie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <h4 className="font-semibold text-gray-900 mb-3">Détails de votre participation</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{result.fullName}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{result.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{result.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 text-gray-500">📦</span>
                <span className="text-gray-700">Boîte sélectionnée : {result.selectedBox}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{formatDate(result.timestamp)}</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col space-y-3"
          >
            <Button
              onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              🎮 Rejouer avec une nouvelle identité
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Merci d'avoir participé au Mystery Box Game !
              </p>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 