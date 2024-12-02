import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Session } from '../types';
import { Calendar, FileText, Vote } from 'lucide-react';
import { AttendanceConfirmationModal } from './attendance/AttendanceConfirmationModal';
import { getSessionStatus } from '../utils/session';
import { AttachmentFile } from './attendance/AttendanceFileUpload';

type SessionListProps = {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onAttendanceConfirm: (
    sessionId: string,
    status: 'presente' | 'ausente',
    data?: { justification?: string; attachments?: AttachmentFile[] }
  ) => void;
};

export function SessionList({ sessions, onSelectSession, onAttendanceConfirm }: SessionListProps) {
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  const handleSessionClick = (session: Session) => {
    const status = getSessionStatus(session);
    if (status === 'em_andamento') {
      setSelectedSession(session);
    } else {
      onSelectSession(session);
    }
  };

  const handleAttendanceConfirm = (
    status: 'presente' | 'ausente',
    data?: { justification?: string; attachments?: AttachmentFile[] }
  ) => {
    if (selectedSession) {
      onAttendanceConfirm(selectedSession.id, status, data);
      setSelectedSession(null);
      onSelectSession(selectedSession);
    }
  };

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleSessionClick(session)}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{session.title}</h3>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={16} />
              {format(new Date(session.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
          
          <p className="text-gray-600 mt-2">{session.description}</p>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FileText size={16} />
              {session.documents.length} documentos
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Vote size={16} />
              {session.votingTopics.length} votações
            </div>
            <div className={`text-sm ${
              getSessionStatus(session) === 'em_andamento' 
                ? 'text-green-600' 
                : getSessionStatus(session) === 'encerrada'
                ? 'text-red-600'
                : 'text-blue-600'
            }`}>
              {getSessionStatus(session) === 'em_andamento' && 'Em andamento'}
              {getSessionStatus(session) === 'encerrada' && 'Encerrada'}
              {getSessionStatus(session) === 'agendada' && 'Agendada'}
            </div>
          </div>
        </div>
      ))}

      <AttendanceConfirmationModal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        onConfirm={handleAttendanceConfirm}
        sessionTitle={selectedSession?.title || ''}
      />
    </div>
  );
}