/**
 * src/components/ExploreTimeline.tsx
 * 
 * Navigation horizontale "Timeline Inversée"
 * Avec animations fluides via Framer Motion
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { Node, ExploreState, UserStats, RandomEvent, School, UserPathStep } from '../types';
import { NODES, getNextPathways, getSchoolsByNodeId, MOCK_USER_STATS } from '../data/mockData';
import { calculateSuccessProbability } from '../services/probabilityService';
import { rollForEvent, applyEventEffects } from '../services/eventService';
import NodeCard from './NodeCard';
import BreakingNewsModal from './BreakingNewsModal';
import SchoolSelector from './SchoolSelector';

interface EnrichedNode extends Node {
  successProbability: number;
  riskLevel: 'safe' | 'medium' | 'risky';
}

interface ExploreTimelineProps {
  startingNodeId: number;
  userStats?: UserStats; // Optionnel, utilise les mock stats par défaut
  initialPath?: UserPathStep[];
  onPathChange?: (path: UserPathStep[]) => void;
  onShowFormationDetails?: (nodeId: number) => void;
}

/**
 * Enrichit un node avec sa probabilité de succès
 */
function enrichNodeWithProbability(node: Node, userStats: UserStats): EnrichedNode {
  const result = calculateSuccessProbability(userStats, node.requirements);
  return {
    ...node,
    successProbability: result.probability,
    riskLevel: result.riskLevel
  };
}

type TimelineColumn = {
  label: string;
  nodes: Node[];
  isCurrent: boolean;
};

