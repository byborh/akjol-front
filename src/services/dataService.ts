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
 * - Tous les BAC peuvent mener vers ETUDE_SUP (connexions basées sur domaines)
 * - Tous les ETUDE_SUP peuvent mener vers METIER (connexions basées sur domaines)
 * - CERTIF accessible depuis ETUDE_SUP
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

  // Helper: trouve les domaines d'un nœud
  const getDomains = (node: Node): string[] => {
    const domains: string[] = [];
    
    // Extraire des métadonnées
    if (node.metadata?.domaine) {
      domains.push(String(node.metadata.domaine).toLowerCase());
    }
    if (node.metadata?.sous_domaine) {
      domains.push(String(node.metadata.sous_domaine).toLowerCase());
    }
    
    // Extraire du titre/description
    const text = `${node.title} ${node.description}`.toLowerCase();
    if (text.includes('science') || text.includes('scientifique')) domains.push('sciences');
    if (text.includes('littéraire') || text.includes('lettres')) domains.push('lettres');
    if (text.includes('économique') || text.includes('économie')) domains.push('economie');
    if (text.includes('technologique') || text.includes('technologie')) domains.push('technologie');
    if (text.includes('professionnel') || text.includes('pro')) domains.push('professionnel');
    if (text.includes('art') || text.includes('artistique')) domains.push('arts');
    if (text.includes('sport') || text.includes('eps')) domains.push('sport');
    if (text.includes('santé') || text.includes('médical')) domains.push('sante');
    if (text.includes('social') || text.includes('humanitaire')) domains.push('social');
    if (text.includes('informatique') || text.includes('numérique')) domains.push('informatique');
    
    return domains.length > 0 ? domains : ['general'];
  };

  // Helper: calcule compatibilité entre domaines
  const domainsMatch = (domains1: string[], domains2: string[]): boolean => {
    if (domains1.includes('general') || domains2.includes('general')) return true;
    return domains1.some(d1 => domains2.includes(d1));
  };

  // BAC → ETUDE_SUP (connexions intelligentes basées sur domaines)
  nodesByType.BAC.forEach(bac => {
    const bacDomains = getDomains(bac);
    const compatibleEtudes = nodesByType.ETUDE_SUP.filter(etude => 
      domainsMatch(bacDomains, getDomains(etude))
    );
    
    // Limite à 8 connexions max par BAC pour éviter l'explosion
    compatibleEtudes.slice(0, 8).forEach(etude => {
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
    
    // Si aucune connexion compatible, connecter au moins à quelques ETUDE_SUP généraux
    if (compatibleEtudes.length === 0) {
      nodesByType.ETUDE_SUP.slice(0, 3).forEach(etude => {
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
    }
  });

  // ETUDE_SUP → METIER (connexions basées sur domaines)
  nodesByType.ETUDE_SUP.forEach(etude => {
    const etudeDomains = getDomains(etude);
    const compatibleMetiers = nodesByType.METIER.filter(metier =>
      domainsMatch(etudeDomains, getDomains(metier))
    );
    
    // Limite à 5 métiers max par ETUDE_SUP
    compatibleMetiers.slice(0, 5).forEach(metier => {
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
    
    // Fallback si aucune correspondance
    if (compatibleMetiers.length === 0 && nodesByType.METIER.length > 0) {
      nodesByType.METIER.slice(0, 2).forEach(metier => {
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
    }
  });

  // ETUDE_SUP → CERTIF (accès alternatif pour tous)
  nodesByType.ETUDE_SUP.forEach(etude => {
    // Limite à 2 certifs par ETUDE_SUP
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

  // BAC → METIER direct (pour bacs professionnels)
  nodesByType.BAC.filter(bac => 
    getDomains(bac).includes('professionnel') || bac.title.toLowerCase().includes('pro')
  ).forEach(bacPro => {
    const bacDomains = getDomains(bacPro);
    const compatibleMetiers = nodesByType.METIER.filter(metier =>
      domainsMatch(bacDomains, getDomains(metier))
    );
    
    compatibleMetiers.slice(0, 3).forEach(metier => {
      edges.push({
        id: edgeId++,
        source_id: bacPro.id,
        target_id: metier.id,
        requirements: {
          difficulty: 'Medium',
          average: 10,
        },
      });
    });
  });

  console.log(`🔗 ${edges.length} connexions générées entre ${nodes.length} nœuds`);
  console.log(`   - ${nodesByType.BAC.length} BAC`);
  console.log(`   - ${nodesByType.ETUDE_SUP.length} ETUDE_SUP`);
  console.log(`   - ${nodesByType.METIER.length} METIER`);
  console.log(`   - ${nodesByType.CERTIF.length} CERTIF`);
  
  return edges;
}
