import React from 'react';
import { Plus, Play, Clock, CheckCircle2, FileText, Vote } from 'lucide-react';
import { SessionForm } from './SessionForm';
import { Session, User } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getSessionStatus } from '../../utils/session';
import { SessionDetailsModal } from './SessionDetailsModal';

// Mock vereadores data - In production, this would come from an API
const mockVereadores: User[] = [
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
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    role: 'vereador',
    profile: {
      id: '2',
      partido: 'PDC',
      cargo: 'Vereadora',
      historiaPolitica: 'Primeira legislatura, com foco em educação.',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
];

export function SessionManagement() {
  const [showNewSessionForm, setShowNewSessionForm] = React.useState(false);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  const handleCreateSession = (data: any) => {
    const newSession: Session = {
      id: Math.random().toString(),
      title: data.title,
      description: data.description,
      date: new Date(`${data.date}T${data.time}`),
      documents: data.documents || [],
      votingTopics: [],
      attendance: [],
      status: 'agendada',
    };

    setSessions([...sessions, newSession]);
    setShowNewSessionForm(false);
  };

  const handleStartSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'em_andamento' as const }
        : session
    ));
  };

  const handleEndSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'encerrada' as const }
        : session
    ));
  };

  const handleUpdateSession = (updatedSession: Session) => {
    setSessions(sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const getStatusBadge = (session: Session) => {
    const status = getSessionStatus(session);
    switch (status) {
      case 'agendada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" />
            Agendada
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Play size={12} className="mr-1" />
            Em andamento
          </span>
        );
      case 'encerrada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle2 size={12} className="mr-1" />
            Encerrada
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciamento de Sessões</h2>
        <button
          onClick={() => setShowNewSessionForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Nova Sessão
        </button>
      </div>

      {showNewSessionForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Nova Sessão</h3>
            <button
              onClick={() => setShowNewSessionForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
          <SessionForm onSubmit={handleCreateSession} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <div key={session.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{session.description}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {format(new Date(session.date), "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                      {getStatusBadge(session)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSessionStatus(session) === 'em_andamento' && (
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FileText size={16} />
                        Gerenciar
                      </button>
                    )}
                    {getSessionStatus(session) === 'agendada' && (
                      <button
                        onClick={() => handleStartSession(session.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Abrir Sessão
                      </button>
                    )}
                    {getSessionStatus(session) === 'em_andamento' && (
                      <button
                        onClick={() => handleEndSession(session.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Encerrar Sessão
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText size={16} />
                    {session.documents.length} documentos
                  </div>
                  <div className="flex items-center gap-1">
                    <Vote size={16} />
                    {session.votingTopics.length} votações
                  </div>
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Nenhuma sessão cadastrada
              </div>
            )}
          </div>
        </div>
      )}

      <SessionDetailsModal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
        onUpdate={handleUpdateSession}
        vereadores={mockVereadores}
      />
    </div>
  );
}