import type { SharedLifePreview } from '../services/lifeSharingService';

type ImportPreviewModalProps = {
  preview: SharedLifePreview | null;
  onCancel: () => void;
  onConfirm: () => void;
  formatDateTime: (timestamp: number) => string;
};

const ImportPreviewModal = ({
  preview,
  onCancel,
  onConfirm,
  formatDateTime
}: ImportPreviewModalProps) => {
  if (!preview) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-white">Confirmer l import de la vie</h2>
        <p className="mt-1 text-sm text-gray-300">
          Verifiez les informations avant d ajouter cette simulation.
        </p>

        <div className="mt-4 space-y-2 rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm">
          <p className="text-gray-200">
            <span className="text-gray-400">Nom: </span>
            {preview.name}
          </p>
          <p className="text-gray-200">
            <span className="text-gray-400">Etapes: </span>
            {preview.stepsCount}
          </p>
          <p className="text-gray-200">
            <span className="text-gray-400">Partage le: </span>
            {formatDateTime(preview.exportedAt)}
          </p>
          <p className="text-gray-200">
            <span className="text-gray-400">Expiration: </span>
            {formatDateTime(preview.expiresAt)}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg border border-emerald-500 bg-emerald-600/20 px-3 py-1.5 text-sm text-emerald-100 hover:bg-emerald-600/35"
          >
            Confirmer l import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPreviewModal;
