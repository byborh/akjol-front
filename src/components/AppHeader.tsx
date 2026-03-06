import type { LifeSession } from '../types';
import type { ShareDurationOption } from '../constants/sharing';

type AppHeaderProps = {
  sessions: LifeSession[];
  activeSessionId: string | null;
  editingSessionId: string | null;
  editingName: string;
  showImportPanel: boolean;
  importValue: string;
  latestShareUrl: string;
  latestShareExpiresAt: number | null;
  shareFeedback: string;
  importFeedback: string;
  selectedShareTtlMs: number;
  shareDurationOptions: ShareDurationOption[];
  onSelectSession: (id: string) => void;
  onStartRenameSession: (session: LifeSession) => void;
  onEditingNameChange: (value: string) => void;
  onCommitRenameSession: (id: string) => void;
  onCancelRenameSession: () => void;
  onDeleteSession: (id: string) => void;
  onCreateNewLife: () => void;
  onChangeShareTtl: (ttlMs: number) => void;
  onShareCurrentLife: () => void;
  onToggleImportPanel: () => void;
  onImportValueChange: (value: string) => void;
  onImportSharedLife: () => void;
  onCopyLatestShareUrl: () => void;
  onLogout: () => void;
  onOpenFormations: () => void;
  formatDateTime: (timestamp: number) => string;
};

const AppHeader = ({
  sessions,
  activeSessionId,
  editingSessionId,
  editingName,
  showImportPanel,
  importValue,
  latestShareUrl,
  latestShareExpiresAt,
  shareFeedback,
  importFeedback,
  selectedShareTtlMs,
  shareDurationOptions,
  onSelectSession,
  onStartRenameSession,
  onEditingNameChange,
  onCommitRenameSession,
  onCancelRenameSession,
  onDeleteSession,
  onCreateNewLife,
  onChangeShareTtl,
  onShareCurrentLife,
  onToggleImportPanel,
  onImportValueChange,
  onImportSharedLife,
  onCopyLatestShareUrl,
  onLogout,
  onOpenFormations,
  formatDateTime
}: AppHeaderProps) => {
  return (
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
                    onChange={(event) => onEditingNameChange(event.target.value)}
                    onBlur={() => onCommitRenameSession(session.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') onCommitRenameSession(session.id);
                      if (event.key === 'Escape') onCancelRenameSession();
                    }}
                    className="w-28 rounded bg-gray-900 border border-gray-600 px-2 py-1 text-xs text-white focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => onSelectSession(session.id)}
                    onDoubleClick={() => onStartRenameSession(session)}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {session.name}
                  </button>
                )}

                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="text-xs text-gray-400 hover:text-red-400"
                  aria-label={`Supprimer ${session.name}`}
                >
                  x
                </button>
              </div>
            );
          })}

          <button
            onClick={onCreateNewLife}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 whitespace-nowrap"
          >
            + Nouvelle Vie
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Duree d expiration du lien de partage"
            value={selectedShareTtlMs}
            onChange={(event) => onChangeShareTtl(Number(event.target.value))}
            className="rounded-lg border border-gray-600 bg-gray-800 px-2 py-1.5 text-xs text-gray-200 focus:outline-none"
          >
            {shareDurationOptions.map((option) => (
              <option key={option.ttlMs} value={option.ttlMs}>
                Expire dans {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={onShareCurrentLife}
            className="rounded-lg border border-blue-600 bg-blue-600/20 px-3 py-1.5 text-sm text-blue-100 hover:bg-blue-600/35 whitespace-nowrap transition"
          >
            Partager cette vie
          </button>

          <button
            onClick={onToggleImportPanel}
            className="rounded-lg border border-emerald-600 bg-emerald-600/20 px-3 py-1.5 text-sm text-emerald-100 hover:bg-emerald-600/35 whitespace-nowrap transition"
          >
            Recuperer une vie
          </button>

          <button
            onClick={onOpenFormations}
            className="rounded-lg border border-amber-600 bg-amber-600/20 px-3 py-1.5 text-sm text-amber-100 hover:bg-amber-600/35 whitespace-nowrap transition"
          >
            📚 Formations
          </button>

          <button
            onClick={onLogout}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-red-700/50 hover:border-red-600 whitespace-nowrap transition"
          >
            Deconnexion
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
                onClick={onCopyLatestShareUrl}
                className="rounded border border-gray-500 bg-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-600 whitespace-nowrap"
              >
                Copier le lien
              </button>
            </div>
          )}

          {latestShareExpiresAt && (
            <p className="text-xs text-blue-300">
              Ce lien expire le {formatDateTime(latestShareExpiresAt)}.
            </p>
          )}

          {showImportPanel && (
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <input
                value={importValue}
                onChange={(event) => onImportValueChange(event.target.value)}
                placeholder="Collez le lien ou le token de partage"
                className="w-full rounded border border-gray-600 bg-gray-900 px-2 py-1 text-xs text-gray-200 placeholder:text-gray-500"
              />
              <button
                onClick={onImportSharedLife}
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
  );
};

export default AppHeader;
