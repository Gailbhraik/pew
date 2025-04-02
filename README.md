# Crypto Tracker & Dofus Map

Application web multi-fonctionnelle combinant un tracker de cryptomonnaies et une carte interactive du monde de Dofus.

## Fonctionnalités

### Crypto Tracker
- Suivi des prix en temps réel des principales cryptomonnaies
- Recherche de tokens sur les blockchains Solana et Base
- Vérification de portefeuilles et de leurs avoirs
- Interface utilisateur intuitive avec des effets visuels modernes

### Carte Dofus Interactive
- Visualisation des ressources sur une carte du monde de Dofus
- Filtrage par catégorie, niveau et abondance des ressources
- Recherche par nom de ressource
- Affichage détaillé des informations sur chaque ressource
- Navigation interactive avec zoom et déplacement

### Autres Fonctionnalités
- Mode clair/sombre
- Design responsive pour tous les appareils
- Animations et transitions fluides

## Technologies Utilisées

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- APIs externes (SolScan, BaseScan, CoinGecko)

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Build et Déploiement

```bash
# Créer une version de production
npm run build

# Démarrer le serveur de production
npm start
```

## Structure du Projet

- `/app` - Pages de l'application (routing Next.js)
- `/components` - Composants React réutilisables
- `/lib` - Utilitaires et configuration
- `/public` - Ressources statiques
- `/styles` - Styles globaux

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
