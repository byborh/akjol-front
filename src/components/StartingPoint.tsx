/**
 * src/components/StartingPoint.tsx
 * 
 * Écran d'accueil : Où êtes-vous dans votre parcours étudiant ?
 * L'utilisateur sélectionne son nœud de départ
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { NODES } from '../data/mockData';
import type { Node } from '../types';
import NodeCard from './NodeCard';

interface StartingPointProps {
  onSelect: (nodeId: number) => void;
}

export const StartingPoint: React.FC<StartingPointProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les nœuds selon la recherche
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return NODES;
    const lower = searchTerm.toLowerCase();
    return NODES.filter(
      (n) =>
        n.title.toLowerCase().includes(lower) ||
        n.description.toLowerCase().includes(lower) ||
        n.slug.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  // Grouper par type pour meilleure UX
  const nodesByType = useMemo(() => {
    const grouped: Record<string, Node[]> = {};
    filteredNodes.forEach((node) => {
      if (!grouped[node.type]) grouped[node.type] = [];
      grouped[node.type].push(node);
    });
    return grouped;
  }, [filteredNodes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* HERO SECTION */}
      <motion.div
        className="relative py-20 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

        <div className="relative z-10">
          <motion.div
            className="flex justify-center mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={48} className="text-yellow-400" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Bienvenue sur AkJol
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Le Moteur de Simulation de Vie. Où êtes-vous maintenant ?
            <span className="block text-sm text-gray-400 mt-2">
              Sélectionnez votre point de départ pour explorer tous les chemins possibles
            </span>
          </motion.p>
        </div>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        className="px-6 mb-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            animate={{ rotate: searchTerm ? 0 : 360 }}
            transition={{ duration: searchTerm ? 0.2 : 2, repeat: searchTerm ? 0 : Infinity }}
          >
            <Search size={20} />
          </motion.div>
          <motion.input
            type="text"
            placeholder="Cherchez votre situation (ex: Bac Général, BTS, Licence...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
      </motion.div>

      {/* NODES GRID BY TYPE */}
      <div className="px-6 pb-20 max-w-7xl mx-auto">
        {Object.entries(nodesByType).map(([type, nodes]) => (
          <motion.div
            key={type}
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <motion.h2 className="text-2xl font-bold mb-6 flex items-center gap-3" variants={itemVariants}>
              <motion.div
                className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
              />
              {type === 'BAC' && '🎓 Niveau Bac'}
              {type === 'ETUDE_SUP' && '📚 Études Supérieures'}
              {type === 'METIER' && '🚀 Métiers'}
              {type === 'CERTIF' && '🏅 Certifications'}
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  onClick={() => onSelect(node.id)}
                  className="cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NodeCard
                    node={node}
                    showArrow={true}
                    variant="expanded"
                    animationDelay={idx}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}

        {filteredNodes.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-400 text-lg">Aucun résultat pour "{searchTerm}"</p>
            <p className="text-gray-500 text-sm mt-2">Essayez une autre recherche</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StartingPoint;
