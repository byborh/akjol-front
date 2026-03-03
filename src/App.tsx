import { useEffect, useMemo, useState } from 'react';
import StartingPoint from './components/StartingPoint';
import ExploreTimeline from './components/ExploreTimeline';
import type { LifeSession, UserPathStep } from './types';
import { StorageService } from './services/storageService';

type AppView = 'home' | 'explore';

const DUMMY_CREDENTIALS = {
  email: 'aaaa@gmail.com',
  password: 'aaa1234'
};

function buildDefaultSession(name: string): LifeSession {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    name,
    createdAt: Date.now(),
    path: [],
    stats: {
      wallet: 0,
      stress: 0,
      age: 17
    },
    startingNodeId: null
  };
}

const AkJolApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<AppView>('home');
  const [sessions, setSessions] = useState<LifeSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  useEffect(() => {
    const storedSessions = StorageService.getAllSessions();

    if (storedSessions.length === 0) {
      const initialSession = buildDefaultSession('Vie #1');
      StorageService.saveSession(initialSession);
      setSessions([initialSession]);
      setActiveSessionId(initialSession.id);
      setView('home');
      return;
    }

    setSessions(storedSessions);
    setActiveSessionId(storedSessions[0].id);
  }, []);

  useEffect(() => {
    if (!activeSession) return;
    setView(activeSession.path.length > 0 || activeSession.startingNodeId ? 'explore' : 'home');
  }, [activeSession]);

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

  const upsertSession = (updatedSession: LifeSession) => {
    setSessions((prev) => {
      const index = prev.findIndex((session) => session.id === updatedSession.id);
      if (index === -1) return [...prev, updatedSession];

      const clone = [...prev];
      clone[index] = updatedSession;
      return clone;
    });

    StorageService.saveSession(updatedSession);
  };

  const handleCreateNewLife = () => {
    const nextName = `Vie #${sessions.length + 1}`;
    const newSession = buildDefaultSession(nextName);

    upsertSession(newSession);
    setActiveSessionId(newSession.id);
    setView('home');
  };

  const handleDeleteSession = (id: string) => {
    StorageService.deleteSession(id);

    setSessions((prev) => {
      const updated = prev.filter((session) => session.id !== id);

      if (updated.length === 0) {
        const fallback = buildDefaultSession('Vie #1');
        StorageService.saveSession(fallback);
        setActiveSessionId(fallback.id);
        setView('home');
        return [fallback];
      }

      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }

      return updated;
    });
  };

  const startRenameSession = (session: LifeSession) => {
    setEditingSessionId(session.id);
    setEditingName(session.name);
  };

  const commitRenameSession = (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditingSessionId(null);
      setEditingName('');
      return;
    }

    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              name: trimmed
            }
          : session
      )
    );

    StorageService.updateSessionName(id, trimmed);
    setEditingSessionId(null);
    setEditingName('');
  };

  // Handlers
  const handleStartExplore = (nodeId: number) => {
    if (!activeSession) return;

    const updatedSession: LifeSession = {
      ...activeSession,
      startingNodeId: nodeId
    };

    upsertSession(updatedSession);
    setView('explore');
  };

  const handleBackToHome = () => {
    if (!activeSession) return;

    setView('home');

    const updatedSession: LifeSession = {
      ...activeSession,
      startingNodeId: null,
      path: []
    };

    upsertSession(updatedSession);
  };

  const handlePathChange = (path: UserPathStep[]) => {
    if (!activeSession) return;

    const updatedSession: LifeSession = {
      ...activeSession,
      path,
      stats: {
        ...activeSession.stats,
        age: 17 + Math.max(0, path.length - 1)
      }
    };

    upsertSession(updatedSession);
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
      <div className="sticky top-0 z-[60] border-b border-gray-700 bg-gray-900/95 backdrop-blur px-3 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = session.id === editingSessionId;

            return (
              <div
                key={session.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${
                  isActive
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-300'
                }`}
              >
                {isEditing ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    onBlur={() => commitRenameSession(session.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitRenameSession(session.id);
                      if (event.key === 'Escape') {
                        setEditingSessionId(null);
                        setEditingName('');
                      }
                    }}
                    className="w-28 rounded bg-gray-900 border border-gray-600 px-2 py-1 text-xs text-white focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => setActiveSessionId(session.id)}
                    onDoubleClick={() => startRenameSession(session)}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {session.name}
                  </button>
                )}

                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="text-xs text-gray-400 hover:text-red-400"
                  aria-label={`Supprimer ${session.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}

          <button
            onClick={handleCreateNewLife}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 whitespace-nowrap"
          >
            + Nouvelle Vie
          </button>
        </div>
      </div>

      {view === 'home' && <StartingPoint onSelect={handleStartExplore} />}

      {view === 'explore' && activeSession?.startingNodeId && (
        <div className="relative">
          <ExploreTimeline
            key={activeSession.id}
            startingNodeId={activeSession.startingNodeId}
            initialPath={activeSession.path}
            onPathChange={handlePathChange}
          />
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