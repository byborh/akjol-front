/**
 * src/data/mockData.ts
 * 
 * GRAPH RELATIONAL MODEL
 * Reproduit la structure PostgreSQL en JSON
 * - Nodes : Tous les points du graphe (Bacs, Études, Métiers)
 * - Edges : Les connexions possibles entre nœuds
 * - Metadata JSONB : Flexibilité complète par type
 */

// ==================== TYPES ====================
export type NodeType = 'BAC' | 'ETUDE_SUP' | 'METIER' | 'CERTIF';

export interface Node {
  id: number;
  type: NodeType;
  title: string;
  slug: string;
  description: string;
  // JSONB : flexibilité totale selon le type
  metadata: Record<string, any>;
  color?: string; // Pour le frontend : couleur de la card
  icon?: string; // emoji ou nom d'icône lucide-react
}

export interface Edge {
  id: number;
  source_id: number; // D'où je viens
  target_id: number; // Où je vais
  requirements: Record<string, any>; // Conditions pour passer (dossier, concours, etc)
}

// ==================== NODES DATA ====================
export const NODES: Node[] = [
  // --- LEVEL 0 : BAC (Point de départ) ---
  {
    id: 1,
    type: 'BAC',
    title: 'Bac Général (Spé Math/NSI)',
    slug: 'bac-general-nsi',
    description: 'Baccalauréat général avec spécialités scientifiques. Accès à pratiquement tout post-bac.',
    metadata: { difficulty: 'High', duration: '3 years', specialty: ['Maths', 'NSI'] },
    color: 'from-blue-500 to-blue-600',
    icon: '🎓'
  },
  {
    id: 2,
    type: 'BAC',
    title: 'Bac STI2D',
    slug: 'bac-sti2d',
    description: 'Sciences et Technologies de l\'Industrie et du Développement Durable.',
    metadata: { difficulty: 'Medium', duration: '3 years', specialty: ['SIN', 'EE'] },
    color: 'from-orange-500 to-orange-600',
    icon: '⚙️'
  },
  {
    id: 3,
    type: 'BAC',
    title: 'Bac Pro SN (CIEL)',
    slug: 'bac-pro-sn',
    description: 'Systèmes Numériques / Cybersécurité. Formation directement professionnelle.',
    metadata: { difficulty: 'Medium', duration: '3 years', alternance: true },
    color: 'from-red-500 to-red-600',
    icon: '🔧'
  },

  // --- LEVEL 1 : ÉTUDES SUPÉRIEURES (BAC+2/3) ---
  {
    id: 10,
    type: 'ETUDE_SUP',
    title: 'BTS SIO - Option SISR',
    slug: 'bts-sio-sisr',
    description: 'Solutions d\'infrastructure, systèmes et réseaux. 2 ans, très professionnel.',
    metadata: {
      years: 2,
      category: 'Technique',
      alternance_possible: true,
      avg_salary_junior: 28000,
      job_fit: ['Administrateur Réseaux', 'Support Informatique']
    },
    color: 'from-green-400 to-green-500',
    icon: '🌐'
  },
  {
    id: 11,
    type: 'ETUDE_SUP',
    title: 'BTS SIO - Option SLAM',
    slug: 'bts-sio-slam',
    description: 'Solutions Logicielles et Applications Métiers (Dev). 2 ans, très demandé.',
    metadata: {
      years: 2,
      category: 'Technique',
      alternance_possible: true,
      avg_salary_junior: 32000,
      job_fit: ['Développeur Web', 'Développeur Fullstack', 'Dev Mobile']
    },
    color: 'from-purple-400 to-purple-500',
    icon: '💻'
  },
  {
    id: 12,
    type: 'ETUDE_SUP',
    title: 'BUT Informatique',
    slug: 'but-info',
    description: 'Bachelor Universitaire de Technologie en 3 ans. Plus théorique que BTS.',
    metadata: {
      years: 3,
      category: 'Universitaire',
      theory_level: 'High',
      avg_salary_junior: 30000,
      job_fit: ['Développeur', 'Chef de Projet']
    },
    color: 'from-indigo-400 to-indigo-500',
    icon: '📚'
  },
  {
    id: 13,
    type: 'ETUDE_SUP',
    title: 'École 42 / Piscine',
    slug: 'ecole-42',
    description: 'Formation intensive sans profs. Gratuit, très intensif, très demandé.',
    metadata: {
      years: 88,
      category: 'Privé',
      price: 'Gratuit',
      intensity: 'Très Haut',
      avg_salary_junior: 35000,
      job_fit: ['Développeur Web', 'Startup Cofounder']
    },
    color: 'from-pink-400 to-pink-500',
    icon: '🚀'
  },

  // --- LEVEL 2 : POURSUITE D'ÉTUDES (BAC+3/5) ---
  {
    id: 20,
    type: 'ETUDE_SUP',
    title: 'Licence Pro - Métiers de l\'Informatique',
    slug: 'licence-pro-dev',
    description: 'Spécialisation en 1 an après un BAC+2. Diplôme très opérationnel.',
    metadata: {
      years: 1,
      category: 'Universitaire',
      level: 'BAC+3',
      avg_salary_junior: 33000,
      job_fit: ['Développeur Senior', 'Tech Lead']
    },
    color: 'from-cyan-400 to-cyan-500',
    icon: '🎯'
  },
  {
    id: 21,
    type: 'ETUDE_SUP',
    title: 'Master Expert Informatique',
    slug: 'master-expert-info',
    description: 'Diplôme niveau BAC+5. Pour ceux qui veulent progresser vers lead/manager.',
    metadata: {
      years: 2,
      category: 'Universitaire',
      level: 'BAC+5',
      avg_salary_junior: 38000,
      job_fit: ['Chef de Projet', 'Architect', 'CTO']
    },
    color: 'from-rose-400 to-rose-500',
    icon: '👑'
  },

  // --- LEVEL 3 : MÉTIERS (BUT ULTIME) ---
  {
    id: 30,
    type: 'METIER',
    title: 'Développeur Fullstack JS',
    slug: 'dev-fullstack',
    description: 'Création de sites web (Front & Back). Le classique qui marche.',
    metadata: {
      salary_junior: 38000,
      salary_senior: 55000,
      remote: true,
      demand: 'Very High',
      technologies: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      stress_level: 'Medium'
    },
    color: 'from-yellow-400 to-yellow-500',
    icon: '🚀'
  },
  {
    id: 31,
    type: 'METIER',
    title: 'Administrateur Réseaux / Sys',
    slug: 'admin-sys-res',
    description: 'Gestion des parcs informatiques et serveurs. Très demandé en entreprise.',
    metadata: {
      salary_junior: 32000,
      salary_senior: 48000,
      remote: false,
      demand: 'High',
      technologies: ['Linux', 'Windows Server', 'Networking', 'Cloud'],
      stress_level: 'High'
    },
    color: 'from-teal-400 to-teal-500',
    icon: '🛡️'
  }
];

