import React from 'react';
import { X } from 'lucide-react';
import { AttendanceFileUpload, AttachmentFile } from './AttendanceFileUpload';

type AttendanceConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    status: 'presente' | 'ausente',
    data?: { justification?: string; attachments?: AttachmentFile[] }
  ) => void;
  sessionTitle: string;
};

export function AttendanceConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  sessionTitle,
}: AttendanceConfirmationModalProps) {
  const [status, setStatus] = React.useState<'presente' | 'ausente'>('presente');
  const [justification, setJustification] = React.useState('');
  const [attachments, setAttachments] = React.useState<AttachmentFile[]>([]);

  const handleConfirm = () => {
    if (status === 'presente') {
      onConfirm(status);
    } else {
      onConfirm(status, {
        justification,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Confirmar Presença</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Confirme sua presença para a sessão:
          <br />
          <strong>{sessionTitle}</strong>
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setStatus('presente')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                status === 'presente'
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Presente
            </button>
            <button
              onClick={() => setStatus('ausente')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                status === 'ausente'
                  ? 'bg-red-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Ausente
            </button>
          </div>

          {status === 'ausente' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justificativa
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Digite sua justificativa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexos
                </label>
                <AttendanceFileUpload
                  files={attachments}
                  onFilesChange={setAttachments}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}