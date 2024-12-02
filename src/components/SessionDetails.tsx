import React from 'react';
import { Session, User } from '../types';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { VotingForm } from './VotingForm';
import { useAuthStore } from '../store/useAuthStore';

type SessionDetailsProps = {
  session: Session;
  onBack: () => void;
};

export function SessionDetails({ session, onBack }: SessionDetailsProps) {
  const user = useAuthStore((state) => state.user) as User;
  const attendance = session.attendance.find(a => a.vereadorId === user.id);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar para lista de sessões
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{session.title}</h2>
        <p className="text-gray-600">{session.description}</p>
        
        {attendance && (
          <div className={`mt-4 p-4 rounded-lg ${
            attendance.status === 'presente' 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span className="font-medium">
                Status: {attendance.status === 'presente' ? 'Presente' : 'Ausente'}
              </span>
            </div>
            {attendance.status === 'ausente' && attendance.justification && (
              <div className="mt-2">
                <p className="font-medium">Justificativa:</p>
                <p className="mt-1">{attendance.justification}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Documentos da Sessão
          </h3>
          <div className="grid gap-4">
            {session.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="text-blue-600" size={24} />
                <div>
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-500">Clique para visualizar</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {session.status === 'em_andamento' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Votações</h3>
            {attendance?.status === 'ausente' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} />
                  <p>Você está marcado como ausente nesta sessão e não pode participar das votações.</p>
                </div>
              </div>
            ) : attendance?.status === 'presente' ? (
              session.votingTopics.map((topic) => (
                <VotingForm
                  key={topic.id}
                  topic={topic}
                  onVote={(vote) => {
                    console.log('Voto registrado:', {
                      vote,
                      timestamp: new Date(),
                      vereadorId: user.id,
                      topicId: topic.id,
                    });
                    alert('Voto registrado com sucesso!');
                  }}
                />
              ))
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}