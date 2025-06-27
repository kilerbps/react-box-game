# 🎁 Mystery Box Game

Un jeu interactif de boîtes mystères développé avec React, TypeScript et Express, avec une page de résultats dynamique et un système anti-triche robuste.

## 🚀 Fonctionnalités Clés

- **Interface utilisateur moderne et animée** avec React 18, TypeScript et Vite.
- **Formulaire d'inscription sécurisé** avec validation en temps réel (React Hook Form & Zod).
- **Système de jeu à 4 boîtes mystères**, dont une seule contient un prix.
- **Backend sécurisé avec Express.js** et logique anti-triche avancée.
- **Stockage des résultats en JSON** et génération automatique de rapports **PDF**.
- **Page de résultats dynamique** :
  - 🎉 **Page de félicitations** pour les gagnants avec animations de guirlandes.
  - 😊 **Page de remerciement** pour les perdants avec un message encourageant.
- **Système anti-triche robuste** pour garantir une seule participation par personne (basé sur l'email et le numéro de téléphone).
- **Design entièrement responsive** grâce à Tailwind CSS.

## 🛠️ Stack Technique

| Domaine   | Technologie                                       | Description                               |
|-----------|---------------------------------------------------|-------------------------------------------|
| **Frontend**  | React 18, TypeScript, Vite                      | Interface utilisateur rapide et moderne.    |
|           | Tailwind CSS                                      | Design et styling.                        |
|           | Framer Motion                                     | Animations fluides.                       |
|           | React Hook Form & Zod                             | Validation de formulaire.                 |
|           | Lucide React                                      | Icônes.                                   |
| **Backend**   | Node.js, Express.js, TypeScript                 | Serveur robuste et performant.            |
|           | PDFKit, fs-extra                                  | Stockage JSON et génération de PDF.       |
|           | ts-node-dev                                       | Rechargement à chaud en développement.    |

## 📦 Installation et Lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm (généralement inclus avec Node.js)

### Étapes d'installation
1. **Clonez le repository :**
   ```bash
   git clone https://github.com/votre-username/react-box-game.git
   cd react-box-game
   ```

2. **Installez les dépendances du backend :**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Installez les dépendances du frontend :**
   ```bash
   npm install
   ```

### Lancement des serveurs
Le jeu nécessite deux serveurs fonctionnant simultanément : le backend et le frontend.

1. **Démarrez le serveur backend (Port 3002) :**
   ```bash
   # Depuis la racine du projet, dans un premier terminal
   cd backend
   npm run dev
   ```

2. **Démarrez le serveur frontend (Port 3000) :**
   ```bash
   # Depuis la racine du projet, dans un second terminal
   npm run dev
   ```

Une fois les deux serveurs démarrés, vous pouvez accéder au jeu à l'adresse **http://localhost:3000**.

## 🎮 Comment Jouer

1.  **Remplissez le formulaire** avec vos informations (nom, email, téléphone).
2.  Le système vérifie en temps réel que vous n'avez pas déjà joué.
3.  **Choisissez une boîte** parmi les 4 proposées.
4.  **Découvrez votre résultat** sur une page dédiée (gagnant ou perdant).
5.  Après avoir cliqué sur "Fermer", vous êtes redirigé vers le formulaire initial.

**Note :** Chaque personne ne peut jouer qu'une seule fois.

## 📁 Structure du Projet

```
react-box-game/
├── backend/                # Code source du backend (Express.js) - Voir le README du backend pour plus de détails
│   ├── src/
│   │   ├── routes/         # Définition des routes de l'API
│   │   ├── services/       # Logique métier (service PDF)
│   │   ├── middleware/     # Middlewares (gestion des erreurs)
│   │   └── index.ts        # Point d'entrée du serveur
│   ├── data/
│   │   ├── game_results.json # Fichier de stockage des résultats
│   │   └── reports/        # Rapports PDF générés
│   └── package.json
│
├── src/                    # Code source du frontend (React)
│   ├── components/         # Composants React (Form, GameBoard, ResultPage...)
│   ├── services/           # Logique d'appel à l'API backend
│   ├── types/              # Types TypeScript partagés
│   ├── App.tsx             # Composant principal
│   └── main.tsx            # Point d'entrée du frontend
│
├── GUIDE_NOUVELLES_FONCTIONNALITES.md # Documentation des dernières fonctionnalités
└── README.md               # Ce fichier
```

## 🔒 Sécurité et Anti-Triche

Le système garantit l'équité du jeu grâce à plusieurs mécanismes :
-   **Vérification d'identité unique :** Le backend vérifie si l'email ou le numéro de téléphone ont déjà été utilisés avant d'autoriser un joueur à participer.
-   **Validation des données :** Les données du formulaire sont validées côté client (Zod) et re-vérifiées côté serveur.
-   **Logs détaillés :** Le backend enregistre toutes les actions importantes (vérifications, enregistrements) pour une traçabilité complète.

## 📊 Endpoints de l'API

Le backend expose plusieurs endpoints sur `http://localhost:3002/api` :

| Méthode | Endpoint                 | Description                                       |
|---------|--------------------------|---------------------------------------------------|
| `POST`  | `/check-identity`        | Vérifie si un email/téléphone existe déjà.        |
| `GET`   | `/check-user/:userId`    | Vérifie si un utilisateur a déjà joué.            |
| `POST`  | `/game-result`           | Enregistre le résultat d'une partie.              |
| `GET`   | `/download-pdf`          | Télécharge le rapport PDF global des résultats.   |
| `GET`   | `/view-pdf`              | Affiche le rapport PDF dans le navigateur.        |
| `GET`   | `/health`                | Vérifie l'état de santé du serveur.               |

## 🤝 Contribution

Les contributions sont les bienvenues !
1.  Forkez le projet.
2.  Créez une branche pour votre fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`).
3.  Committez vos changements (`git commit -m 'Ajout de NouvelleFonctionnalite'`).
4.  Pushez vers la branche (`git push origin feature/NouvelleFonctionnalite`).
5.  Ouvrez une Pull Request.

## 📝 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

---
⭐ N'oubliez pas de donner une étoile si ce projet vous a été utile ! 