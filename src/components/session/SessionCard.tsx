import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Vote, Clock, Play, CheckCircle2 } from 'lucide-react';
import { Session } from '../../types';
import { getSessionStatus } from '../../utils/session';

type SessionCardProps = {
  session: Session;
  onManage: () => void;
  onStartSession: () => void;
  onEndSession: () => void;
};

export function SessionCard({ session, onManage, onStartSession, onEndSession }: SessionCardProps) {
  const status = getSessionStatus(session);

  const getStatusBadge = () => {
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
    <div className="p-6 border-b border-gray-200 last:border-b-0">
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
            {getStatusBadge()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'em_andamento' && (
            <button
              onClick={onManage}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FileText size={16} />
              Gerenciar
            </button>
          )}
          {status === 'agendada' && (
            <button
              onClick={onStartSession}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Abrir Sessão
            </button>
          )}
          {status === 'em_andamento' && (
            <button
              onClick={onEndSession}
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
  );
}