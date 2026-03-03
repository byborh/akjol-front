/**
 * src/services/probabilityService.ts
 *
 * Service de calcul de probabilité de succès pour chaque chemin d'orientation
 * Utilise une logique exponentielle pour les pénalités
 */

import type { UserStats, NodeRequirements } from '../types';

export interface SuccessProbabilityResult {
  probability: number; // 0-1 (0% à 100%)
  riskLevel: 'safe' | 'medium' | 'risky'; // Catégorie de risque
  details: {
    mathGap?: number;
    frenchGap?: number;
    scienceGap?: number;
    averageGap?: number;
    totalPenalty?: number;
  };
}

/**
 * Calcule la probabilité de succès pour accéder à un nœud
 * Logique:
 * - Si stats > requirements: 100%
 * - Si stats < requirements: applique une pénalité exponentielle
 *   - 0.5 point en moins: -5%
 *   - 1 point en moins: -10%
 *   - 2 points en moins: -30% (légèrement exponentiel)
 *   - 3+ points en moins: -70%+ (très pénalisé)
 */
export function calculateSuccessProbability(
  userStats: UserStats,
  nodeRequirements?: NodeRequirements
): SuccessProbabilityResult {
  // Si aucun requirement, c'est 100% accessible
  if (!nodeRequirements) {
    return {
      probability: 1,
      riskLevel: 'safe',
      details: {}
    };
  }

  const details: SuccessProbabilityResult['details'] = {};
  let totalPenalty = 0;

  // --- Vérification Maths ---
  if (nodeRequirements.math !== undefined) {
    const gap = nodeRequirements.math - userStats.math;
    details.mathGap = gap;

    if (gap > 0) {
      // Pénalité exponentielle pour le gap
      const penalty = calculateExponentialPenalty(gap);
      totalPenalty += penalty * 0.25; // Poids: 25%
    }
  }

  // --- Vérification Français ---
  if (nodeRequirements.french !== undefined) {
    const gap = nodeRequirements.french - userStats.french;
    details.frenchGap = gap;

    if (gap > 0) {
      const penalty = calculateExponentialPenalty(gap);
      totalPenalty += penalty * 0.25; // Poids: 25%
    }
  }

  // --- Vérification Sciences ---
  if (nodeRequirements.science !== undefined) {
    const gap = nodeRequirements.science - userStats.science;
    details.scienceGap = gap;

    if (gap > 0) {
      const penalty = calculateExponentialPenalty(gap);
      totalPenalty += penalty * 0.25; // Poids: 25%
    }
  }

  // --- Vérification Moyenne générale ---
  if (nodeRequirements.average !== undefined) {
    const gap = nodeRequirements.average - userStats.average;
    details.averageGap = gap;

    if (gap > 0) {
      const penalty = calculateExponentialPenalty(gap);
      totalPenalty += penalty * 0.25; // Poids: 25%
    }
  }

  details.totalPenalty = totalPenalty;

  // Probabilité finale: 1 - totalPenalty (min 0, max 1)
  const probability = Math.max(0, Math.min(1, 1 - totalPenalty));

  // Déterminer le niveau de risque
  const riskLevel: 'safe' | 'medium' | 'risky' = getRiskLevel(probability);

  return {
    probability,
    riskLevel,
    details
  };
}

/**
 * Calcule la pénalité exponentielle pour un gap de points
 * Formule: 0.1 * (1 + gap^1.5) pour une croissance exponentielle douce
 *
 * Exemples:
 * - gap = 0.5: penalty ≈ 0.05 (5%)
 * - gap = 1: penalty ≈ 0.10 (10%)
 * - gap = 2: penalty ≈ 0.30 (30%)
 * - gap = 3: penalty ≈ 0.55 (55%)
 * - gap = 4: penalty ≈ 0.85 (85%)
 */
function calculateExponentialPenalty(gap: number): number {
  // Utilise une courbe exponentielle douce
  const penalty = 0.1 * Math.pow(gap, 1.5);
  return Math.min(1, penalty); // Cap à 100% de pénalité
}

/**
 * Détermine le niveau de risque basé sur la probabilité
 */
function getRiskLevel(probability: number): 'safe' | 'medium' | 'risky' {
  if (probability >= 0.75) return 'safe';
  if (probability >= 0.4) return 'medium';
  return 'risky';
}

/**
 * Helper: Formatte la probabilité en pourcentage lisible
 */
export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

/**
 * Helper: Retourne le ratio d'accessibilité (pour affichage)
 */
export function getProbabilityMetrics(probability: number) {
  return {
    percentage: Math.round(probability * 100),
    riskLevel: getRiskLevel(probability),
    color: getColorForRiskLevel(getRiskLevel(probability))
  };
}

/**
 * Helper: Couleur Tailwind pour le niveau de risque
 */
export function getColorForRiskLevel(riskLevel: 'safe' | 'medium' | 'risky'): string {
  switch (riskLevel) {
    case 'safe':
      return 'from-green-500 to-green-600';
    case 'medium':
      return 'from-yellow-500 to-yellow-600';
    case 'risky':
      return 'from-red-500 to-red-600';
  }
}

/**
 * Helper: Texte pour le niveau de risque
 */
export function getRiskLevelText(riskLevel: 'safe' | 'medium' | 'risky'): string {
  switch (riskLevel) {
    case 'safe':
      return '✅ Très accessible';
    case 'medium':
      return '⚠️ Faisable avec efforts';
    case 'risky':
      return '🔴 Très difficile';
  }
}
