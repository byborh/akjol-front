// src/data/mockData.ts

export interface EduNode {
  id: string;
  category: 'COLLEGE' | 'LYCEE' | 'POST-BAC';
  type: 'General' | 'Techno' | 'Pro' | 'Prepa' | 'BTS' | 'Licence' | 'College';
  title: string;
  subtitle: string;
  tags: string[];
}

export const DATA_NODES: EduNode[] = [
  // --- NIVEAU 3 : POST-BAC (Le Futur) ---
  {
    id: 'pb-1',
    category: 'POST-BAC',
    type: 'BTS',
    title: 'BTS SIO (SISR)',
    subtitle: 'Lycée Turgot - Paris',
    tags: ['Réseau', 'Système', 'Tech']
  },
  {
    id: 'pb-2',
    category: 'POST-BAC',
    type: 'BTS',
    title: 'BTS SIO (SLAM)',
    subtitle: 'Lycée Turgot - Paris',
    tags: ['Dev', 'Code', 'Web']
  },
  {
    id: 'pb-3',
    category: 'POST-BAC',
    type: 'Prepa',
    title: 'CPGE MPSI',
    subtitle: 'Lycée Saint-Louis',
    tags: ['Maths', 'Physique', 'Prestige']
  },
  {
    id: 'pb-4',
    category: 'POST-BAC',
    type: 'Licence',
    title: 'Licence Info',
    subtitle: 'Sorbonne Université',
    tags: ['Fac', 'Théorie', 'Master']
  },
  {
    id: 'pb-5',
    category: 'POST-BAC',
    type: 'Prepa',
    title: 'Prépa Intégrée',
    subtitle: 'INSA Lyon',
    tags: ['Ingénieur', 'Tech']
  },
  {
    id: 'pb-6',
    category: 'POST-BAC',
    type: 'BTS',
    title: 'BTS CIEL',
    subtitle: 'Lycée Diderot',
    tags: ['Électronique', 'Réseau']
  },

  // --- NIVEAU 2 : LYCÉE (Le Choix Actuel) ---
  {
    id: 'ly-1',
    category: 'LYCEE',
    type: 'General',
    title: 'Bac Général',
    subtitle: 'Spé NSI / Maths',
    tags: ['Général', 'Numérique']
  },
  {
    id: 'ly-2',
    category: 'LYCEE',
    type: 'Techno',
    title: 'Bac STI2D',
    subtitle: 'Opt. SIN',
    tags: ['Techno', 'Ingénierie']
  },
  {
    id: 'ly-3',
    category: 'LYCEE',
    type: 'Pro',
    title: 'Bac Pro CIEL',
    subtitle: 'Ex SN-RISC',
    tags: ['Pro', 'Réseau']
  },
  {
    id: 'ly-4',
    category: 'LYCEE',
    type: 'Techno',
    title: 'Bac STMG',
    subtitle: 'Opt. SIG',
    tags: ['Gestion', 'Informatique']
  },

  // --- NIVEAU 1 : COLLÈGE (L'Origine) ---
  {
    id: 'col-1',
    category: 'COLLEGE',
    type: 'College',
    title: 'Collège J. Prévert',
    subtitle: 'Paris 75006',
    tags: ['Public']
  },
  {
    id: 'col-2',
    category: 'COLLEGE',
    type: 'College',
    title: 'Collège Sévigné',
    subtitle: 'Privé - Paris',
    tags: ['Privé']
  },
  {
    id: 'col-3',
    category: 'COLLEGE',
    type: 'College',
    title: 'Collège Montaigne',
    subtitle: 'Bordeaux',
    tags: ['Public']
  }
];