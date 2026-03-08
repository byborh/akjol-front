/**
 * src/contexts/DataContext.tsx
 * 
 * Contexte pour fournir les données (NODES, SCHOOLS, EDGES) à toute l'application
 * Remplace les imports statiques de mockData
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Node, School, Edge } from '../types';
import { loadDataFromAPIs, generateEdgesFromNodes } from '../services/dataService';

interface DataContextType {
  nodes: Node[];
  schools: School[];
  edges: Edge[];
  isLoading: boolean;
  error: Error | null;
  getSchoolsByNodeId: (nodeId: number) => School[];
  getNextPathways: (nodeId: number) => Node[];
  getNodeById: (id: number) => Node | undefined;
  pruneUnusedData: (currentPath: number[], currentNodeId: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('📡 Chargement des données depuis les APIs ONISEP...');

        // Charger les données depuis les APIs
        const { nodes: apiNodes, schools: apiSchools } = await loadDataFromAPIs();

        if (!mounted) return;

        if (apiNodes.length === 0) {
          throw new Error('Aucune formation récupérée depuis l\'API');
        }

        // Générer les edges automatiquement
        const generatedEdges = generateEdgesFromNodes(apiNodes);

        setNodes(apiNodes);
        setSchools(apiSchools);
        setEdges(generatedEdges);

        console.log(`✅ ${apiNodes.length} formations chargées`);
        console.log(`✅ ${apiSchools.length} établissements chargés`);
        console.log(`✅ ${generatedEdges.length} connexions générées`);

      } catch (err) {
        if (!mounted) return;

        const error = err instanceof Error ? err : new Error('Erreur inconnue');
        console.error('❌ Erreur lors du chargement:', error);
        setError(error);

        // Fallback: charger les données mockées
        try {
          console.log('🔄 Chargement du fallback (données mockées)...');
          const { NODES, SCHOOLS, EDGES } = await import('../data/mockData');
          
          if (!mounted) return;
          
          setNodes(NODES);
          setSchools(SCHOOLS);
          setEdges(EDGES);
          setError(null);
          
          console.log('✅ Fallback chargé avec succès');
        } catch (fallbackErr) {
          console.error('❌ Fallback échoué:', fallbackErr);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, []);

  // Fonction helper: obtenir les écoles d'une formation
  const getSchoolsByNodeId = (nodeId: number): School[] => {
    return schools.filter(school => school.node_id === nodeId);
  };

  // Fonction helper: obtenir les nœuds suivants
  const getNextPathways = (nodeId: number): Node[] => {
    const connectedEdges = edges.filter(edge => edge.source_id === nodeId);
    return connectedEdges
      .map(edge => nodes.find(n => n.id === edge.target_id))
      .filter((node): node is Node => node !== undefined);
  };

  // Fonction helper: obtenir un nœud par ID
  const getNodeById = (id: number): Node | undefined => {
    return nodes.find(n => n.id === id);
  };

  /**
   * OPTIMISATION: Nettoie les données inutilisées pour libérer de la mémoire
   * Garde uniquement:
   * - Les nœuds du parcours actuel
   * - Le nœud actuel
   * - Les nœuds accessibles depuis le nœud actuel
   * - Les nœuds accessibles depuis les nœuds accessibles (horizon +2)
   */
  const pruneUnusedData = (currentPath: number[], currentNodeId: number) => {
    // Calculer les IDs à conserver
    const keepIds = new Set<number>();
    
    // 1. Conserver le parcours actuel
    currentPath.forEach(id => keepIds.add(id));
    
    // 2. Conserver le nœud actuel
    keepIds.add(currentNodeId);
    
    // 3. Conserver les nœuds accessibles depuis le nœud actuel (prochains choix)
    const nextIds = edges
      .filter(edge => edge.source_id === currentNodeId)
      .map(edge => edge.target_id);
    nextIds.forEach(id => keepIds.add(id));
    
    // 4. Conserver les nœuds accessibles depuis les prochains choix (horizon +2)
    nextIds.forEach(nextId => {
      const futureIds = edges
        .filter(edge => edge.source_id === nextId)
        .map(edge => edge.target_id);
      futureIds.forEach(id => keepIds.add(id));
    });
    
    // Filtrer les nœuds
    const prunedNodes = nodes.filter(node => keepIds.has(node.id));
    
    // Filtrer les écoles (garder uniquement celles liées aux nœuds conservés)
    const prunedSchools = schools.filter(school => keepIds.has(school.node_id));
    
    // Filtrer les edges (garder uniquement ceux entre nœuds conservés)
    const prunedEdges = edges.filter(
      edge => keepIds.has(edge.source_id) && keepIds.has(edge.target_id)
    );
    
    // Mettre à jour les states
    const removedNodes = nodes.length - prunedNodes.length;
    const removedSchools = schools.length - prunedSchools.length;
    const removedEdges = edges.length - prunedEdges.length;
    
    if (removedNodes > 0 || removedSchools > 0 || removedEdges > 0) {
      console.log(`🗑️  Nettoyage des données inutilisées:`);
      console.log(`   - ${removedNodes} formations supprimées`);
      console.log(`   - ${removedSchools} établissements supprimés`);
      console.log(`   - ${removedEdges} connexions supprimées`);
      console.log(`   ✅ Mémoire libérée!`);
      
      setNodes(prunedNodes);
      setSchools(prunedSchools);
      setEdges(prunedEdges);
    }
  };

  const value: DataContextType = {
    nodes,
    schools,
    edges,
    isLoading,
    error,
    getSchoolsByNodeId,
    getNextPathways,
    getNodeById,
    pruneUnusedData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
