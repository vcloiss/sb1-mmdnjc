import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Plus, Users, FileText, Vote } from 'lucide-react';
import { VereadorList } from '../components/VereadorList';
import { VereadorModal } from '../components/VereadorModal';
import { SessionManagement } from '../components/session/SessionManagement';
import { User } from '../types';

// Mock data - Em produção, conectar com backend real
const mockVereadores: (User & { profile: NonNullable<User['profile']> })[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    role: 'vereador',
    profile: {
      id: '1',
      partido: 'PDB',
      cargo: 'Vereador',
      historiaPolitica: 'Vereador em segundo mandato, com foco em políticas ambientais.',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
];

export function DiretorDashboard() {
  const { user, logout } = useAuthStore();
  const [showVereadorModal, setShowVereadorModal] = React.useState(false);
  const [selectedVereador, setSelectedVereador] = React.useState<User | undefined>();
  const [activeTab, setActiveTab] = React.useState<'vereadores' | 'sessoes' | 'votacoes'>('vereadores');

  const handleVereadorSubmit = (data: any) => {
    console.log('Vereador salvo:', data);
    setShowVereadorModal(false);
    setSelectedVereador(undefined);
  };

  const handleEditVereador = (vereador: User) => {
    setSelectedVereador(vereador);
    setShowVereadorModal(true);
  };

  const handleDeleteVereador = (vereadorId: string) => {
    if (confirm('Tem certeza que deseja excluir este vereador?')) {
      console.log('Vereador excluído:', vereadorId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel do Diretor
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Olá, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('vereadores')}
              className={`px-3 py-2 rounded-md ${
                activeTab === 'vereadores'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="inline-block mr-2" size={20} />
              Vereadores
            </button>
            <button
              onClick={() => setActiveTab('sessoes')}
              className={`px-3 py-2 rounded-md ${
                activeTab === 'sessoes'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="inline-block mr-2" size={20} />
              Sessões
            </button>
            <button
              onClick={() => setActiveTab('votacoes')}
              className={`px-3 py-2 rounded-md ${
                activeTab === 'votacoes'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Vote className="inline-block mr-2" size={20} />
              Votações
            </button>
          </nav>
        </div>

        {activeTab === 'vereadores' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Lista de Vereadores</h2>
              <button
                onClick={() => {
                  setSelectedVereador(undefined);
                  setShowVereadorModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} />
                Novo Vereador
              </button>
            </div>

            <VereadorList
              vereadores={mockVereadores}
              onEdit={handleEditVereador}
              onDelete={handleDeleteVereador}
            />
          </div>
        )}

        {activeTab === 'sessoes' && (
          <SessionManagement />
        )}

        {activeTab === 'votacoes' && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Gerenciamento de votações em desenvolvimento...</p>
          </div>
        )}
      </main>

      <VereadorModal
        isOpen={showVereadorModal}
        onClose={() => {
          setShowVereadorModal(false);
          setSelectedVereador(undefined);
        }}
        onSubmit={handleVereadorSubmit}
        vereador={selectedVereador}
      />
    </div>
  );
}