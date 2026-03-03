import { useState } from 'react';
import StartingPoint from './components/StartingPoint';
import ExploreTimeline from './components/ExploreTimeline';

type AppView = 'home' | 'explore';

const AkJolApp = () => {
  const [view, setView] = useState<AppView>('home');
  const [startingNodeId, setStartingNodeId] = useState<number | null>(null);

  // Handlers
  const handleStartExplore = (nodeId: number) => {
    setStartingNodeId(nodeId);
    setView('explore');
  };

  const handleBackToHome = () => {
    setView('home');
    setStartingNodeId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {view === 'home' && <StartingPoint onSelect={handleStartExplore} />}

      {view === 'explore' && startingNodeId && (
        <div className="relative">
          <ExploreTimeline startingNodeId={startingNodeId} />
          <button
            onClick={handleBackToHome}
            className="fixed top-6 left-6 z-50 px-4 py-2 bg-gray-700/80 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition"
          >
            ← Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  );
};

const AkJolHome = () => {
  return <AkJolApp />;
};

const App = () => {
  return <AkJolHome />;
};

export default App;