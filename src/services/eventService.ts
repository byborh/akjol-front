/**
 * src/services/eventService.ts
 *
 * Service de gestion des événements aléatoires (RNG)
 * Inspiré des mécaniques de jeux roguelike
 */

import type { RandomEvent, UserStats, EventEffect } from '../types';
import { EVENTS } from '../data/eventsData';

/**
 * Lance un dé (1-100) et détermine si un événement se déclenche
 * Retourne l'événement déclenché ou null
 */
export function rollForEvent(): RandomEvent | null {
  // Lancer un dé de 0 à 1
  const roll = Math.random();

  // Trier les événements par probabilité décroissante pour prioriser les rares
  const sortedEvents = [...EVENTS].sort((a, b) => a.probability - b.probability);

  // Vérifier chaque événement
  for (const event of sortedEvents) {
    if (roll <= event.probability) {
      console.log(`🎲 EVENT TRIGGERED: ${event.title} (roll: ${roll.toFixed(3)}, prob: ${event.probability})`);
      return event;
    }
  }

  // Aucun événement déclenché
  console.log(`🎲 No event triggered (roll: ${roll.toFixed(3)})`);
  return null;
}

/**
 * Applique les effets d'un événement sur les stats utilisateur
 * Retourne les nouvelles stats modifiées
 */
export function applyEventEffects(
  userStats: UserStats,
  effect: EventEffect
): UserStats {
  const newStats = { ...userStats };

  // Skill boost général (affecte toutes les matières)
  if (effect.skill_boost !== undefined) {
    newStats.math = Math.max(0, Math.min(20, newStats.math + effect.skill_boost));
    newStats.french = Math.max(0, Math.min(20, newStats.french + effect.skill_boost));
    newStats.science = Math.max(0, Math.min(20, newStats.science + effect.skill_boost));
    newStats.average = Math.max(0, Math.min(20, newStats.average + effect.skill_boost));
  }

  // Modifications spécifiques par matière
  if (effect.math !== undefined) {
    newStats.math = Math.max(0, Math.min(20, newStats.math + effect.math));
  }
  if (effect.french !== undefined) {
    newStats.french = Math.max(0, Math.min(20, newStats.french + effect.french));
  }
  if (effect.science !== undefined) {
    newStats.science = Math.max(0, Math.min(20, newStats.science + effect.science));
  }
  if (effect.average !== undefined) {
    newStats.average = Math.max(0, Math.min(20, newStats.average + effect.average));
  }

  // Recalculer la moyenne générale basée sur les matières
  newStats.average = Math.round(
    ((newStats.math + newStats.french + newStats.science) / 3) * 10
  ) / 10;

  return newStats;
}

/**
 * Simule l'appel API backend "/api/pathways/select"
 * Lance un dé et retourne l'événement si déclenché
 */
export function simulatePathwaySelectAPI(
  sourceNodeId: number,
  targetNodeId: number
): {
  success: boolean;
  event: RandomEvent | null;
  message: string;
} {
  console.log(`🔀 Transition: Node ${sourceNodeId} → Node ${targetNodeId}`);

  // Lance le dé pour voir si un événement se déclenche
  const event = rollForEvent();

  if (event) {
    return {
      success: true,
      event,
      message: `Transition réussie. Un événement s'est produit: ${event.title}`
    };
  }

  return {
    success: true,
    event: null,
    message: 'Transition réussie. Aucun événement.'
  };
}

/**
 * Helper: Formatte les effets d'un événement en texte lisible
 */
export function formatEventEffects(effect: EventEffect): string[] {
  const effects: string[] = [];

  if (effect.skill_boost !== undefined) {
    const sign = effect.skill_boost > 0 ? '+' : '';
    effects.push(`${sign}${effect.skill_boost} dans toutes les matières`);
  }

  if (effect.math !== undefined) {
    const sign = effect.math > 0 ? '+' : '';
    effects.push(`${sign}${effect.math} en Maths`);
  }

  if (effect.french !== undefined) {
    const sign = effect.french > 0 ? '+' : '';
    effects.push(`${sign}${effect.french} en Français`);
  }

  if (effect.science !== undefined) {
    const sign = effect.science > 0 ? '+' : '';
    effects.push(`${sign}${effect.science} en Sciences`);
  }

  if (effect.average !== undefined) {
    const sign = effect.average > 0 ? '+' : '';
    effects.push(`${sign}${effect.average} en Moyenne Générale`);
  }

  if (effect.salary_modifier !== undefined) {
    const percentage = Math.round((effect.salary_modifier - 1) * 100);
    const sign = percentage > 0 ? '+' : '';
    effects.push(`${sign}${percentage}% de salaire futur`);
  }

  if (effect.money !== undefined) {
    const sign = effect.money > 0 ? '+' : '';
    effects.push(`${sign}${effect.money}€`);
  }

  if (effect.stress !== undefined) {
    const sign = effect.stress > 0 ? '+' : '';
    effects.push(`${sign}${effect.stress} stress`);
  }

  return effects;
}

/**
 * Helper: Couleur associée au type d'événement
 */
export function getEventTypeColor(type: 'positive' | 'negative' | 'neutral'): string {
  switch (type) {
    case 'positive':
      return 'from-green-500 to-emerald-600';
    case 'negative':
      return 'from-red-500 to-rose-600';
    case 'neutral':
      return 'from-blue-500 to-cyan-600';
  }
}

/**
 * Helper: Couleur associée à la rareté
 */
export function getRarityColor(rarity: 'common' | 'rare' | 'epic' | 'legendary'): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-300';
    case 'rare':
      return 'text-blue-400';
    case 'epic':
      return 'text-purple-400';
    case 'legendary':
      return 'text-yellow-400';
  }
}

/**
 * Helper: Texte de rareté
 */
export function getRarityText(rarity: 'common' | 'rare' | 'epic' | 'legendary'): string {
  switch (rarity) {
    case 'common':
      return 'Commun';
    case 'rare':
      return '✨ Rare';
    case 'epic':
      return '🔮 Épique';
    case 'legendary':
      return '⭐ Légendaire';
  }
}