export const ExploreTimeline: React.FC<ExploreTimelineProps> = ({ 
  startingNodeId,
  userStats: initialUserStats = MOCK_USER_STATS,
  initialPath,
  onPathChange,
  onShowFormationDetails
}) => {
  const startingNode = useMemo(
    () => NODES.find((node) => node.id === startingNodeId) ?? null,
    [startingNodeId]
  );
  const fallbackSchool = useMemo(
    () => getSchoolsByNodeId(startingNodeId)[0] ?? null,
    [startingNodeId]
  );

  // État de l'exploration
  const [exploreState, setExploreState] = useState<ExploreState>({
    currentNodeId: initialPath?.[initialPath.length - 1]?.node.id ?? startingNodeId,
    path:
      initialPath && initialPath.length > 0
        ? initialPath
        : startingNode && fallbackSchool
        ? [{ node: startingNode, school: fallbackSchool }]
        : [],
    direction: 'right'
  });

  // Stats utilisateur (mutables pour les événements)
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);

  // État des événements aléatoires
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [pendingStep, setPendingStep] = useState<{ node: Node; school: School } | null>(null);

  // État de sélection d'établissement
  const [isSelectingSchool, setIsSelectingSchool] = useState(false);
  const [pendingNode, setPendingNode] = useState<Node | null>(null);

  // Nœud actuellement sélectionné
  const currentNode = useMemo(
    () => NODES.find((n) => n.id === exploreState.currentNodeId),
    [exploreState.currentNodeId]
  );

  // Les nœuds accessibles depuis le nœud actuel (Colonne du milieu)
  const nextPathways = useMemo(() => getNextPathways(exploreState.currentNodeId || 0), [
    exploreState.currentNodeId
  ]);

  // Les nœuds au-delà (floutés tant que choix non fait)
  const futureOptions = useMemo(() => {
    const furtherNodes = new Set<number>();
    nextPathways.forEach((pathway) => {
      const nextNext = getNextPathways(pathway.id);
      nextNext.forEach((nn) => furtherNodes.add(nn.id));
    });
    return Array.from(furtherNodes).map((id) => NODES.find((n) => n.id === id)).filter(Boolean) as Node[];
  }, [nextPathways]);

  // Navigation - Sélectionner un nœud suivant
  const handleSelectPathway = useCallback((nodeId: number) => {
    const targetNode = NODES.find((node) => node.id === nodeId);
    if (!targetNode) return;

    // Éviter les doublons dans le path
    if (exploreState.path.some((step) => step.node.id === nodeId)) {
      return; // Ne rien faire si déjà dans le path
    }

    // Forcer la sélection d'un établissement avant de valider le nœud
    setPendingNode(targetNode);
    setIsSelectingSchool(true);
  }, [exploreState.path]);

  // Procède à la navigation après événement (ou sans événement)
  const proceedToNode = useCallback((node: Node, school: School) => {
    setExploreState((prev) => {
      // Double check : éviter les doublons même si déjà vérifié en amont
      if (prev.path.some((step) => step.node.id === node.id)) {
        return prev; // Ne rien changer si déjà dans le path
      }
      
      return {
        currentNodeId: node.id,
        path: [...prev.path, { node, school }],
        direction: 'right'
      };
    });
  }, []);

  // Validation du nœud après sélection d'un établissement
  const handleConfirmSchool = useCallback((school: School) => {
    if (!pendingNode) return;

    const selectedNode = pendingNode;
    setIsSelectingSchool(false);
    setPendingNode(null);

    // 🎲 ROLL FOR RANDOM EVENT
    const event = rollForEvent();

    if (event) {
      // Stocker l'étape complète en attente (node + school)
      setPendingStep({ node: selectedNode, school });
      setCurrentEvent(event);
      setEventModalOpen(true);
      // La navigation sera complétée après fermeture de la modale
    } else {
      // Aucun événement, naviguer directement
      proceedToNode(selectedNode, school);
    }
  }, [pendingNode, proceedToNode]);

  // Gestion de la fermeture de la modale d'événement
  const handleEventModalClose = useCallback(() => {
    if (currentEvent && pendingStep) {
      // Appliquer les effets de l'événement sur les stats
      const newStats = applyEventEffects(userStats, currentEvent.effect);
      setUserStats(newStats);

      // Naviguer vers le nœud/établissement sélectionnés
      proceedToNode(pendingStep.node, pendingStep.school);
    }

    // Reset event state
    setEventModalOpen(false);
    setCurrentEvent(null);
    setPendingStep(null);
    setPendingNode(null);
  }, [currentEvent, pendingStep, userStats, proceedToNode]);

  // Navigation - Revenir en arrière
  const handleGoBack = useCallback(() => {
    setExploreState((prev) => {
      const newPath = prev.path.slice(0, -1);
      return {
        currentNodeId: newPath[newPath.length - 1]?.node.id || prev.currentNodeId,
        path: newPath,
        direction: 'left'
      };
    });
  }, []);

  // Layout en 3 colonnes
  const columns: (TimelineColumn & { enrichedNodes: EnrichedNode[] })[] = useMemo(
    () => [
      {
        label: 'Votre parcours',
        nodes: exploreState.path.map((step) => step.node),
        enrichedNodes: exploreState.path.map((step) => {
          const node = step.node;
          return node ? enrichNodeWithProbability(node, userStats) : null;
        }).filter((n): n is EnrichedNode => n !== null),
        isCurrent: true
      },
      {
        label: 'Vos choix possibles',
        nodes: nextPathways,
        enrichedNodes: nextPathways.map(n => enrichNodeWithProbability(n, userStats)),
        isCurrent: false
      },
      {
        label: 'Projections lointaines',
        nodes: futureOptions,
        enrichedNodes: futureOptions.map(n => enrichNodeWithProbability(n, userStats)),
        isCurrent: false
      }
    ],
    [exploreState.path, nextPathways, futureOptions, userStats]
  );

  React.useEffect(() => {
    onPathChange?.(exploreState.path);
  }, [exploreState.path, onPathChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* HEADER */}
      <motion.header
        className="sticky top-0 z-40 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 px-4 md:px-6 py-3 md:py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-2xl md:text-3xl font-bold">AkJol Simulator</h1>
            <p className="text-gray-400 text-xs md:text-sm">Explorez votre chemin d'orientation</p>
          </motion.div>

          {/* Breadcrumb / Path indicator */}
          <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto max-w-full pb-2 md:pb-0">
            <AnimatePresence mode="popLayout">
              {exploreState.path.map((step, idx) => {
                return (
                  <React.Fragment key={`${step?.node.id}-${step?.school.id}-${idx}`}>
                    <motion.span
                      className="text-gray-300 truncate whitespace-nowrap flex-shrink-0"
                      initial={{ opacity: 0, x: exploreState.direction === 'right' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: exploreState.direction === 'right' ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step?.node.title} · {step?.school.name}
                    </motion.span>
                    {idx < exploreState.path.length - 1 && <span className="text-gray-500 flex-shrink-0">→</span>}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* MAIN TIMELINE - Responsive Layout */}
      <main className="px-3 md:px-6 py-4 md:py-8 pb-20 md:pb-8">
        {/* Desktop: 3 colonnes */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8 min-h-[calc(100vh-200px)]">
          {columns.map((column, colIdx) => (
            <motion.div
              key={column.label}
              className="flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: colIdx * 0.1 }}
            >
              {/* Column Header */}
              <motion.div className="mb-4 md:mb-6" whileInView={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <h2 className="text-base md:text-xl font-bold mb-2">{column.label}</h2>
                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + colIdx * 0.1 }}
                />
              </motion.div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3 md:gap-4 flex-1">
                {column.nodes.length === 0 ? (
                  <motion.div
                    className="text-center py-12 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs md:text-sm">{column.isCurrent ? 'Commencez votre exploration' : 'Sélectionnez un chemin'}</p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {column.enrichedNodes.map((node, idx) => {
                      const selectedSchool = colIdx === 0 ? exploreState.path[idx]?.school : null;
                      return (
                      <motion.div
                        key={`${node.id}-${idx}`}
                        className={colIdx === 2 ? 'opacity-50 pointer-events-none' : ''}
                        onClick={() => colIdx === 1 && handleSelectPathway(node.id)}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <NodeCard
                          node={node}
                          isActive={node.id === currentNode?.id}
                          onClick={colIdx === 1 ? () => handleSelectPathway(node.id) : undefined}
                          variant={colIdx === 0 ? 'compact' : 'expanded'}
                          showArrow={colIdx !== 2}
                          animationDelay={idx}
                          successProbability={node.successProbability}
                          riskLevel={node.riskLevel}
                        />
                        {selectedSchool && (
                          <p className="mt-2 text-xs text-gray-400 px-1">
                            Établissement : <span className="text-gray-300">{selectedSchool.name} ({selectedSchool.city})</span>
                          </p>
                        )}
                      </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tablet & Mobile: 1 colonne avec tabs/carousel */}
        <div className="lg:hidden">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {columns.map((column, colIdx) => (
              <motion.div
                key={column.label}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: colIdx * 0.1 }}
              >
                {/* Column Header */}
                <div className="mb-4">
                  <h2 className="text-lg md:text-xl font-bold mb-2">{column.label}</h2>
                  <motion.div
                    className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + colIdx * 0.1 }}
                  />
                </div>

                {/* Cards Container - Scroll horizontal sur mobile */}
                {column.nodes.length === 0 ? (
                  <motion.div
                    className="text-center py-12 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm">{column.isCurrent ? 'Commencez votre exploration' : 'Sélectionnez un chemin'}</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4">
                    <AnimatePresence mode="popLayout">
                      {column.enrichedNodes.map((node, idx) => {
                        const selectedSchool = colIdx === 0 ? exploreState.path[idx]?.school : null;
                        return (
                        <motion.div
                          key={`${node.id}-${idx}`}
                          className={colIdx === 2 ? 'opacity-50 pointer-events-none' : ''}
                          onClick={() => colIdx === 1 && handleSelectPathway(node.id)}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                          <NodeCard
                            node={node}
                            isActive={node.id === currentNode?.id}
                            onClick={colIdx === 1 ? () => handleSelectPathway(node.id) : undefined}
                            variant="compact"
                            showArrow={colIdx !== 2}
                            animationDelay={idx}
                            successProbability={node.successProbability}
                            riskLevel={node.riskLevel}
                          />
                          {selectedSchool && (
                            <p className="mt-2 text-xs text-gray-400 px-1">
                              Établissement : <span className="text-gray-300">{selectedSchool.name} ({selectedSchool.city})</span>
                            </p>
                          )}
                        </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <motion.div
          className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            onClick={handleGoBack}
            disabled={exploreState.path.length <= 1}
            whileHover={{ scale: exploreState.path.length > 1 ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed px-4 md:px-6 py-2 md:py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm md:text-base"
          >
            <ChevronLeft size={18} /> Retour
          </motion.button>

          {currentNode && onShowFormationDetails && (
            <motion.button
              onClick={() => onShowFormationDetails(currentNode.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-amber-600/20 hover:bg-amber-600/35 border border-amber-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm md:text-base text-amber-100"
            >
              📚 Voir détails formation
            </motion.button>
          )}

          <motion.div className="text-gray-400 text-sm md:text-base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {exploreState.path.length} étape(s)
          </motion.div>
        </motion.div>
      </main>

      {/* BREAKING NEWS MODAL */}
      {currentEvent && (
        <BreakingNewsModal
          isOpen={eventModalOpen}
          event={currentEvent}
          onClose={handleEventModalClose}
        />
      )}

      <SchoolSelector
        isOpen={isSelectingSchool}
        node={pendingNode}
        schools={pendingNode ? getSchoolsByNodeId(pendingNode.id) : []}
        onSelectSchool={handleConfirmSchool}
        onClose={() => {
          setIsSelectingSchool(false);
          setPendingNode(null);
        }}
      />
    </div>
  );
};

export default ExploreTimeline;
