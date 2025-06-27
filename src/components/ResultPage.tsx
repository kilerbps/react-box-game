import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { GameResult } from '../types/game'
import { Trophy, Gift, Calendar, User, Mail, Phone, X } from 'lucide-react'
import logo from '../assets/logo.png'

interface ResultPageProps {
  result: GameResult
  onClose: () => void
}

export default function ResultPage({ result, onClose }: ResultPageProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (result.hasWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#2a0008] to-black relative overflow-hidden">
        {/* Guirlandes animées */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['🎉', '🎊', '⭐', '🎈', '🎁'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {/* En-tête de félicitations */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
                🎉 FÉLICITATIONS ! 🎉
              </h1>
              <p className="text-xl text-white">
                Vous avez gagné un prix extraordinaire !
              </p>
            </motion.div>

            {/* Carte du prix */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-black to-[#910F30] rounded-2xl shadow-2xl p-8 mb-8 border-4 border-[#910F30]"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gift className="w-20 h-20 mx-auto mb-4 text-[#E50914]" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {result.prizeName || 'Prix Mystère'}
                </h2>
                {result.prizeDescription && (
                  <p className="text-lg text-white/80 mb-6">
                    {result.prizeDescription}
                  </p>
                )}
                <div className="bg-[#181818] rounded-lg p-4 border border-[#E50914]">
                  <p className="text-[#E50914] font-semibold">
                    ✉️ Un email de confirmation vous sera envoyé prochainement
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Détails de la participation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-black to-[#910F30] rounded-xl shadow-lg p-6 mb-8 border border-[#910F30]"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                📋 Détails de votre participation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-[#E50914]" />
                  <span className="text-white/90">{result.fullName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#E50914]" />
                  <span className="text-white/90">{result.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#E50914]" />
                  <span className="text-white/90">{result.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-[#E50914]">📦</span>
                  <span className="text-white/90">Boîte gagnante : {result.selectedBox}</span>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <Calendar className="w-5 h-5 text-[#E50914]" />
                  <span className="text-white/90">{formatDate(result.timestamp)}</span>
                </div>
              </div>
            </motion.div>

            {/* Bouton fermer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-[#E50914] to-[#910F30] hover:from-[#910F30] hover:to-[#E50914] text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-[#E50914]"
              >
                <X className="w-5 h-5 mr-2" />
                Fermer
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Page pour les perdants
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#2a0010]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* En-tête de remerciement */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <img src={logo} alt="Logo du jeu" className="w-24 h-24 mx-auto rounded-full border-4 border-[#E50914] bg-black shadow-lg" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              <span className="text-white bg-none">Merci d'avoir joué !</span>
            </h1>
            <p className="text-xl text-white/80">
              Votre participation nous fait plaisir
            </p>
          </motion.div>

          {/* Carte de remerciement */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-black to-[#910F30] rounded-2xl shadow-xl p-8 mb-8 border-2 border-[#910F30]"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#181818] rounded-full flex items-center justify-center border border-[#E50914]">
                <span className="text-4xl text-[#E50914]">😊</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Pas de chance cette fois-ci
              </h2>
              <p className="text-lg text-white/80 mb-6">
                Vous avez choisi la boîte {result.selectedBox}, mais le prix était dans une autre boîte.
                <br />
                <span className="text-[#E50914] font-semibold">
                  Merci d'avoir participé à notre Ultimate Streaming Experience !
                </span>
              </p>
              <div className="bg-[#181818] rounded-lg p-4 border border-[#E50914]">
                <p className="text-[#E50914]">
                  💝 Votre participation est précieuse pour nous
                </p>
              </div>
            </div>
          </motion.div>

          {/* Détails de la participation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-black to-[#910F30] rounded-xl shadow-lg p-6 mb-8 border border-[#910F30]"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              📋 Détails de votre participation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-[#E50914]" />
                <span className="text-white/90">{result.fullName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#E50914]" />
                <span className="text-white/90">{result.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#E50914]" />
                <span className="text-white/90">{result.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-[#E50914]">📦</span>
                <span className="text-white/90">Boîte choisie : {result.selectedBox}</span>
              </div>
              <div className="flex items-center space-x-3 md:col-span-2">
                <Calendar className="w-5 h-5 text-[#E50914]" />
                <span className="text-white/90">{formatDate(result.timestamp)}</span>
              </div>
            </div>
          </motion.div>

          {/* Bouton fermer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-[#E50914] to-[#910F30] hover:from-[#910F30] hover:to-[#E50914] text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-[#E50914]"
            >
              <X className="w-5 h-5 mr-2" />
              Fermer
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 