import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../hooks/use-toast'
import { apiService } from '../services/api'
import { GameResult, Box, UserData, Prize } from '../types/game'
import MysteryBox from './MysteryBox'
import { Loader2 } from 'lucide-react'

const ALL_PRIZES: (Prize & { key: string })[] = [
  { name: 'Pass VIP pour la soirée', key: 'vip', description: 'Accès exclusif à la soirée événement.', value: 200 },
  { name: 'Box connectée Canal +', key: 'canal', description: 'Profitez de vos contenus préférés en streaming.', value: 150 },
  { name: 'Goodies', key: 'goodies', description: 'Cadeaux et accessoires exclusifs.', value: 30 }
]

interface GameBoardProps {
  userData: UserData | null;
  onComplete: (result: GameResult) => void;
}

function pickRandomPrize(availablePrizes: (Prize & { key: string })[]): (Prize & { key: string }) | null {
  if (!availablePrizes.length) return null
  const idx = Math.floor(Math.random() * availablePrizes.length)
  return availablePrizes[idx]
}

// Fonction locale pour créer un effet de confettis
const createConfetti = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    confetti.style.position = 'fixed'
    confetti.style.left = Math.random() * 100 + 'vw'
    confetti.style.top = '-10px'
    confetti.style.width = '10px'
    confetti.style.height = '10px'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.borderRadius = '50%'
    confetti.style.pointerEvents = 'none'
    confetti.style.zIndex = '9999'
    confetti.style.animationDelay = Math.random() * 3 + 's'
    confetti.className = 'confetti'
    
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      if (document.body.contains(confetti)) {
        document.body.removeChild(confetti)
      }
    }, 3000)
  }
}

const ambianceAudio = typeof window !== 'undefined' ? new Audio('/sounds/ambiance.mp3') : null;

export default function GameBoard({ userData, onComplete }: GameBoardProps) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const { toast } = useToast();
  const [prizeStock, setPrizeStock] = useState<{ vip: number; canal: number; goodies: number } | null>(null)
  const [gameDisabled, setGameDisabled] = useState(false)

  useEffect(() => {
    // Charger le stock des prix au montage
    apiService.getPrizeStock().then(stock => {
      setPrizeStock(stock)
      if (Object.values(stock as Record<string, number>).every((v: number) => v <= 0)) setGameDisabled(true)
    }).catch(() => {
      toast({ title: 'Erreur', description: 'Impossible de charger le stock des prix', variant: 'destructive' })
      setGameDisabled(true)
    })
    // Initialise le plateau de jeu
    const winningBox = Math.floor(Math.random() * 4) + 1;
    const initialBoxes: Box[] = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      isSelected: false,
      isRevealed: false,
      hasPrize: i + 1 === winningBox,
    }));
    setBoxes(initialBoxes);
  }, []);

  useEffect(() => {
    // Ne rien faire si les données ne sont pas prêtes
    if (!userData) return;

    const checkUserCanPlay = async () => {
      try {
        const response = await apiService.checkUser(userData.userId);
        if (!response.data) {
          toast({
            title: "Participation impossible",
            description: "Vous avez déjà joué. Une seule tentative est autorisée.",
            variant: "destructive",
          });
          // Ici, on pourrait rediriger ou bloquer l'interface
        }
      } catch (error) {
        toast({
          title: "Erreur réseau",
          description: "Impossible de vérifier votre statut de joueur.",
          variant: "destructive",
        });
      }
    };
    checkUserCanPlay();
  }, [userData, toast]);

  useEffect(() => {
    if (ambianceAudio) {
      ambianceAudio.loop = true;
      ambianceAudio.volume = 0.25;
      ambianceAudio.currentTime = 0;
      ambianceAudio.play().catch(() => {});
    }
    return () => {
      if (ambianceAudio) {
        ambianceAudio.pause();
        ambianceAudio.currentTime = 0;
      }
    };
  }, []);

  const handleBoxSelect = async (boxId: number) => {
    // Bloquer si les données ne sont pas prêtes
    if (!userData) return;
    
    // Bloquer le clic si on révèle déjà
    if (isRevealing) return;
    if (gameDisabled) return;

    // Démarrer le son d'ambiance au premier clic utilisateur
    if (ambianceAudio && ambianceAudio.paused) {
      ambianceAudio.loop = true;
      ambianceAudio.volume = 0.25;
      ambianceAudio.currentTime = 0;
      ambianceAudio.play().catch(() => {});
    }

    setIsRevealing(true);

    // Mettre à jour la boîte sélectionnée
    setBoxes(prevBoxes => prevBoxes.map(box => ({
      ...box,
      isSelected: box.id === boxId
    })));

    setTimeout(async () => {
      const selectedBox = boxes.find(b => b.id === boxId);
      const hasWon = selectedBox?.hasPrize || false;

      setBoxes(boxes.map(b => ({ ...b, isRevealed: true })));

      const gameResult: Omit<GameResult, 'timestamp' | 'ipAddress' | 'userAgent'> = {
        userId: userData.userId,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        selectedBox: boxId,
        hasWon,
      };

      if (hasWon && prizeStock) {
        // Déterminer les prix disponibles
        const availablePrizes = ALL_PRIZES.filter(p => prizeStock[(p.key as keyof typeof prizeStock)] > 0)
        const selectedPrize: (Prize & { key: string }) | null = pickRandomPrize(availablePrizes)
        if (selectedPrize && typeof selectedPrize === 'object' && 'name' in selectedPrize && 'description' in selectedPrize) {
          const nameStr = '' + selectedPrize['name'];
          const descStr = '' + selectedPrize['description'];
          (gameResult as GameResult).prizeName = nameStr;
          (gameResult as GameResult).prizeDescription = descStr;
          createConfetti();
        }
      }

      try {
        const submissionResponse = await apiService.submitGameResult(gameResult);
        onComplete(submissionResponse.result);
      } catch (error) {
        toast({
          title: "Erreur de soumission",
          description: "Impossible d'enregistrer votre résultat. Veuillez réessayer.",
          variant: "destructive",
        });
        setIsRevealing(false); // Permettre de réessayer
      }
    }, 2000);
  };

  // Afficher un état de chargement si les données ne sont pas là
  if (!userData || !prizeStock) {
    return (
      <div className="text-center p-8">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Chargement des informations...</p>
      </div>
    );
  }

  if (gameDisabled) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Tous les lots ont été gagnés !</h2>
        <p className="text-lg text-white/80">Il n'y a plus de prix à remporter. Merci pour votre participation.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          Faites votre choix, {userData.fullName} !
        </h2>
        <p className="text-lg text-white mt-2">
          Une seule boîte contient un prix. Bonne chance !
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {boxes.map(box => (
          <MysteryBox
            key={box.id}
            box={box}
            onSelect={() => handleBoxSelect(box.id)}
            disabled={isRevealing}
            prize={box.hasPrize && prizeStock ? pickRandomPrize(ALL_PRIZES.filter(p => prizeStock[(p.key as keyof typeof prizeStock)] > 0)) : null}
          />
        ))}
      </div>
    </motion.div>
  );
} 