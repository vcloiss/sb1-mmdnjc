import React from 'react';
import { X } from 'lucide-react';
import { AttendanceFileUpload, AttachmentFile } from '../attendance/AttendanceFileUpload';

type AbsenceRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { justification: string; attachments?: AttachmentFile[] }) => void;
  vereadorName: string;
};

export function AbsenceRegistrationModal({
  isOpen,
  onClose,
  onConfirm,
  vereadorName,
}: AbsenceRegistrationModalProps) {
  const [justification, setJustification] = React.useState('');
  const [attachments, setAttachments] = React.useState<AttachmentFile[]>([]);

  const handleConfirm = () => {
    onConfirm({
      justification,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    setJustification('');
    setAttachments([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Registrar Ausência</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Registrando ausência para: <strong>{vereadorName}</strong>
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificativa
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Digite a justificativa da ausência..."
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

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!justification.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}