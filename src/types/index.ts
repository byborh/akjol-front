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
}

export interface Edge {
  id: number;
  source_id: number;
  target_id: number;
  requirements: Record<string, any>;
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
  isAccessible: boolean; // Peut-on y accéder ? (logic checked)
}
