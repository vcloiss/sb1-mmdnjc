import React from 'react';
import { Plus } from 'lucide-react';

type SessionHeaderProps = {
  onNewSession: () => void;
};

export function SessionHeader({ onNewSession }: SessionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Gerenciamento de Sessões</h2>
      <button
        onClick={onNewSession}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus size={20} />
        Nova Sessão
      </button>
    </div>
  );
}