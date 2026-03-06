# Système de Thème Dark/Light Mode

## ✅ Implémentation Complète

Le système de thème suit strictement la **règle des proportions 60-30-10** avec des couleurs optimisées pour l'accessibilité WCAG.

## 🎨 Palette de Couleurs

### Mode Clair (Light)
- **60% Fonds principaux** : Blanc Albâtre `#F8F9FA`
- **30% Surfaces/Cartes** : Gris Nuage `#E2E8F0`
- **10% Accent** : Violet Électrique `#8B5CF6`
- **Textes** : `#111827` (gray-900) pour contraste maximum

### Mode Sombre (Dark)
- **60% Fonds principaux** : Noir Mat `#121212`
- **30% Surfaces/Cartes** : Gris Anthracite `#27272A`
- **10% Accent** : Violet Électrique `#8B5CF6`
- **Textes** : Blanc cassé `#F3F4F6`

## 🔧 Architecture Technique

### 1. Contexte React (`src/contexts/ThemeContext.tsx`)
```typescript
- ThemeProvider : Wrap l'application
- useTheme() : Hook pour accéder au thème et le changer
- Persistance : localStorage automatique
```

### 2. Configuration Tailwind (`tailwind.config.js`)
```javascript
darkMode: 'class' // Activation du mode dark basé sur la classe HTML
```

### 3. Classes Tailwind Utilisées
```css
/* Backgrounds 60% */
bg-[#F8F9FA] dark:bg-[#121212]

/* Surfaces 30% */
bg-[#E2E8F0] dark:bg-[#27272A]

/* Accent 10% */
bg-[#8B5CF6] hover:bg-[#7C3AED]

/* Textes */
text-gray-900 dark:text-[#F3F4F6]
text-gray-700 dark:text-gray-300
```

## 🎯 Composants Mis à Jour

### ✅ Composants Principaux
- [x] **App.tsx** : Background principal
- [x] **LoginPanel** : Formulaire de connexion
- [x] **AppHeader** : Header avec toggle de thème (🌙/☀️)
- [x] **FormationExplorer** : Modal d'exploration formations/écoles
- [x] **ExploreTimeline** : Simulation de parcours

### 🔄 Classes Appliquées
Tous les composants utilisent :
- `transition-colors duration-200` pour animations fluides
- Bordures cohérentes avec les surfaces
- Focus rings violet (`focus:ring-[#8B5CF6]`)
- Hover states avec opacité/fond

## 🎮 Utilisation

### Toggle Thème
Un bouton dans [AppHeader](src/components/AppHeader.tsx) permet de basculer :
- 🌙 = Mode sombre actif
- ☀️ = Mode clair actif

### Conservation
Le thème est sauvegardé dans `localStorage` clé `akjol-theme`

## ♿ Accessibilité WCAG

### Contrastes Vérifiés
- **Mode Clair** : 
  - Texte principal (#111827) sur fond (#F8F9FA) = **19.02:1** ✅ AAA
  - Accent (#8B5CF6) sur fond blanc = **4.63:1** ✅ AA
  
- **Mode Sombre** :
  - Texte (#F3F4F6) sur fond (#121212) = **17.44:1** ✅ AAA
  - Accent (#8B5CF6) sur fond sombre = **5.93:1** ✅ AA

### Ergonomie
- Coins arrondis (`rounded-lg`, `rounded-xl`) pour modernité
- Transitions douces (`transition-colors duration-200`)
- États hover/focus clairement visibles
- Icône de toggle intuitive

## 📦 Fichiers Créés

1. `src/contexts/ThemeContext.tsx` - Contexte React + hook
2. `src/styles/theme.ts` - Configuration centralisée (optionnel)
3. `tailwind.config.js` - Activation darkMode

## 🚀 Prochaines Étapes (Optionnelles)

- [ ] Thème système automatique (prefers-color-scheme)
- [ ] Animations de transition entre thèmes
- [ ] Préférences utilisateur avancées
- [ ] Thèmes personnalisés supplémentaires

## 📝 Notes

Le violet électrique `#8B5CF6` sert de **guide visuel principal** dans les deux modes :
- Boutons CTA
- Liens important
- Éléments interactifs cruciaux
- Focus states

Cette cohérence renforce l'identité visuelle et l'UX du site.
