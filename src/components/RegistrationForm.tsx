import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from '../hooks/use-toast'
import { apiService } from '../services/api'
import { generateUserId, formatPhone } from '../lib/utils'
import { UserData } from '../types/game'

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface RegistrationFormProps {
  onComplete: (data: UserData) => void
}

export default function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const phoneValue = watch('phone')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '')
    if (value.length <= 15) {
      setValue('phone', formatPhone(value))
    }
  }

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Vérifier si l'identité existe déjà
      const identityCheck = await apiService.checkIdentity({
        email: data.email,
        phone: data.phone,
      })

      if (identityCheck.exists) {
        toast({
          title: "Erreur",
          description: "Cette identité a déjà participé au jeu. Une seule tentative par personne est autorisée.",
          variant: "destructive",
        })
        return
      }

      // Générer un ID utilisateur unique
      const userId = generateUserId()

      const userData = {
        ...data,
        userId,
      }

      // Passer à l'étape suivante
      onComplete(userData)
      
      toast({
        title: "Inscription réussie !",
        description: "Vos informations ont été enregistrées. Préparez-vous à choisir votre boîte mystère !",
      })

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-md mx-auto"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 Inscription au Jeu
          </h2>
          <p className="text-gray-600">
            Remplissez vos informations pour participer au jeu de boîtes mystères.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              placeholder="Votre nom complet"
              {...register('fullName')}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+243 81 243 0000"
              value={phoneValue || ''}
              onChange={handlePhoneChange}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Vérification en cours...</span>
              </div>
            ) : (
              'Commencer le jeu 🎁'
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  )
} 