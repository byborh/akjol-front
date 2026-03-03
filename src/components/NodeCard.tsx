/**
 * src/components/NodeCard.tsx
 * 
 * Card pour afficher un Node (Bac, Étude, Métier)
 * Design style Pinterest/Canva : minimaliste et élégant
 * Avec animations fluides Framer Motion
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Node } from '../types';

interface NodeCardProps {
  node: Node;
  onClick?: () => void;
  isActive?: boolean;
  showArrow?: boolean;
  variant?: 'compact' | 'expanded';
  animationDelay?: number;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onClick,
  isActive = false,
  showArrow = true,
  variant = 'compact',
  animationDelay = 0
}) => {
  const baseClasses =
    'rounded-lg border-2 border-transparent transition-all cursor-pointer relative overflow-hidden group';

  const sizeClasses = variant === 'expanded' ? 'p-6 w-full' : 'p-4 w-full';

  const bgGradient = node.color || 'from-gray-400 to-gray-500';
  const bgClass = `bg-gradient-to-br ${bgGradient}`;

  const hoverClasses = isActive
    ? 'ring-4 ring-white shadow-2xl'
    : 'shadow-md hover:shadow-lg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: animationDelay * 0.05 }}
      whileHover={{ scale: isActive ? 1.05 : 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${bgClass} ${hoverClasses} text-white`}
    >
      {/* Overlay semi-transparent au hover */}
      <motion.div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none"
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      />

      {/* Contenu */}
      <div className="relative z-10">
        {/* Icon + Type Badge */}
        <motion.div className="flex items-center justify-between mb-3" whileHover={{ x: 4 }}>
          <motion.span
            className="text-2xl"
            animate={isActive ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            {node.icon || '📌'}
          </motion.span>
          <motion.span
            className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            {node.type}
          </motion.span>
        </motion.div>

        {/* Titre */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:line-clamp-none">
          {node.title}
        </h3>

        {/* Description */}
        {variant === 'expanded' && (
          <motion.p
            className="text-sm text-white/90 mb-4 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay * 0.05 + 0.1 }}
          >
            {node.description}
          </motion.p>
        )}

        {/* Metadata mini display */}
        {variant === 'expanded' && node.metadata && (
          <motion.div
            className="grid grid-cols-2 gap-2 mb-4 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
          >
            {Object.entries(node.metadata)
              .slice(0, 4)
              .map(([key, value]) => (
                <motion.div
                  key={key}
                  className="bg-white/10 rounded p-2"
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <span className="font-semibold">{key}:</span>
                  <span className="text-white/80"> {String(value).substring(0, 15)}</span>
                </motion.div>
              ))}
          </motion.div>
        )}

        {/* Arrow indicator */}
        {showArrow && (
          <motion.div
            className="flex items-center gap-2 text-sm font-semibold mt-3 opacity-0 group-hover:opacity-100"
            whileHover={{ x: 4 }}
          >
            Voir plus{' '}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Active indicator avec animation pulse */}
      {isActive && (
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white/80"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default NodeCard;
