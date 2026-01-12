import React, { useState, useMemo } from 'react';
import { Search, Settings, Share, Home, User, Files, MapPin, GraduationCap } from 'lucide-react';
// Importation de tes données de test
import { DATA_NODES, EduNode } from './data/mockData';

const AkJolHome = () => {
  // Etat pour stocker ce que l'utilisateur tape
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage intelligent des données
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return DATA_NODES; // Si rien n'est tapé, on montre tout (ou une sélection par défaut)
    
    return DATA_NODES.filter(node => 
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  // On sépare les données filtrées par étage pour l'affichage
  const topNodes = filteredNodes.filter(n => n.category === 'POST-BAC');
  const middleNodes = filteredNodes.filter(n => n.category === 'LYCEE');
  const bottomNodes = filteredNodes.filter(n => n.category === 'COLLEGE');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-blue-600 transition">
            <Settings size={24} />
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Rechercher (ex: BTS, SIO, Lyon...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </header>

      {/* --- MAIN CANVAS --- */}
      <main className="pb-24 pt-8 px-4 flex flex-col items-center justify-center min-h-[80vh] relative">
        
        {/* SVG Arrière-plan (Décoratif) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30" style={{ stroke: '#cbd5e1', strokeWidth: 2 }}>
           <line x1="50%" y1="20%" x2="50%" y2="80%" strokeDasharray="5,5" />
        </svg>

        {/* NIVEAU 1 : POST-BAC (Dynamique) */}
        <div className="z-10 w-full flex flex-wrap justify-center gap-4 mb-12 min-h-[150px]">
          {topNodes.length > 0 ? (
            topNodes.slice(0, 3).map(node => (
              <NodeCard 
                key={node.id}
                title={node.title} 
                subtitle={node.subtitle} 
                type="top"
              />
            ))
          ) : (
             <div className="text-gray-400 text-sm italic mt-10">Aucune poursuite d'étude trouvée</div>
          )}
        </div>

        {/* NIVEAU 2 : LYCÉE (Dynamique) */}
        <div className="z-10 w-full flex flex-wrap justify-center gap-2 mb-20 min-h-[120px]">
          {middleNodes.map(node => (
             <div key={node.id} className={node.type === 'General' ? '-mt-6' : 'mt-6'}>
                <NodeCard 
                  title={node.title} 
                  subtitle={node.subtitle} 
                  highlight={node.type === 'General'}
                  compact={node.type !== 'General'}
                />
             </div>
          ))}
        </div>

        {/* NIVEAU 3 : COLLÈGE (Dynamique) */}
        <div className="z-10 w-full flex justify-center">
          {bottomNodes.length > 0 && (
             <NodeCard 
               title={bottomNodes[0].title} // On affiche juste le premier trouvé pour l'exemple
               subtitle={bottomNodes[0].subtitle} 
               icon={<MapPin size={16} />}
             />
          )}
        </div>

      </main>

      {/* --- FLOATING ACTION BUTTON --- */}
      <button className="fixed bottom-24 right-6 bg-white border-2 border-gray-800 text-gray-800 p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition z-50">
        <Share size={24} />
      </button>

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 h-20 z-50">
        <div className="flex justify-between items-center h-full pb-2">
          <NavItem icon={<Files size={24} />} label="Vues" />
          <NavItem icon={<Home size={28} />} label="Accueil" active />
          <NavItem icon={<User size={24} />} label="Compte" />
        </div>
      </nav>

    </div>
  );
};

// --- COMPOSANTS REUTILISABLES (Inchangés) ---

const NodeCard = ({ title, subtitle, highlight, compact, icon, type }: any) => {
  return (
    <div className={`
      relative flex flex-col items-center justify-center text-center 
      bg-white border-2 shadow-sm transition-all cursor-pointer hover:shadow-md hover:-translate-y-1
      ${highlight ? 'border-blue-600 ring-2 ring-blue-100 scale-105 z-20' : 'border-gray-300'}
      ${compact ? 'w-24 h-24 p-1 rounded-2xl' : 'w-40 h-32 p-3 rounded-3xl'}
    `}>
      <div className="mb-2 text-gray-400">
        {icon || <GraduationCap size={compact ? 18 : 24} />}
      </div>
      <h3 className={`font-bold text-gray-800 leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>
        {title}
      </h3>
      <div className={`mt-2 bg-gray-100 text-gray-500 rounded-full px-2 py-1 truncate max-w-full ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
        {subtitle}
      </div>
      {type !== 'top' && <div className="absolute -top-1.5 w-3 h-3 bg-gray-800 rounded-full border-2 border-white"></div>}
      <div className="absolute -bottom-1.5 w-3 h-3 bg-gray-800 rounded-full border-2 border-white"></div>
    </div>
  );
};

const NavItem = ({ icon, label, active }: any) => (
  <button className={`flex flex-col items-center gap-1 w-16 ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
    {active && <div className="w-8 h-1 bg-gray-900 rounded-full mb-1 absolute top-0" />}
    <div className={active ? "mt-1" : ""}>{icon}</div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default AkJolHome;