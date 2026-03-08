# Optimisations de Performance

## Problème identifié
Le chargement de **5824 formations** et **9006 établissements** causait des lags sévères dans le navigateur.

## Solutions appliquées

### 1. Échantillonnage intelligent des données (`dataService.ts`)
- **Avant** : Chargement de toutes les formations/établissements
- **Maintenant** : 
  - 800 formations échantillonnées de manière diversifiée (représentatives de tous les types)
  - 2000 établissements
  - Fonction `sampleDiverseFormations()` qui prend un mix équilibré de chaque type

### 2. Génération d'edges optimisée
- **Avant** : Boucles forEach imbriquées créant des dizaines de milliers de connexions
- **Maintenant** :
  - Limite stricte : 200 BAC connectés (max 5 ETUDE_SUP chacun)
  - 300 ETUDE_SUP connectés (max 3 METIER chacun)
  - Break early dans les boucles dès quota atteint
  - Connexions totales réduites de ~50000 à ~3000-5000

### 3. Recherche debouncée (`useDebounce.ts`)
- **Avant** : Re-render à chaque frappe clavier
- **Maintenant** :
  - Délai de 300ms avant filtrage
  - Réduit drastiquement les calculs de filtrage
  - Appliqué dans `StartingPoint` et `FormationExplorer`

### 4. Recherche simple par défaut + Toggle "Recherche approfondie"
- **NOUVEAU** : Recherche par titre uniquement par défaut (ultra rapide)
- Toggle optionnel pour recherche approfondie (description, domaines, niveaux...)
- Réduit la complexité de filtrage de ~90% sur recherches simples
- Interface utilisateur : checkbox "🔍 Recherche approfondie"

### 5. Nettoyage progressif des données (Progressive Data Pruning)
- **NOUVEAU** : Fonction `pruneUnusedData()` dans DataContext
- Supprime automatiquement les nœuds/écoles/edges inutilisés à chaque étape
- Garde uniquement :
  - Le parcours actuel
  - Le nœud actuel
  - Les prochains choix possibles
  - L'horizon +2 (projections futures)
- Libère jusqu'à 70% de la mémoire au fur et à mesure de la navigation
- Log console : "🗑️ Nettoyage des données inutilisées"

### 6. Pagination des résultats affichés
- **NOUVEAU** : Affichage limité à 50 résultats par défaut
- Bouton "Voir plus" pour charger 50 résultats supplémentaires
- Évite le rendu de centaines d'éléments DOM simultanément
- Réinitialisation automatique de la limite lors d'une nouvelle recherche

### 7. Feedback utilisateur amélioré
- Compteur de résultats visible (ex: "144 résultats")
- Badge stylisé pour le compteur dans StartingPoint
- Messages de console détaillés pour le nettoyage des données
- Placeholder dynamique selon le mode de recherche

## Résultats attendus

- ⚡ **Chargement initial** : < 2 secondes (au lieu de 15-30s)
- ⚡ **Recherche fluide** : instantanée en mode simple, < 1s en mode approfondi
- ⚡ **Navigation responsive** : pas de freeze
- ⚡ **Mémoire optimisée** : 
  - Départ : ~800 formations, 2000 écoles
  - Après 3-4 étapes : ~200-300 formations, ~500 écoles
  - Libération progressive de 60-80% de la mémoire

## Architecture technique

### Recherche optimisée
```typescript
// Simple (défaut) : uniquement titre
normalizeSearchValue(node.title).includes(searchTerm)

// Approfondie (toggle) : tous les champs
[title, description, metadata...].join(' ').includes(searchTerm)
```

### Nettoyage progressif
```typescript
// Appelé à chaque changement de path
pruneUnusedData(pathIds, currentNodeId)
→ Calcule les nœuds accessibles
→ Filtre nodes/schools/edges
→ Libère la mémoire
```

### Pagination
```typescript
const displayedFormations = filteredFormations.slice(0, displayLimit)
// displayLimit initialisé à 50, incrémenté de 50 avec "Voir plus"
```

## Prochaines optimisations possibles
Si nécessaire, on peut ajouter :
1. **React-window** pour virtualisation des listes > 100 éléments
2. **Web Workers** pour le traitement des données en background
3. **IndexedDB** pour cache persistant côté client
4. **Lazy loading** des formations par catégorie
5. **Server-side search** avec pagination côté API
