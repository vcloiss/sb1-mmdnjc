import React from 'react';
import { User } from '../types';
import { VereadorForm } from './VereadorForm';
import { X } from 'lucide-react';

type VereadorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  vereador?: User;
};

export function VereadorModal({ isOpen, onClose, onSubmit, vereador }: VereadorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {vereador ? 'Editar Vereador' : 'Novo Vereador'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <VereadorForm
          onSubmit={onSubmit}
          initialData={vereador}
          isEditing={!!vereador}
        />
      </div>
    </div>
  );
}