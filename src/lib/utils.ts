import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1 ')
}

export function getRandomPrize(): { name: string; description: string; value: number } {
  const prizes = [
    {
      name: "iPhone 15 Pro",
      description: "Le dernier smartphone Apple avec des fonctionnalités révolutionnaires",
      value: 1199
    },
    {
      name: "MacBook Air M2",
      description: "Ordinateur portable ultra-léger avec puce M2",
      value: 1499
    },
    {
      name: "AirPods Pro",
      description: "Écouteurs sans fil avec réduction de bruit active",
      value: 249
    },
    {
      name: "iPad Air",
      description: "Tablette polyvalente pour la créativité et la productivité",
      value: 599
    },
    {
      name: "Apple Watch Series 9",
      description: "Montre connectée avec suivi de santé avancé",
      value: 399
    }
  ]
  
  return prizes[Math.floor(Math.random() * prizes.length)]
} 