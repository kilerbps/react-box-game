# 🚀 Guide de Déploiement

Ce guide explique comment déployer le frontend sur **Vercel** et le backend sur **Render**.

### Prérequis
- Un compte [GitHub](https://github.com/).
- Un compte [Vercel](https://vercel.com/).
- Un compte [Render](https://render.com/).
- Avoir "pushé" le code de ce projet sur un repository GitHub.

---

## ✅ **Frontend Vercel - DÉPLOYÉ AVEC SUCCÈS**

**URL de production :** https://react-box-game.vercel.app

Le frontend est maintenant accessible et fonctionnel sur Vercel !

---

## 🔧 **Étape Suivante : Déploiement du Backend sur Render**

Maintenant que le frontend est déployé, nous devons déployer le backend sur Render pour que l'application soit complètement fonctionnelle.

### **Configuration du Backend sur Render**

1. **Créez un nouveau service sur Render :**
   - Allez sur votre [Dashboard Render](https://dashboard.render.com/).
   - Cliquez sur **New +** > **Web Service**.
   - Connectez votre repository GitHub et sélectionnez le projet `react-box-game`.

2. **Configurez le service :**
   - **Name** : `mystery-box-backend` (ou un nom de votre choix).
   - **Root Directory** : `backend` (Très important ! Render doit travailler dans ce sous-dossier).
   - **Environment** : `Node`.
   - **Region** : Choisissez une région proche de vous (ex: `Frankfurt`).
   - **Branch** : `main` (ou la branche que vous souhaitez déployer).
   - **Build Command** : `npm install && npm run build` (devrait être auto-détecté).
   - **Start Command** : `npm start` (devrait être auto-détecté).
   - **Plan** : `Free` (suffisant pour commencer).

3. **Ajoutez les variables d'environnement :**
   - Cliquez sur **Advanced**.
   - Allez dans la section **Environment Variables**.
   - Cliquez sur **Add Environment Variable**.
   - **Key** : `NODE_ENV`, **Value** : `production`.
   - **Key** : `FRONTEND_URL`, **Value** : `https://react-box-game.vercel.app`

4. **Lancez le déploiement :**
   - Cliquez sur **Create Web Service**.
   - Render va maintenant construire et déployer votre backend. Cela peut prendre quelques minutes.
   - Une fois terminé, Render vous donnera une URL pour votre backend (ex: `https://mystery-box-backend-xxxx.onrender.com`). **Copiez cette URL.**

---

## 🔗 **Finalisation de la Configuration**

1. **Retournez sur Vercel :**
   - Allez dans les paramètres de votre projet `react-box-game` sur Vercel.
   - Allez dans la section **Environment Variables**.
   - Ajoutez ou modifiez la variable :
   - **Name** : `VITE_API_URL`
   - **Value** : Collez l'URL de votre backend Render (ex: `https://mystery-box-backend-xxxx.onrender.com`).

2. **Redéployez le frontend :**
   - Après avoir ajouté la variable d'environnement, Vercel va automatiquement redéployer votre projet.

---

## 🎉 **Test Final**

Une fois les deux services déployés :

1. **Testez l'application complète :** https://react-box-game.vercel.app
2. **Vérifiez que :**
   - Le formulaire d'inscription fonctionne
   - Le jeu de boîtes mystères se lance
   - Les résultats sont sauvegardés
   - Le PDF global est généré

---

## 📋 **URLs de Production**

- **Frontend (Vercel) :** https://react-box-game.vercel.app
- **Backend (Render) :** `https://mystery-box-backend-xxxx.onrender.com` (à remplacer par votre URL)

---

## 🔧 **Dépannage**

Si vous rencontrez des problèmes :

1. **Vérifiez les logs Render** dans la section "Logs" de votre service backend
2. **Vérifiez les variables d'environnement** sur les deux plateformes
3. **Testez l'API directement** en visitant `https://votre-backend.onrender.com/api/health`

**Félicitations !** Votre application Mystery Box Game sera bientôt entièrement déployée et accessible au public ! 🎁 