// ==================== EDGES DATA ====================
export const EDGES: Edge[] = [
  // Depuis BAC vers BTS/BUT/42
  { id: 1, source_id: 1, target_id: 12, requirements: { mention: 'Bien' } },
  { id: 2, source_id: 2, target_id: 10, requirements: {} },
  { id: 3, source_id: 2, target_id: 11, requirements: {} },
  { id: 4, source_id: 3, target_id: 10, requirements: { dossier: 'Excellent' } },
  { id: 5, source_id: 1, target_id: 13, requirements: {} },
  { id: 6, source_id: 1, target_id: 11, requirements: {} },

  // Depuis BTS vers Licence/Master/Job
  { id: 7, source_id: 11, target_id: 20, requirements: {} },
  {
    id: 8,
    source_id: 11,
    target_id: 30,
    requirements: { portfolio: 'Recommendé', alternance: 'Plus facile' }
  },
  { id: 9, source_id: 10, target_id: 31, requirements: {} },
  { id: 10, source_id: 13, target_id: 30, requirements: { project: 'Requis' } },

  // Depuis Licence vers Job/Master
  { id: 11, source_id: 20, target_id: 30, requirements: {} },
  { id: 12, source_id: 20, target_id: 21, requirements: {} },
  { id: 13, source_id: 12, target_id: 20, requirements: {} },
  { id: 14, source_id: 12, target_id: 30, requirements: {} },

  // Depuis Master vers Jobs Senior
  { id: 15, source_id: 21, target_id: 30, requirements: { senior: true } }
];

// ==================== UTILITY FUNCTIONS ====================
/**
 * Récupère tous les chemins possibles depuis un nœud
 */
export function getNextPathways(nodeId: number): Node[] {
  const edges = EDGES.filter((edge) => edge.source_id === nodeId);
  return edges
    .map((edge) => NODES.find((n) => n.id === edge.target_id))
    .filter((node) => node !== undefined) as Node[];
}

/**
 * Récupère les conditions pour passer de A à B
 */
export function getEdgeRequirements(sourceId: number, targetId: number) {
  return EDGES.find((e) => e.source_id === sourceId && e.target_id === targetId)?.requirements || {};
}

// Pour backward compat avec App.tsx existant
export const DATA_NODES = NODES;