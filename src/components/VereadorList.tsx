import React from 'react';
import { User } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

type VereadorListProps = {
  vereadores: (User & { profile: NonNullable<User['profile']> })[];
  onEdit: (vereador: User) => void;
  onDelete: (vereadorId: string) => void;
};

export function VereadorList({ vereadores, onEdit, onDelete }: VereadorListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {vereadores.map((vereador) => (
          <li key={vereador.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={vereador.profile.foto}
                    alt={vereador.name}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{vereador.name}</div>
                    <div className="text-sm text-gray-500">{vereador.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onEdit(vereador)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(vereador.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Partido:</span> {vereador.profile.partido}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Cargo:</span> {vereador.profile.cargo}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}