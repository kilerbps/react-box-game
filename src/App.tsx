import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RegistrationForm from './components/RegistrationForm'
import GameBoard from './components/GameBoard'
import ResultPage from './components/ResultPage'
import { GameResult, UserData } from './types/game'
import { Toaster } from './components/ui/toaster'
import logo from './assets/logo.png'
import { Volume2, VolumeX } from 'lucide-react'

type GameStep = 'registration' | 'game' | 'result'

function App() {
  const [currentStep, setCurrentStep] = useState<GameStep>('registration')
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const ambianceRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!ambianceRef.current) {
      ambianceRef.current = new Audio('/sounds/ambiance.mp3');
      ambianceRef.current.loop = true;
      ambianceRef.current.volume = 0.8;
    }
    if (soundOn && ambianceRef.current) {
      ambianceRef.current.currentTime = 0;
      ambianceRef.current.play().catch(() => {});
    } else if (ambianceRef.current) {
      ambianceRef.current.pause();
      ambianceRef.current.currentTime = 0;
    }
    return () => {
      if (ambianceRef.current) {
        ambianceRef.current.pause();
        ambianceRef.current.currentTime = 0;
      }
    };
  }, [soundOn]);

  const handleRegistrationComplete = (data: UserData) => {
    setUserData(data)
    setCurrentStep('game')
  }

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result)
    setCurrentStep('result')
  }

  const handleCloseResult = () => {
    // Rediriger vers le formulaire d'inscription pour une nouvelle partie
    setCurrentStep('registration')
    setGameResult(null)
    setUserData(null)
  }

  const handleSoundToggle = () => {
    setSoundOn((prev) => !prev)
  }

  // Si on est sur la page de résultats, afficher uniquement cette page
  if (currentStep === 'result' && gameResult) {
    return <ResultPage result={gameResult} onClose={handleCloseResult} />
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden animated-gradient">
      {/* Icône volume flottante globale */}
      <button
        onClick={handleSoundToggle}
        className={`fixed top-4 right-4 z-50 bg-black/70 rounded-full p-2 shadow-lg border-2 border-[#E50914] hover:bg-[#E50914] transition-colors`}
        title={soundOn ? "Désactiver le son d'ambiance" : "Activer le son d'ambiance"}
      >
        {soundOn ? (
          <Volume2 className="w-5 h-5 text-[#E50914]" />
        ) : (
          <VolumeX className="w-5 h-5 text-white" />
        )}
      </button>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
            <img 
              src={logo} 
              alt="Mystery Box Game Logo" 
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-[#E50914] bg-black animate-heartbeat"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#E50914] bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Ultimate Streaming Experience
          </h1>
          <p className="text-md text-gray-200 max-w-2xl mx-auto">
            Bienvenue dans le ultimate streaming experience.
          </p>
          <div className="mt-4 p-4 bg-[#E50914]/10 border border-[#E50914] rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-[#E50914]">
              ⚠️ <strong>Important :</strong> Une seule participation par personne est autorisée.
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 'registration' && (
            <motion.div
              key="registration"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <RegistrationForm onComplete={handleRegistrationComplete} />
            </motion.div>
          )}

          {currentStep === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <GameBoard 
                userData={userData} 
                onComplete={handleGameComplete} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
      <style>{`
        .animated-gradient {
          background: linear-gradient(-45deg, #000000, #2a0008, #1a0004, #000000, #910F30, #000000);
          background-size: 400% 400%;
          animation: gradientWave 4s ease-in-out infinite;
        }
        
        @keyframes gradientWave {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.1);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(1);
          }
        }
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default App