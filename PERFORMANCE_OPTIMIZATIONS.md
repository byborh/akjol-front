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

### 4. Feedback utilisateur
- Compteur de résultats visible dans la recherche
- Messages de chargement améliorés dans la console

## Résultats attendus
- ✅ Chargement initial < 3 secondes
- ✅ Recherche fluide sans lag
- ✅ Navigation dans la timeline responsive
- ✅ Mémoire réduite (~70% moins de données en mémoire)

## Prochaines optimisations possibles
Si nécessaire, on peut ajouter :
1. **React-window** pour virtualiser les listes longues
2. **Web Workers** pour le traitement des données en background
3. **Lazy loading** des formations par type
4. **Indexation côté serveur** pour recherche plus rapide
