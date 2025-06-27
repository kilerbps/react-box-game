# Backend - Jeu de Boîtes Mystères

Backend Express.js avec TypeScript pour le jeu de boîtes mystères utilisant des fichiers JSON et générant un rapport PDF unique avec tous les résultats.

## Fonctionnalités

- ✅ API REST complète pour le jeu
- ✅ Stockage des données en JSON
- ✅ **Un seul PDF global** mis à jour automatiquement
- ✅ Vérification d'identité pour éviter les doublons
- ✅ Statistiques en temps réel
- ✅ Sécurité et validation des données
- ✅ Logs détaillés
- ✅ Téléchargement et visualisation du PDF

## Installation

```bash
cd backend
npm install
```

## Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Structure des données

### Fichier JSON : `data/game_results.json`
```json
[
  {
    "userId": "user_1234567890_abc123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "123456789",
    "selectedBox": 2,
    "hasWon": true,
    "prizeName": "iPhone 15",
    "prizeDescription": "Smartphone dernier cri",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
]
```

### Fichier PDF unique : `data/reports/tous_les_resultats.pdf`
- **Un seul PDF** qui contient tous les résultats
- **Mis à jour automatiquement** à chaque nouveau joueur
- Contient :
  - Statistiques générales
  - Répartition des boîtes
  - Liste complète des participants
  - Informations détaillées de chaque joueur

## API Endpoints

### Jeu
- `POST /api/check-identity` - Vérifier si une identité existe
- `GET /api/check-user/:userId` - Vérifier si un utilisateur peut jouer
- `POST /api/game-result` - Enregistrer un résultat de jeu

### PDF et Rapports
- `GET /api/download-pdf` - **Télécharger le PDF global**
- `GET /api/view-pdf` - **Voir le PDF dans le navigateur**

### Administration
- `GET /api/results` - Récupérer tous les résultats
- `GET /api/recent-results` - Récupérer les résultats récents
- `GET /api/stats` - Récupérer les statistiques du jeu
- `DELETE /api/user/:userId` - Supprimer les données d'un utilisateur

## Structure des fichiers

```
backend/
├── data/
│   ├── game_results.json           # Données des résultats
│   └── reports/
│       └── tous_les_resultats.pdf  # PDF unique avec tous les résultats
├── src/
│   ├── services/
│   │   └── pdfService.ts           # Service PDF
│   ├── routes/
│   │   └── game.ts                 # Routes API
│   └── index.ts                    # Point d'entrée
└── package.json
```

## Avantages du système PDF unique

1. **Simplicité** : Un seul fichier à gérer
2. **Mise à jour automatique** : Le PDF se régénère à chaque nouveau joueur
3. **Rapport complet** : Toutes les informations dans un seul document
4. **Facilité d'accès** : Un seul lien pour télécharger tout
5. **Performance** : Pas de multiplication de fichiers
6. **Organisation** : Données structurées et faciles à lire

## Contenu du PDF global

Le PDF `tous_les_resultats.pdf` contient :

### 📊 Statistiques générales
- Total des participants
- Nombre de gagnants
- Taux de réussite
- Boîte la plus populaire

### 📦 Répartition des boîtes
- Statistiques détaillées pour chaque boîte
- Pourcentages de sélection

### 👥 Liste complète des participants
- Tous les joueurs triés par date (plus récent en premier)
- Informations complètes : nom, email, boîte choisie, résultat, prix
- Statut visuel : 🎉 GAGNÉ ou 😔 Perdu

### 📅 Informations de mise à jour
- Date de dernière mise à jour
- Total des participants

## Utilisation

### Télécharger le PDF
```bash
curl http://localhost:3002/api/download-pdf -o rapport.pdf
```

### Voir le PDF dans le navigateur
```
http://localhost:3002/api/view-pdf
```

### Accéder aux statistiques
```bash
curl http://localhost:3002/api/stats
```

## Sécurité

- Rate limiting configuré
- Validation des données d'entrée
- Vérification d'identité pour éviter les doublons
- Logs détaillés pour le monitoring
- Gestion d'erreurs robuste

## Variables d'environnement

- `PORT` - Port du serveur (défaut: 3002)
- `NODE_ENV` - Environnement (development/production)

## Exemple d'utilisation

1. **Jouer au jeu** : Les données sont sauvegardées en JSON
2. **PDF automatique** : Le PDF global est mis à jour automatiquement
3. **Télécharger le rapport** : Accéder à `/api/download-pdf`
4. **Voir en ligne** : Accéder à `/api/view-pdf`

**Le système est maintenant optimisé avec un seul PDF qui se met à jour automatiquement !** 🎉 