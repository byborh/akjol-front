import StartingPoint from './components/StartingPoint';
import ExploreTimeline from './components/ExploreTimeline';
import AppHeader from './components/AppHeader';
import ImportPreviewModal from './components/ImportPreviewModal';
import LoginPanel from './components/LoginPanel';
import { FormationExplorer } from './components/FormationExplorer';
import { SHARE_DURATION_OPTIONS } from './constants/sharing';
import { getTestUsersHint } from './constants/auth';
import { useAkJolApp } from './hooks/useAkJolApp';
import { formatDateTime } from './utils/lifeSessionUtils';

const App = () => {
  const app = useAkJolApp();

  if (!app.isLoggedIn) {
    return (
      <LoginPanel
        email={app.email}
        password={app.password}
        onEmailChange={app.setEmail}
        onPasswordChange={app.setPassword}
        onSubmit={app.handleLogin}
        testUsersHint={getTestUsersHint()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] transition-colors duration-200">
      <AppHeader
        sessions={app.sessions}
        activeSessionId={app.activeSessionId}
        editingSessionId={app.editingSessionId}
        editingName={app.editingName}
        showImportPanel={app.showImportPanel}
        importValue={app.importValue}
        latestShareUrl={app.latestShareUrl}
        latestShareExpiresAt={app.latestShareExpiresAt}
        shareFeedback={app.shareFeedback}
        importFeedback={app.importFeedback}
        selectedShareTtlMs={app.selectedShareTtlMs}
        shareDurationOptions={SHARE_DURATION_OPTIONS}
        onSelectSession={app.setActiveSessionId}
        onStartRenameSession={app.handleStartRenameSession}
        onEditingNameChange={app.setEditingName}
        onCommitRenameSession={app.handleCommitRenameSession}
        onCancelRenameSession={app.handleCancelRenameSession}
        onDeleteSession={app.handleDeleteSession}
        onCreateNewLife={app.handleCreateNewLife}
        onChangeShareTtl={app.setSelectedShareTtlMs}
        onShareCurrentLife={app.handleShareCurrentLife}
        onToggleImportPanel={app.handleToggleImportPanel}
        onImportValueChange={app.setImportValue}
        onImportSharedLife={app.handleImportSharedLife}
        onCopyLatestShareUrl={app.handleCopyLatestShareUrl}
        onLogout={app.handleLogout}
        onOpenFormations={app.handleOpenFormations}
        formatDateTime={formatDateTime}
      />

      {app.view === 'home' && <StartingPoint onSelect={app.handleStartExplore} />}

      {app.view === 'explore' && app.activeSession?.startingNodeId && (
        <div className="relative">
          <ExploreTimeline
            key={app.activeSession.id}
            startingNodeId={app.activeSession.startingNodeId}
            initialPath={app.activeSession.path}
            onPathChange={app.handlePathChange}
            onShowFormationDetails={app.handleOpenFormations}
          />
          <button
            onClick={app.handleBackToHome}
            className="fixed top-6 left-6 z-50 px-4 py-2 bg-gray-700/80 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition"
          >
            Retour a l accueil
          </button>
        </div>
      )}

      {app.view === 'formations' && (
        <FormationExplorer 
          onClose={app.handleCloseFormations}
          selectedNodeId={app.selectedFormationNodeId}
        />
      )}

      <ImportPreviewModal
        preview={app.importPreview}
        onCancel={app.handleCancelImport}
        onConfirm={app.handleConfirmImport}
        formatDateTime={formatDateTime}
      />
    </div>
  );
};

export default App;
