import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { SessionList } from '../components/SessionList';
import { SessionDetails } from '../components/SessionDetails';
import { VereadorProfile } from '../components/VereadorProfile';
import { LogOut } from 'lucide-react';
import { AttachmentFile } from '../components/attendance/AttendanceFileUpload';

// Mock data - Em produção, conectar com backend real
const mockSessions = [
  {
    id: '1',
    title: 'Sessão Ordinária 001/2024',
    date: new Date(),
    description: 'Primeira sessão ordinária do ano de 2024',
    status: 'em_andamento',
    documents: [
      { 
        id: '1', 
        title: 'Pauta da Sessão', 
        url: 'https://example.com/docs/pauta-001-2024.pdf'
      },
      { 
        id: '2', 
        title: 'Projeto de Lei 001/2024', 
        url: 'https://example.com/docs/pl-001-2024.pdf'
      }
    ],
    votingTopics: [
      {
        id: '1',
        title: 'Projeto de Lei 001/2024',
        description: 'Aprovação do orçamento municipal para 2024',
        votes: [],
        status: 'open',
      },
    ],
    attendance: [],
  },
];

export function VereadorDashboard() {
  const { user, logout } = useAuthStore();
  const [selectedSession, setSelectedSession] = React.useState<typeof mockSessions[0] | null>(null);

  const handleSelectSession = (session: typeof mockSessions[0]) => {
    setSelectedSession(session);
  };

  const handleAttendanceConfirm = (
    sessionId: string,
    status: 'presente' | 'ausente',
    data?: { justification?: string; attachments?: AttachmentFile[] }
  ) => {
    // Em produção, enviar para o backend
    const updatedSession = {
      ...mockSessions[0],
      attendance: [
        ...mockSessions[0].attendance,
        {
          id: Math.random().toString(),
          vereadorId: user?.id!,
          status,
          justification: data?.justification,
          attachments: data?.attachments,
          timestamp: new Date(),
        },
      ],
    };
    
    setSelectedSession(updatedSession);
    console.log('Presença registrada:', {
      sessionId,
      status,
      ...data,
      vereadorId: user?.id,
      timestamp: new Date(),
    });
    alert('Presença registrada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel do Vereador
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <VereadorProfile user={user!} />
            </div>

            <h2 className="text-xl font-semibold mb-4">Sessões</h2>
            {selectedSession ? (
              <SessionDetails
                session={selectedSession}
                onBack={() => setSelectedSession(null)}
              />
            ) : (
              <SessionList
                sessions={mockSessions}
                onSelectSession={handleSelectSession}
                onAttendanceConfirm={handleAttendanceConfirm}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}