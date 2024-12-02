import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type VotingConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vote: 'favor' | 'contra' | 'abstencao';
  topic: string;
};

export function VotingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  vote,
  topic,
}: VotingConfirmationModalProps) {
  if (!isOpen) return null;

  const voteLabels = {
    favor: 'A FAVOR',
    contra: 'CONTRA',
    abstencao: 'ABSTENÇÃO',
  };

  const currentTime = format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Confirmar Voto</h3>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Você está votando <strong>{voteLabels[vote]}</strong> para:
          </p>
          <p className="font-medium">{topic}</p>
          
          <div className="text-sm text-gray-500">
            Data e hora: {currentTime}
          </div>
          
          <div className="text-sm text-gray-500">
            Atenção: Após confirmar, seu voto não poderá ser alterado.
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirmar Voto
          </button>
        </div>
      </div>
    </div>
  );
}