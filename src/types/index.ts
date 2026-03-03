/**
 * src/types/index.ts
 * Types globaux pour le projet AkJol
 */

export type NodeType = 'BAC' | 'ETUDE_SUP' | 'METIER' | 'CERTIF';

export interface Node {
  id: number;
  type: NodeType;
  title: string;
  slug: string;
  description: string;
  metadata: Record<string, any>;
  color?: string; // Gradient Tailwind: "from-blue-500 to-blue-600"
  icon?: string; // Emoji ou lucide-react name
  requirements?: NodeRequirements; // Conditions pour accéder à ce nœud
}

export interface Edge {
  id: number;
  source_id: number;
  target_id: number;
  requirements: Record<string, any>;
}

/**
 * Configuration des requirements (conditions d'accès à un node)
 */
export interface NodeRequirements {
  math?: number; // Niveau minimum requis en maths (0-20)
  french?: number; // Français
  science?: number; // Sciences/Physique-Chimie
  average?: number; // Moyenne générale minimale
  difficulty?: 'Easy' | 'Medium' | 'Hard'; // Difficulté globale
}

/**
 * Stats utilisateur (profil étudiant)
 * Basé sur ses résultats actuels
 */
export interface UserStats {
  id: string;
  name: string;
  math: number; // 0-20
  french: number; // 0-20
  science: number; // 0-20
  average: number; // 0-20
  level: 'Débutant' | 'Moyen' | 'Avancé';
}

/**
 * État de la "Exploring Session"
 * Représente le chemin exploré par l'utilisateur
 */
export interface ExploreState {
  currentNodeId: number | null;
  path: number[]; // IDs des nœuds visités (left to right)
  direction: 'left' | 'right'; // Pour l'animation
}

/**
 * Pour afficher les suggestions de chemins
 */
export interface PathwayStep {
  node: Node;
  requirements?: Record<string, any>;
  successProbability: number; // 0-1 (0% à 100%)
  riskLevel: 'safe' | 'medium' | 'risky'; // Basé sur la probabilité
}
