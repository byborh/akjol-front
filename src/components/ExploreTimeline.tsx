/**
 * src/components/ExploreTimeline.tsx
 * 
 * Navigation horizontale "Timeline Inversée"
 * Avec animations fluides via Framer Motion
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { Node, ExploreState } from '../types';
import { NODES, getNextPathways } from '../data/mockData';
import NodeCard from './NodeCard';

interface ExploreTimelineProps {
  startingNodeId: number;
}

type TimelineColumn = {
  label: string;
  nodes: Node[];
  isCurrent: boolean;
};

export const ExploreTimeline: React.FC<ExploreTimelineProps> = ({ startingNodeId }) => {
  // État de l'exploration
  const [exploreState, setExploreState] = useState<ExploreState>({
    currentNodeId: startingNodeId,
    path: [startingNodeId],
    direction: 'right'
  });

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
    setExploreState((prev) => ({
      currentNodeId: nodeId,
      path: [...prev.path, nodeId],
      direction: 'right'
    }));
  }, []);

  // Navigation - Revenir en arrière
  const handleGoBack = useCallback(() => {
    setExploreState((prev) => {
      const newPath = prev.path.slice(0, -1);
      return {
        currentNodeId: newPath[newPath.length - 1] || prev.currentNodeId,
        path: newPath,
        direction: 'left'
      };
    });
  }, []);

  // Layout en 3 colonnes
  const columns: TimelineColumn[] = useMemo(
    () => [
      {
        label: 'Votre parcours',
        nodes: exploreState.path.map((id) => NODES.find((n) => n.id === id)).filter(Boolean) as Node[],
        isCurrent: true
      },
      {
        label: 'Vos choix possibles',
        nodes: nextPathways,
        isCurrent: false
      },
      {
        label: 'Projections lointaines',
        nodes: futureOptions,
        isCurrent: false
      }
    ],
    [exploreState.path, nextPathways, futureOptions]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* HEADER */}
      <motion.header
        className="sticky top-0 z-40 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl font-bold">AkJol Simulator</h1>
            <p className="text-gray-400 text-sm">Explorez votre chemin d'orientation</p>
          </motion.div>

          {/* Breadcrumb / Path indicator */}
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <AnimatePresence mode="popLayout">
              {exploreState.path.map((nodeId, idx) => {
                const node = NODES.find((n) => n.id === nodeId);
                return (
                  <React.Fragment key={nodeId}>
                    <motion.span
                      className="text-gray-300 truncate max-w-[150px]"
                      initial={{ opacity: 0, x: exploreState.direction === 'right' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: exploreState.direction === 'right' ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {node?.title}
                    </motion.span>
                    {idx < exploreState.path.length - 1 && <span className="text-gray-500">→</span>}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* MAIN TIMELINE */}
      <main className="px-6 py-8">
        {/* Grid 3 colonnes */}
        <div className="grid grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">
          {columns.map((column, colIdx) => (
            <motion.div
              key={column.label}
              className="flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: colIdx * 0.1 }}
            >
              {/* Column Header */}
              <motion.div className="mb-6" whileInView={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <h2 className="text-xl font-bold mb-2">{column.label}</h2>
                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + colIdx * 0.1 }}
                />
              </motion.div>

              {/* Cards Container */}
              <div className="flex flex-col gap-4 flex-1">
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
                  <AnimatePresence mode="popLayout">
                    {column.nodes.map((node, idx) => (
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
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation buttons */}
        <motion.div
          className="mt-12 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            onClick={handleGoBack}
            disabled={exploreState.path.length <= 1}
            whileHover={{ scale: exploreState.path.length > 1 ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <ChevronLeft size={20} /> Retour
          </motion.button>

          <motion.div className="text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {exploreState.path.length} étape(s) exploré(es)
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExploreTimeline;
