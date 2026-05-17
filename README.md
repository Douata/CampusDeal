# 🎓 CampusDeal

Le marché collaboratif des étudiants de l'INPHB. Une application mobile moderne pour acheter, vendre, échanger et communiquer avec tes camarades directement depuis le campus.

[![Expo](https://img.shields.io/badge/Expo-Latest-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blueviolet)](https://reactnative.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

---

## ✨ Fonctionnalités

### 🏠 Accueil

- **Affichage des annonces** : Découvre toutes les annonces publiées avec photos haute qualité
- **Filtrage par catégorie** : Nourriture, Vente d'objets, Emploi, Événements campus
- **Pull-to-refresh** : Mets à jour la liste d'annonces en un geste
- **Recherche rapide** : Accède à la recherche avancée depuis l'en-tête

### 📢 Publier une Annonce

- **Création simple** : Formulaire intuitif et guidé
- **Upload d'images** : Jusqu'à 3 photos par annonce (compression optimisée)
- **Catégories** : Classe ton annonce pour meilleure visibilité
- **Prix flexible** : Avec ou sans frais (gratuit accepté)
- **Validation** : Les champs obligatoires sont vérifiés avant publication

### 💬 Messagerie en Temps Réel

- **Conversations groupées** : Par annonce et par utilisateur
- **Notifications** : Badge de messages non lus en temps réel
- **Historique** : Retrouve tous tes échanges passés
- **Marquer comme lu** : Gère les messages consultés

### ❤️ Favoris

- **Marquer un favoris** : Sauvegarde tes annonces préférées
- **Liste dédiée** : Retrouve tous tes favoris au même endroit
- **Gestion facile** : Ajoute/supprime d'un tap

### 👤 Profil Utilisateur

- **Informations personnelles** : Nom, prénom, filière
- **Mes annonces** : Gère toutes tes publications
- **Édition du profil** : Mets à jour tes infos quand tu veux
- **Sécurité** : Changer de mot de passe
- **Aide** : Accès au centre d'aide
- **Déconnexion sécurisée** : Confirmation avant logout

---

## 🛠️ Stack Technique

### Frontend

- **Framework** : React Native 0.81.5
- **Expo** : 54.0.33 (développement et build faciles)
- **Navigation** : React Navigation (Bottom Tabs + Native Stack)
- **UI Components** : Expo Vector Icons (100+ icônes)
- **State Management** : Redux + Redux Toolkit

### Backend & Services

- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth (JWT)
- **Stockage d'images** : Supabase Storage
- **Temps réel** : Supabase Realtime (WebSockets)

### Sécurité

- **Stockage sécurisé** : expo-secure-store (tokens chiffrés)
- **Gestion des chunks** : Pour les gros tokens
- **Auto-refresh** : Rafraîchissement automatique des sessions

### Librairies essentielles

```json
{
  "@react-navigation/bottom-tabs": "^7.15.13",
  "@react-navigation/native": "^7.2.4",
  "@react-navigation/native-stack": "^7.14.14",
  "@reduxjs/toolkit": "^2.11.2",
  "@supabase/supabase-js": "^2.105.4",
  "expo-image-picker": "~17.0.11",
  "expo-secure-store": "~15.0.8",
  "react-redux": "^9.2.0"
}
```

---

## 📁 Structure du Projet

```
CampusDeal/
├── App.js                          # Point d'entrée principal
├── app.json                        # Configuration Expo
├── package.json                    # Dépendances & scripts
│
├── assets/                         # Ressources (icônes, splash, favicon)
│
└── src/
    ├── navigation/
    │   ├── AppNavigator.jsx       # Navigateur principal (Auth/App)
    │   ├── AuthNavigator.jsx      # Stack Auth (Login/Register)
    │   └── TabNavigator.jsx       # Tab principal (5 onglets)
    │
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.jsx    # Connexion
    │   │   └── RegisterScreen.jsx # Inscription (nom, prénom, filière)
    │   ├── home/
    │   │   └── HomeScreen.jsx     # Affichage annonces + filtres
    │   ├── annonces/
    │   │   ├── AnnoncesScreen.jsx # Liste avec recherche avancée
    │   │   ├── CreateAnnonceScreen.jsx # Création d'annonce
    │   │   └── AnnonceDetailScreen.jsx # Détails + actions
    │   ├── messages/
    │   │   ├── MessagesScreen.jsx # Conversations groupées
    │   │   └── ConversationScreen.jsx # Chat en temps réel
    │   └── profil/
    │       ├── ProfilScreen.jsx   # Vue profil principal
    │       ├── EditProfilScreen.jsx # Édition infos perso
    │       ├── MesAnnoncesScreen.jsx # Mes publications
    │       ├── FavorisScreen.jsx  # Mes favoris
    │       ├── ChangePasswordScreen.jsx # Sécurité
    │       └── AideScreen.jsx     # Centre d'aide
    │
    ├── components/
    │   ├── annonces/
    │   │   └── AnnonceCard.jsx    # Composant annonce réutilisable
    │   └── common/
    │       ├── AnimatedButton.jsx # Boutons avec animations
    │       ├── EmptyState.jsx     # État vide personnalisé
    │       └── Logo.jsx           # Logo CampusDeal
    │
    ├── services/
    │   ├── supabase.js           # Client Supabase + SecureStore
    │   ├── authService.js        # Authentification
    │   ├── annoncesService.js    # CRUD annonces + upload images
    │   ├── messagesService.js    # Messagerie + temps réel
    │   ├── favorisService.js     # Gestion favoris
    │   └── profileService.js     # Infos utilisateur
    │
    ├── store/
    │   ├── store.js              # Configuration Redux
    │   └── slices/
    │       ├── authSlice.js      # État authentification
    │       └── annoncesSlice.js  # État annonces + filtrage
    │
    ├── hooks/
    │   ├── useAuth.js           # Hook pour authentification
    │   └── useAnnonces.js       # Hook pour annonces
    │
    ├── constants/
    │   ├── categories.js        # Catégories avec icônes/couleurs
    │   ├── colors.js            # Palette de couleurs
    │   └── config.js            # Configuration globale
    │
    └── utils/
        └── helpers.js           # Fonctions utilitaires

```

---

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`

### Étapes d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/tonusername/CampusDeal.git
cd CampusDeal
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env` à la racine (ou `.env.local`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Démarrer l'application**

```bash
npm start
```

### Options de démarrage

```bash
# Expo Go (QR code pour iOS/Android)
npm start

# Mode développement iOS
npm run ios

# Mode développement Android
npm run android

# Mode web (localhost:19006)
npm run web
```

---

## 🗄️ Configuration Supabase

### Tables principales

```sql
-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  nom VARCHAR,
  prenom VARCHAR,
  filiere VARCHAR,
  created_at TIMESTAMP
);

-- Annonces
CREATE TABLE annonces (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  titre VARCHAR,
  description TEXT,
  prix INTEGER,
  categorie VARCHAR,
  images TEXT[] (JSON URLs),
  created_at TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  annonce_id UUID REFERENCES annonces(id),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  contenu TEXT,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);

-- Favoris
CREATE TABLE favoris (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  annonce_id UUID REFERENCES annonces(id),
  created_at TIMESTAMP,
  UNIQUE(user_id, annonce_id)
);
```

### Storage

- **Bucket** : `annonces-images`
- **Chemin** : `/userId/timestamp.jpg`
- **Permissions** : Public read, Authenticated write

### RLS (Row Level Security)

```sql
-- Les utilisateurs voient leurs propres données
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoris ENABLE ROW LEVEL SECURITY;
```

---

## 💡 Fonctionnement Principal

### Authentification

1. **Inscription** : Email + mot de passe + infos perso (nom, prénom, filière)
2. **JWT Token** : Stocké de façon sécurisée dans le SecureStore
3. **Session persistante** : Auto-refresh du token à l'ouverture
4. **Déconnexion** : Suppression du token et état Redux

### Publication d'annonce

```
1. Upload des images → Supabase Storage
2. Création annonce → Base de données
3. Ajout à Redux store
4. Réinitialisation du formulaire
5. Navigation vers Home
```

### Messagerie temps réel

```
1. Chargement conversation
2. Souscription Realtime → WebSocket
3. Réception nouveaux messages
4. Marquage comme lu automatique
5. Mise à jour badges non-lus
```

### Favoris

```
1. Vérification si déjà en favori
2. Upsert dans base de données
3. Mise à jour UI en temps réel
```

---

## 🎨 Thème & Design

### Palette de couleurs

```javascript
const COLORS = {
  primary: "#FF6B6B", // Rouge (principal)
  secondary: "#4ECDC4", // Teal (secondaire)
  black: "#2C3E50", // Noir profond
  white: "#FFFFFF", // Blanc
  gray: "#95A5A6", // Gris moyen
  lightGray: "#ECF0F1", // Gris clair
  background: "#F8FAFC", // Fond léger
  error: "#E74C3C", // Erreurs/suppression
  warning: "#F39C12", // Avertissements
  success: "#27AE60", // Succès
};
```

### Catégories

- 🍽️ **Nourriture & Boissons** (Rouge)
- 🛒 **Vente d'objets** (Teal)
- 💼 **Emploi & Stages** (Bleu)
- 🎉 **Événements campus** (Vert)

---

## 📱 Responsivité

L'app est optimisée pour :

- ✅ **iOS** 13+
- ✅ **Android** 5+
- ✅ **Web** (support basique)

Chaque écran s'adapte aux différentes tailles d'écran avec FlexBox et utilise `SafeAreaView` pour les encoches.

---

## 🔒 Sécurité

- **Tokens chiffrés** : expo-secure-store (natif iOS/Android)
- **Gestion des chunks** : Pour tokens > 1800 caractères
- **Auto-refresh** : Renouvellement automatique des sessions
- **RLS Supabase** : Isolation des données par utilisateur
- **Validation côté client** : Avant chaque requête
- **HTTPS obligatoire** : Toutes les requêtes API

---

## 🐛 Dépannage

### "Module not found"

```bash
npm install
```

### Problème d'image Supabase

- Vérifier les variables d'environnement
- Vérifier le bucket et les permissions RLS

### Erreur de connexion

```bash
# Vider le cache Expo
expo start --clear
```

### Le formulaire ne se réinitialise pas

✅ **Corrigé** : Ajout de `setForm()` et `setImages()` après publication

---

## 📊 Performance

- **Optimisation images** : Compression 0.8 avec expo-image-picker
- **Lazy loading** : Chargement à la demande des conversations
- **Pagination** : Requêtes groupées avec ordre chronologique inverse
- **Mise en cache** : Redux store pour état persistant
- **Pull-to-refresh** : Rafraîchissement manuel disponible

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Crée une branche (`git checkout -b feature/MaFonctionnalité`)
3. Commit tes changements (`git commit -m 'Ajout de MaFonctionnalité'`)
4. Push vers la branche (`git push origin feature/MaFonctionnalité`)
5. Ouvre une Pull Request

---

## 📋 Roadmap

- [ ] Système de notations/commentaires
- [ ] Recherche avancée avec filtres
- [ ] Notifications push
- [ ] Partage social (WhatsApp, Instagram)
- [ ] Paiement intégré (Orange Money, Wave)
- [ ] Vérification identité par QR code campus
- [ ] Chat vocal/vidéo

---

## 📞 Support

Pour toute question ou problème :

- 📧 Email : contact@campusdeal.dev
- 💬 Issues : [GitHub Issues](https://github.com/tonusername/CampusDeal/issues)
- 📱 WhatsApp : +1 234 567 8900

---

## 🙌 Crédits

Créé par un étudiants de l'INPHB avec ❤️

**Technologies** : React Native, Expo, Supabase, Redux
**Design** : UI/UX moderne et intuitif
**Communauté** : Campus collaboratif

---

<div align="center">

**Fait avec ❤️ à l'INPHB**

⭐ N'oublie pas de laisser une star si le projet t'a plu !

</div>
