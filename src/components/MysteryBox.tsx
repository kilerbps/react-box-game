import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Box, Prize } from '../types/game'
import IllustrationFuturiste from '../assets/illustration-futuriste.svg'
import { useState } from 'react'

interface MysteryBoxProps {
  box: Box
  onSelect: () => void
  disabled: boolean
  prize: Prize | null
}

const bipAudio = typeof window !== 'undefined' ? new Audio('/sounds/bip.mp3') : null;
const tadamAudio = typeof window !== 'undefined' ? new Audio('/sounds/tadam.mp3') : null;
const buzzAudio = typeof window !== 'undefined' ? new Audio('/sounds/buzz.mp3') : null;

export default function MysteryBox({ 
  box, 
  onSelect, 
  disabled, 
  prize 
}: MysteryBoxProps) {
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = () => {
    if (disabled || box.isRevealed) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      onSelect();
    }, 700);
  };

  const handleMouseEnter = () => {
    if (!disabled && !box.isRevealed && bipAudio) {
      bipAudio.currentTime = 0;
      bipAudio.play();
    }
  };

  const getBoxClass = () => {
    if (!box.isRevealed) {
      return box.isSelected ? 'mystery-box selected' : 'mystery-box'
    }
    
    if (box.hasPrize) {
      return 'mystery-box winner'
    }
    
    return 'mystery-box loser'
  }

  const getBoxContent = () => {
    if (!box.isRevealed) {
      return (
        <div className="text-center">
          <img src={IllustrationFuturiste} alt="Boîte mystère" className={`w-16 h-16 mx-auto mb-2 transition-transform duration-200 ${isShaking ? 'shake-box' : ''}`} />
          <p className="text-white font-semibold">Boîte {box.id}</p>
          <p className="text-white/80 text-sm">Cliquez pour révéler</p>
        </div>
      )
    }

    if (box.hasPrize) {
      if (tadamAudio) { setTimeout(() => { tadamAudio.currentTime = 0; tadamAudio.play(); }, 100); }
      return (
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-white font-bold text-lg">🎉 PRIX !</p>
          {prize && (
            <div className="mt-2">
              <p className="text-white font-semibold">{prize.name}</p>
              <p className="text-white/80 text-xs">{prize.description}</p>
            </div>
          )}
        </div>
      )
    }

    if (!box.hasPrize) {
      if (buzzAudio) { setTimeout(() => { buzzAudio.currentTime = 0; buzzAudio.play(); }, 100); }
    }

    return (
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-white font-semibold">Vide</p>
        <p className="text-white/80 text-sm">Pas de prix</p>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={!disabled && !box.isRevealed ? { scale: 1.05 } : {}}
      whileTap={!disabled && !box.isRevealed ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
      onMouseEnter={handleMouseEnter}
    >
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          w-full h-48 rounded-xl border-4 border-white shadow-2xl
          ${getBoxClass()}
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          ${box.isSelected ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {getBoxContent()}
        </div>
        
        {/* Effet de brillance */}
        {!box.isRevealed && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </button>

      {/* Indicateur de sélection */}
      {box.isSelected && !box.isRevealed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white font-bold text-sm">✓</span>
        </motion.div>
      )}

      {/* Numéro de la boîte */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
        {box.id}
      </div>
    </motion.div>
  )
} 