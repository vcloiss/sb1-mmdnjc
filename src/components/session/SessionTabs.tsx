import React from 'react';
import { FileText, Vote, Users } from 'lucide-react';

type Tab = 'documents' | 'voting' | 'attendance';

type SessionTabsProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function SessionTabs({ activeTab, onTabChange }: SessionTabsProps) {
  return (
    <nav className="flex space-x-4 mb-6">
      <button
        onClick={() => onTabChange('documents')}
        className={`px-3 py-2 rounded-md flex items-center gap-2 ${
          activeTab === 'documents'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FileText size={20} />
        Documentos
      </button>
      <button
        onClick={() => onTabChange('voting')}
        className={`px-3 py-2 rounded-md flex items-center gap-2 ${
          activeTab === 'voting'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Vote size={20} />
        Votações
      </button>
      <button
        onClick={() => onTabChange('attendance')}
        className={`px-3 py-2 rounded-md flex items-center gap-2 ${
          activeTab === 'attendance'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Users size={20} />
        Presenças
      </button>
    </nav>
  );
}