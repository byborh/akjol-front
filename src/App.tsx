import { useState } from 'react';
import StartingPoint from './components/StartingPoint';
import ExploreTimeline from './components/ExploreTimeline';

type AppView = 'home' | 'explore';

const DUMMY_CREDENTIALS = {
  email: 'aaaa@gmail.com',
  password: 'aaa1234'
};

const AkJolApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<AppView>('home');
  const [startingNodeId, setStartingNodeId] = useState<number | null>(null);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidUser =
      email.trim() === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password;

    if (!isValidUser) {
      alert('Identifiants incorrects.');
      return;
    }

    setIsLoggedIn(true);
    setEmail('');
    setPassword('');
  };

  // Handlers
  const handleStartExplore = (nodeId: number) => {
    setStartingNodeId(nodeId);
    setView('explore');
  };

  const handleBackToHome = () => {
    setView('home');
    setStartingNodeId(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-sm text-gray-500 mt-2">Accédez à votre simulation AkJol</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="aaaa@gmail.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 text-white py-2.5 font-semibold hover:bg-gray-800 transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

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