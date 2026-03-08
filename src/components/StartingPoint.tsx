/**
 * src/components/StartingPoint.tsx
 * 
 * Écran d'accueil : Où êtes-vous dans votre parcours étudiant ?
 * L'utilisateur sélectionne son nœud de départ
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useDebounce } from '../hooks/useDebounce';
import type { Node } from '../types';
import NodeCard from './NodeCard';

interface StartingPointProps {
  onSelect: (nodeId: number) => void;
}

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const StartingPoint: React.FC<StartingPointProps> = ({ onSelect }) => {
  const { nodes } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState(false);
  
  // Debounce pour éviter trop de re-renders
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtrer les nœuds selon la recherche (OPTIMISÉ)
  const filteredNodes = useMemo(() => {
    if (!debouncedSearchTerm) return nodes;
    const normalizedSearchTerm = normalizeSearchValue(debouncedSearchTerm.trim());

    return nodes.filter(
      (n) => {
        // RECHERCHE SIMPLE (par défaut): uniquement le titre
        if (!advancedSearch) {
          return normalizeSearchValue(n.title).includes(normalizedSearchTerm);
        }

        // RECHERCHE APPROFONDIE: tous les champs
        const searchableText = [
          n.title,
          n.description,
          n.slug,
          String(n.metadata?.type_official || ''),
          String(n.metadata?.level || ''),
          Array.isArray(n.metadata?.domains) ? n.metadata.domains.join(' ') : ''
        ].join(' ');

        return normalizeSearchValue(searchableText).includes(normalizedSearchTerm);
      }
    );
  }, [debouncedSearchTerm, nodes, advancedSearch]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-[#E2E8F0] to-[#F8F9FA] dark:from-[#121212] dark:via-[#27272A] dark:to-[#121212] text-gray-900 dark:text-[#F3F4F6] transition-colors duration-200">
      {/* HERO SECTION */}
      <motion.div
        className="relative py-12 md:py-20 px-4 md:px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 via-[#7C3AED]/10 to-[#8B5CF6]/10 blur-3xl" />

        <div className="relative z-10">
          <motion.div
            className="flex justify-center mb-4 md:mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={40} className="md:w-12 md:h-12 text-[#8B5CF6]" />
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#8B5CF6]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Bienvenue sur AkJol
          </motion.h1>

          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Le Moteur de Simulation de Vie. Où êtes-vous maintenant ?
            <span className="block text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2">
              Sélectionnez votre point de départ pour explorer tous les chemins possibles
            </span>
          </motion.p>
        </div>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        className="px-4 md:px-6 mb-10 md:mb-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400"
            animate={{ rotate: searchTerm ? 0 : 360 }}
            transition={{ duration: searchTerm ? 0.2 : 2, repeat: searchTerm ? 0 : Infinity }}
          >
            <Search size={18} className="md:w-5 md:h-5" />
          </motion.div>
          <motion.input
            type="text"
            placeholder={advancedSearch ? "Recherche approfondie (tous les champs)..." : "Cherchez votre situation (ex: Bac, BTS, Licence...)"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#E2E8F0] dark:bg-[#27272A] border-2 border-[#E2E8F0] dark:border-[#27272A] rounded-xl py-2.5 md:py-3 pl-10 md:pl-12 pr-3 md:pr-4 text-sm md:text-base text-gray-900 dark:text-[#F3F4F6] placeholder-gray-600 dark:placeholder-gray-400 focus:border-[#8B5CF6] focus:outline-none transition-colors"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
        
        {/* Toggle recherche approfondie + Compteur de résultats */}
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={advancedSearch}
              onChange={(e) => setAdvancedSearch(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
            <span>🔍 Recherche approfondie (description, domaines, niveau...)</span>
          </label>
          
          {debouncedSearchTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs md:text-sm font-medium text-[#8B5CF6] bg-[#8B5CF6]/10 px-3 py-1 rounded-full"
            >
              {filteredNodes.length} résultat{filteredNodes.length > 1 ? 's' : ''}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* NODES GRID BY TYPE */}
      <div className="px-4 md:px-6 pb-20 md:pb-20 max-w-7xl mx-auto">
        {Object.entries(nodesByType).map(([type, nodes]) => (
          <motion.div
            key={type}
            className="mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <motion.h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3" variants={itemVariants}>
              <motion.div
                className="h-1 w-12 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
              />
              <span>
                {type === 'BAC' && '🎓 Niveau Bac'}
                {type === 'ETUDE_SUP' && '📚 Études Supérieures'}
                {type === 'METIER' && '🚀 Métiers'}
                {type === 'CERTIF' && '🏅 Certifications'}
              </span>
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
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
            className="text-center py-16 md:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Aucun résultat pour "{searchTerm}"</p>
            <p className="text-gray-600 dark:text-gray-500 text-xs md:text-sm mt-2">Essayez une autre recherche</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StartingPoint;
