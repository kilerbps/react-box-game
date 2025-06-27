import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// On doit simuler un environnement "Window" pour que DOMPurify fonctionne dans Node.js
const window = new JSDOM('').window;
const dompurify = DOMPurify(window as any);

/**
 * Nettoie une chaîne de caractères pour supprimer TOUT code HTML/JavaScript.
 * @param dirty La chaîne de caractères potentiellement "sale" à nettoyer.
 * @returns La chaîne de caractères nettoyée, ne contenant que du texte brut.
 */
export function sanitize(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return dompurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

/**
 * Nettoie un objet entier en appliquant la fonction de nettoyage à toutes ses propriétés de type string.
 * @param obj L'objet à nettoyer.
 * @returns Un nouvel objet avec toutes les valeurs de type string nettoyées.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitize(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
} 