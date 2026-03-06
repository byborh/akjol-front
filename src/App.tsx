import { useEffect, useMemo, useState } from 'react';
import StartingPoint from './components/StartingPoint';
import ExploreTimeline from './components/ExploreTimeline';
import type { LifeSession, UserPathStep } from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { LifeSharingService } from './services/lifeSharingService';

type AppView = 'home' | 'explore';

const DUMMY_CREDENTIALS = {
  email: 'aaaa@gmail.com',
  password: 'aaa1234'
};

function buildUniqueName(baseName: string, existingNames: string[]): string {
  const cleaned = baseName.trim() || 'Vie importee';
  if (!existingNames.includes(cleaned)) return cleaned;

  let counter = 2;
  let candidate = `${cleaned} (${counter})`;

  while (existingNames.includes(candidate)) {
    counter += 1;
    candidate = `${cleaned} (${counter})`;
  }

  return candidate;
}

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
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [pendingSharedToken, setPendingSharedToken] = useState<string | null>(null);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [shareFeedback, setShareFeedback] = useState('');
  const [importFeedback, setImportFeedback] = useState('');
  const [latestShareUrl, setLatestShareUrl] = useState('');

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  useEffect(() => {
    // Check if user is still authenticated (session may have expired)
    const authSession = AuthService.getAuthSession();
    if (authSession) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const storedSessions = StorageService.getAllSessions();

    if (storedSessions.length === 0) {
      const initialSession = buildDefaultSession('Vie #1');
      StorageService.saveSession(initialSession);
      setSessions([initialSession]);
      setActiveSessionId(initialSession.id);
      setView('home');
      setSessionsLoaded(true);
      return;
    }

    setSessions(storedSessions);

    // Restaurer la dernière session active si elle existe encore
    const lastActiveId = StorageService.getActiveSessionId();
    const isValidId = lastActiveId && storedSessions.some((s) => s.id === lastActiveId);
    setActiveSessionId(isValidId ? lastActiveId : storedSessions[0].id);
    setSessionsLoaded(true);
  }, []);

  useEffect(() => {
    const sharedToken = LifeSharingService.consumeTokenFromCurrentUrl();
    if (sharedToken) {
      setPendingSharedToken(sharedToken);
      setShowImportPanel(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionsLoaded || !isLoggedIn || !pendingSharedToken) return;

    try {
      const imported = LifeSharingService.importSessionFromInput(pendingSharedToken);
      const uniqueName = buildUniqueName(imported.name, sessions.map((session) => session.name));
      const prepared: LifeSession = {
        ...imported,
        name: uniqueName
      };

      upsertSession(prepared);
      setActiveSessionId(prepared.id);
      setImportFeedback('Vie partagee importee automatiquement.');
      setImportValue('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import impossible.';
      setImportFeedback(message);
    } finally {
      setPendingSharedToken(null);
    }
  }, [isLoggedIn, pendingSharedToken, sessions, sessionsLoaded]);

  useEffect(() => {
    if (!activeSession) return;
    setView(activeSession.path.length > 0 || activeSession.startingNodeId ? 'explore' : 'home');
  }, [activeSession]);

  // Persister l'ID de la session active
  useEffect(() => {
    if (activeSessionId) {
      StorageService.setActiveSessionId(activeSessionId);
    }
  }, [activeSessionId]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidUser =
      email.trim() === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password;

    if (!isValidUser) {
      alert('Identifiants incorrects.');
      return;
    }

    AuthService.saveAuthSession(email.trim());
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

  const handleLogout = () => {
    AuthService.clearAuthSession();
    setIsLoggedIn(false);
  };

  const handleShareCurrentLife = async () => {
    if (!activeSession) return;

    const shareUrl = LifeSharingService.buildShareUrlForSession(activeSession);
    setLatestShareUrl(shareUrl);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Simulation AkJol: ${activeSession.name}`,
          text: 'Voici ma simulation de vie AkJol.',
          url: shareUrl
        });
        setShareFeedback('Lien partage avec le menu natif.');
        return;
      } catch {
        // Fallback clipboard below
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback('Lien copie dans le presse-papiers.');
    } catch {
      setShareFeedback('Copie automatique impossible. Copiez le lien affiche.');
    }
  };

  const handleCopyLatestShareUrl = async () => {
    if (!latestShareUrl) return;

    try {
      await navigator.clipboard.writeText(latestShareUrl);
      setShareFeedback('Lien copie dans le presse-papiers.');
    } catch {
      setShareFeedback('Impossible de copier automatiquement ce lien.');
    }
  };

  const handleImportSharedLife = () => {
    try {
      const imported = LifeSharingService.importSessionFromInput(importValue);
      const uniqueName = buildUniqueName(imported.name, sessions.map((session) => session.name));
      const prepared: LifeSession = {
        ...imported,
        name: uniqueName
      };

      upsertSession(prepared);
      setActiveSessionId(prepared.id);
      setImportFeedback(`Vie importee: ${prepared.name}`);
      setImportValue('');
      setShowImportPanel(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import impossible.';
      setImportFeedback(message);
    }
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
        <div className="flex items-center justify-between gap-2">
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareCurrentLife}
              className="rounded-lg border border-blue-600 bg-blue-600/20 px-3 py-1.5 text-sm text-blue-100 hover:bg-blue-600/35 whitespace-nowrap transition"
            >
              Partager cette vie
            </button>

            <button
              onClick={() => {
                setShowImportPanel((prev) => !prev);
                setImportFeedback('');
              }}
              className="rounded-lg border border-emerald-600 bg-emerald-600/20 px-3 py-1.5 text-sm text-emerald-100 hover:bg-emerald-600/35 whitespace-nowrap transition"
            >
              Recuperer une vie
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-red-700/50 hover:border-red-600 whitespace-nowrap transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {(latestShareUrl || showImportPanel || shareFeedback || importFeedback) && (
          <div className="mt-2 flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800/70 p-2">
            {latestShareUrl && (
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input
                  readOnly
                  value={latestShareUrl}
                  className="w-full rounded border border-gray-600 bg-gray-900 px-2 py-1 text-xs text-gray-200"
                />
                <button
                  onClick={handleCopyLatestShareUrl}
                  className="rounded border border-gray-500 bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600 whitespace-nowrap"
                >
                  Copier le lien
                </button>
              </div>
            )}

            {showImportPanel && (
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input
                  value={importValue}
                  onChange={(event) => setImportValue(event.target.value)}
                  placeholder="Collez le lien ou le token de partage"
                  className="w-full rounded border border-gray-600 bg-gray-900 px-2 py-1 text-xs text-gray-200 placeholder:text-gray-500"
                />
                <button
                  onClick={handleImportSharedLife}
                  className="rounded border border-emerald-500 bg-emerald-600/20 px-2 py-1 text-xs text-emerald-100 hover:bg-emerald-600/35 whitespace-nowrap"
                >
                  Importer
                </button>
              </div>
            )}

            {shareFeedback && <p className="text-xs text-blue-200">{shareFeedback}</p>}
            {importFeedback && <p className="text-xs text-emerald-200">{importFeedback}</p>}
          </div>
        )}
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