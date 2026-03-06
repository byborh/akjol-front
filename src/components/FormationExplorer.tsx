import { useState, useMemo, useEffect } from 'react';
import { NODES, SCHOOLS, getSchoolsByNodeId } from '../data/mockData';
import type { Node, School } from '../types';

type ViewMode = 'formations' | 'schools';
type FilterType = 'all' | 'BAC' | 'ETUDE_SUP' | 'METIER';

export interface FormationExplorerProps {
  onClose: () => void;
  selectedNodeId?: number | null;
}

export const FormationExplorer: React.FC<FormationExplorerProps> = ({ onClose, selectedNodeId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('formations');
  const [selectedFormation, setSelectedFormation] = useState<Node | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pré-sélectionner la formation si elle provient de la simulation
  useEffect(() => {
    if (selectedNodeId) {
      const node = NODES.find((n) => n.id === selectedNodeId);
      if (node) {
        setSelectedFormation(node);
        setViewMode('formations');
      }
    }
  }, [selectedNodeId]);

  // Filtered & Searched Formations
  const filteredFormations = useMemo(() => {
    return NODES.filter((node) => {
      const typeMatch = filterType === 'all' || node.type === filterType;
      const searchMatch =
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [filterType, searchTerm]);

  // Schools for selected formation
  const schoolsForFormation = useMemo(() => {
    if (!selectedFormation) return [];
    return getSchoolsByNodeId(selectedFormation.id);
  }, [selectedFormation]);

  // Formations for selected school
  const formationsForSchool = useMemo(() => {
    if (!selectedSchool) return [];
    return NODES.filter((node) => node.id === selectedSchool.node_id);
  }, [selectedSchool]);

  // Count formations per school
  const formationsCountBySchool = useMemo(() => {
    const counts: Record<number, number> = {};
    SCHOOLS.forEach((school) => {
      const formationCount = NODES.filter((node) => node.id === school.node_id).length;
      counts[school.id] = formationCount;
    });
    return counts;
  }, []);

  // Handler pour naviguer vers une école depuis une formation
  const handleGoToSchool = (school: School) => {
    setViewMode('schools');
    setSelectedSchool(school);
    setSelectedFormation(null);
  };

  // Handler pour naviguer vers une formation depuis une école
  const handleGoToFormation = (formation: Node) => {
    setViewMode('formations');
    setSelectedFormation(formation);
    setSelectedSchool(null);
  };

  const getFormationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BAC: '🎓 Baccalauréat',
      ETUDE_SUP: '📚 Études Supérieures',
      METIER: '💼 Métier'
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Formations & Établissements</h2>
            <p className="text-blue-100 mt-1">Explorez les formations et leurs établissements</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-gray-800 px-8 py-4 flex gap-4 border-b border-gray-700">
          <button
            onClick={() => {
              setViewMode('formations');
              setSelectedSchool(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'formations'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            📚 Formations & Écoles
          </button>
          <button
            onClick={() => {
              setViewMode('schools');
              setSelectedFormation(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'schools'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            🏢 Établissements & Formations
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-96 bg-gray-800 border-r border-gray-700 overflow-y-auto flex flex-col">
            {viewMode === 'formations' ? (
              <>
                {/* Filter Section */}
                <div className="p-4 border-b border-gray-700">
                  <div className="mb-3">
                    <label className="text-sm font-semibold text-gray-300 block mb-2">
                      Type de formation
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as FilterType)}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tous les types</option>
                      <option value="BAC">🎓 Baccalauréat</option>
                      <option value="ETUDE_SUP">📚 Études Supérieures</option>
                      <option value="METIER">💼 Métier</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">
                      Rechercher
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nom, description..."
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Formations List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredFormations.map((formation) => (
                    <button
                      key={formation.id}
                      onClick={() => setSelectedFormation(formation)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedFormation?.id === formation.id
                          ? `${formation.color} bg-gradient-to-r text-white font-semibold`
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{formation.icon} {formation.title}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {getFormationTypeLabel(formation.type)}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Schools List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {SCHOOLS.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => setSelectedSchool(school)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedSchool?.id === school.id
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">🏢 {school.name}</div>
                      <div className="text-xs mt-1 opacity-75">{school.city}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-yellow-400">★ {school.rating}/5</div>
                        <div className="text-xs opacity-60">
                          • {formationsCountBySchool[school.id] || 0} formation(s)
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Detail Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-850">
            {viewMode === 'formations' ? (
              selectedFormation ? (
                <div className="space-y-6">
                  {/* Formation Header */}
                  <div
                    className={`bg-gradient-to-r ${selectedFormation.color} rounded-lg p-6 text-white`}
                  >
                    <div className="text-5xl mb-3">{selectedFormation.icon}</div>
                    <h3 className="text-3xl font-bold mb-2">{selectedFormation.title}</h3>
                    <p className="text-white/90">{selectedFormation.description}</p>
                  </div>

                  {/* Metadata */}
                  {Object.keys(selectedFormation.metadata || {}).length > 0 && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-3">Informations</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedFormation.metadata || {}).map(([key, value]) => (
                          <div key={key} className="bg-gray-600 rounded p-3">
                            <div className="text-xs text-gray-300 uppercase font-semibold">{key}</div>
                            <div className="text-white mt-1">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedFormation.requirements && 
                    Object.keys(selectedFormation.requirements).length > 0 && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-3">Prérequis</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedFormation.requirements).map(([key, value]) => (
                          <div key={key} className="bg-gray-600 rounded p-3">
                            <div className="text-xs text-gray-300 uppercase font-semibold">{key}</div>
                            <div className="text-white mt-1">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schools for this Formation */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      🏢 Établissements offrant cette formation ({schoolsForFormation.length})
                    </h4>
                    {schoolsForFormation.length > 0 ? (
                      <div className="space-y-2">
                        {schoolsForFormation.map((school) => (
                          <button
                            key={school.id}
                            onClick={() => handleGoToSchool(school)}
                            className="w-full text-left bg-gray-600 hover:bg-gray-500 rounded p-3 flex justify-between items-start transition-colors cursor-pointer group"
                          >
                            <div>
                              <div className="font-semibold text-white group-hover:text-blue-300">
                                {school.name} →
                              </div>
                              <div className="text-sm text-gray-300">{school.city}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-yellow-400">★ {school.rating}</div>
                              <div className="text-xs text-gray-400">/5</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm italic">
                        Aucun établissement trouvé
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-lg">📚</p>
                    <p>Sélectionnez une formation pour voir les détails</p>
                  </div>
                </div>
              )
            ) : selectedSchool ? (
              <div className="space-y-6">
                {/* School Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
                  <div className="text-5xl mb-3">🏢</div>
                  <h3 className="text-3xl font-bold mb-2">{selectedSchool.name}</h3>
                  <p className="text-white/90">{selectedSchool.city}</p>
                  <div className="mt-3 inline-flex items-center gap-1">
                    <span className="text-2xl font-bold">⭐ {selectedSchool.rating}</span>
                    <span className="text-sm text-white/70">/5</span>
                  </div>
                </div>

                {/* Formations Offered */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    📚 Formation proposée
                  </h4>
                  {formationsForSchool.length > 0 ? (
                    <div className="space-y-3">
                      {formationsForSchool.map((formation) => (
                        <button
                          key={formation.id}
                          onClick={() => handleGoToFormation(formation)}
                          className={`w-full text-left bg-gradient-to-r ${formation.color} rounded-lg p-4 text-white hover:opacity-90 transition-opacity cursor-pointer group`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{formation.icon}</div>
                            <div className="flex-1">
                              <div className="font-bold text-lg group-hover:underline">
                                {formation.title} →
                              </div>
                              <div className="text-sm text-white/80 mt-1">
                                {formation.description}
                              </div>
                              <div className="text-xs text-white/60 mt-2">
                                {getFormationTypeLabel(formation.type)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm italic">
                      Aucune formation trouvée
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-lg">🏢</p>
                  <p>Sélectionnez un établissement pour voir les formations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
