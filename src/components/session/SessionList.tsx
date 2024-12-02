import React from 'react';
import { Session } from '../../types';
import { SessionCard } from './SessionCard';

type SessionListProps = {
  sessions: Session[];
  onManageSession: (session: Session) => void;
  onStartSession: (sessionId: string) => void;
  onEndSession: (sessionId: string) => void;
};

export function SessionList({ 
  sessions, 
  onManageSession, 
  onStartSession, 
  onEndSession 
}: SessionListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onManage={() => onManageSession(session)}
            onStartSession={() => onStartSession(session.id)}
            onEndSession={() => onEndSession(session.id)}
          />
        ))}

        {sessions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Nenhuma sessão cadastrada
          </div>
        )}
      </div>
    </div>
  );
}