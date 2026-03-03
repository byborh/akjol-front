# 🚀 QUICK START - Clean Architecture

## Utilisation immédiate (sans installation supplémentaire)

### 1. Importer les règles métier
```typescript
import { 
  canAccessNode, 
  calculateSuccessProbability,
  calculateOutcome 
} from './engine';
```

### 2. Utiliser dans un composant
```typescript
function MyComponent() {
  // Convertir UserStats legacy → UserProfile
  const profile = userStatsToProfile(userStats);
  
  // Vérifier l'accès
  if (canAccessNode(profile, nodeRequirements)) {
    console.log('✅ Accès autorisé');
  }
  
  // Calculer probabilité
  const { probability, riskLevel } = calculateSuccessProbability(profile, requirements);
  
  // Appliquer un effet
  const newProfile = calculateOutcome(profile, {
    stats: { math: 2, french: 1 }
  });
  
  return <div>Probabilité: {Math.round(probability * 100)}%</div>;
}
```

## Installation des tests (optionnel)

```bash
# Installer vitest
npm install vitest --save-dev

# Ajouter les scripts dans package.json
"scripts": {
  "test": "vitest",
  "test:watch": "vitest --watch"
}

# Lancer les tests
npm test
```

## Fichiers clés

- **[src/engine/README.md](./src/engine/README.md)** - Documentation complète
- **[src/engine/EXAMPLES.tsx](./src/engine/EXAMPLES.tsx)** - Exemples pratiques
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Récapitulatif complet

## API Essentielle

### `canAccessNode(profile, requirements): boolean`
Vérifie si l'utilisateur remplit les conditions.

### `calculateSuccessProbability(profile, requirements): ProbabilityResult`
Calcule la probabilité de succès (0-100%).

### `calculateOutcome(profile, effect): UserProfile`
Applique un effet et retourne un nouveau profil (immutable).

### `suggestImprovements(profile, requirements): Suggestion[]`
Liste les domaines à améliorer.

## Exemple complet

```typescript
import { 
  canAccessNode, 
  calculateSuccessProbability,
  suggestImprovements,
  userStatsToProfile 
} from './engine';

function NodeCard({ nodeId, requirements }) {
  const profile = userStatsToProfile(MOCK_USER_STATS);
  
  // Logique métier pure (testable!)
  const canAccess = canAccessNode(profile, requirements);
  const { probability, riskLevel } = calculateSuccessProbability(profile, requirements);
  const suggestions = suggestImprovements(profile, requirements);
  
  return (
    <div>
      <h3>Nœud {nodeId}</h3>
      <p>Probabilité: {Math.round(probability * 100)}%</p>
      <p>Risque: {riskLevel}</p>
      
      {!canAccess && (
        <ul>
          {suggestions.map(s => (
            <li key={s.subject}>
              {s.subject}: {s.currentLevel} → {s.targetLevel}
            </li>
          ))}
        </ul>
      )}
      
      <button disabled={!canAccess}>
        Accéder
      </button>
    </div>
  );
}
```

✅ **C'est tout! Vous pouvez maintenant utiliser les règles métier partout.**
