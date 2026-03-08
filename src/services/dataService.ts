/**
 * src/services/dataService.ts
 * 
 * Service d'orchestre qui combine:
 * - Fetch des APIs (apiService)
 * - Mapping des données (dataMapper)
 * - Gestion du cache local
 */

import { 
  fetchAllDataFromAPIs 
} from './apiService';
import { 
  mapRawFormationToNode, 
  mapRawEtablissementToSchool 
} from './dataMapper';
import type { Node, School, Edge } from '../types';

/**
 * Cache en mémoire pour éviter les appels répétés
 */
let cachedNodes: Node[] | null = null;
let cachedSchools: School[] | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure
let cacheTimestamp = 0;

/**
 * Charge les données (formations + établissements) depuis les APIs
 * ou depuis le cache si disponible et valide
 * 
 * @returns Promise<{ nodes: Node[], schools: School[] }>
 */
export async function loadDataFromAPIs(): Promise<{
  nodes: Node[];
  schools: School[];
}> {
  // Vérifier le cache
  const now = Date.now();
  if (
    cachedNodes && 
    cachedSchools && 
    now - cacheTimestamp < CACHE_DURATION
  ) {
    console.log('📦 Données servies depuis le cache');
    return {
      nodes: cachedNodes,
      schools: cachedSchools,
    };
  }

  try {
    console.log('🔄 Récupération des données depuis les APIs ONISEP...');
    
    // Fetch parallélisé
    const { formations, etablissements } = await fetchAllDataFromAPIs();

    // Mapper les formations en Nodes
    const nodes = formations
      .slice(0, 100) // Limiter à 100 pour éviter les surcharges (ajuster selon besoin)
      .map((raw, index) => mapRawFormationToNode(raw, index + 1));

    // Mapper les établissements en Schools
    // Associer chaque école à une formation (relation 1-to-N)
    const schools = etablissements
      .slice(0, 300) // Limiter à 300
      .map((raw, index) => {
        const nodeId = (index % nodes.length) + 1; // Distribuer sur les formations
        return mapRawEtablissementToSchool(raw, index + 1, nodeId);
      });

    // Sauvegarder en cache
    cachedNodes = nodes;
    cachedSchools = schools;
    cacheTimestamp = now;

    console.log(`✅ ${nodes.length} formations et ${schools.length} établissements chargés`);

    return { nodes, schools };
  } catch (error) {
    console.error('❌ Erreur lors du chargement des APIs:', error);
    throw error;
  }
}

/**
 * Invalide le cache (utile pour forcer un refresh)
 */
export function invalidateCache(): void {
  cachedNodes = null;
  cachedSchools = null;
  cacheTimestamp = 0;
  console.log('🗑️  Cache invalidé');
}

/**
 * Recharge les données depuis les APIs (sans cache)
 */
export async function reloadDataFromAPIs(): Promise<{
  nodes: Node[];
  schools: School[];
}> {
  invalidateCache();
  return loadDataFromAPIs();
}

/**
 * Récupère juste les nœuds
 */
export async function getNodes(): Promise<Node[]> {
  const { nodes } = await loadDataFromAPIs();
  return nodes;
}

/**
 * Récupère juste les écoles
 */
export async function getSchools(): Promise<School[]> {
  const { schools } = await loadDataFromAPIs();
  return schools;
}

/**
 * Crée des EDGES (arêtes du graphe) de manière intelligente
 * 
 * Logique:
 * - ETUDE_SUP peut suivre BAC
 * - METIER peut suivre ETUDE_SUP
 * - CERTIF peut suivre n'importe quoi
 * 
 * @param nodes - Array de nœuds
 * @returns Edge[] - Arêtes générées
 */
export function generateEdgesFromNodes(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  let edgeId = 1;

  // Créer une carte par type
  const nodesByType = {
    BAC: nodes.filter(n => n.type === 'BAC'),
    ETUDE_SUP: nodes.filter(n => n.type === 'ETUDE_SUP'),
    METIER: nodes.filter(n => n.type === 'METIER'),
    CERTIF: nodes.filter(n => n.type === 'CERTIF'),
  };

  // BAC → ETUDE_SUP (mais limiter les connexions)
  nodesByType.BAC.slice(0, 5).forEach(bac => {
    nodesByType.ETUDE_SUP.slice(0, 5).forEach(etude => {
      edges.push({
        id: edgeId++,
        source_id: bac.id,
        target_id: etude.id,
        requirements: {
          difficulty: 'Medium',
          average: 10,
        },
      });
    });
  });

  // ETUDE_SUP → METIER (limiter)
  nodesByType.ETUDE_SUP.slice(0, 5).forEach(etude => {
    nodesByType.METIER.slice(0, 3).forEach(metier => {
      edges.push({
        id: edgeId++,
        source_id: etude.id,
        target_id: metier.id,
        requirements: {
          difficulty: 'Hard',
          average: 12,
        },
      });
    });
  });

  // ETUDE_SUP → CERTIF (accès alternatif)
  nodesByType.ETUDE_SUP.slice(0, 3).forEach(etude => {
    nodesByType.CERTIF.slice(0, 2).forEach(certif => {
      edges.push({
        id: edgeId++,
        source_id: etude.id,
        target_id: certif.id,
        requirements: {
          difficulty: 'Easy',
          average: 8,
        },
      });
    });
  });

  console.log(`🔗 ${edges.length} connexions générées entre nœuds`);
  return edges;
}
