import React from 'react';
import { X, Plus, FileText, Vote, Users } from 'lucide-react';
import { Session, User } from '../../types';
import { FileUpload } from './FileUpload';
import { VotingTopicForm } from '../voting/VotingTopicForm';
import { AttendanceList } from './AttendanceList';
import { AbsenceRegistrationModal } from './AbsenceRegistrationModal';
import { AttachmentFile } from '../attendance/AttendanceFileUpload';

type SessionDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onUpdate: (session: Session) => void;
  vereadores: User[];
};

export function SessionDetailsModal({
  isOpen,
  onClose,
  session,
  onUpdate,
  vereadores,
}: SessionDetailsModalProps) {
  const [activeTab, setActiveTab] = React.useState<'documents' | 'voting' | 'attendance'>('documents');
  const [showVotingForm, setShowVotingForm] = React.useState(false);
  const [selectedVereador, setSelectedVereador] = React.useState<User | null>(null);

  if (!isOpen || !session) return null;

  const handleAddDocuments = (newDocuments: Array<{ id: string; title: string; url: string }>) => {
    onUpdate({
      ...session,
      documents: [...session.documents, ...newDocuments],
    });
  };

  const handleRemoveDocument = (documentId: string) => {
    onUpdate({
      ...session,
      documents: session.documents.filter((doc) => doc.id !== documentId),
    });
  };

  const handleAddVotingTopic = (data: { title: string; description: string }) => {
    const newTopic = {
      id: Math.random().toString(),
      title: data.title,
      description: data.description,
      votes: [],
      status: 'open' as const,
    };

    onUpdate({
      ...session,
      votingTopics: [...session.votingTopics, newTopic],
    });
    setShowVotingForm(false);
  };

  const handleAddAbsence = (vereadorId: string) => {
    const vereador = vereadores.find(v => v.id === vereadorId);
    if (vereador) {
      setSelectedVereador(vereador);
    }
  };

  const handleAbsenceConfirm = (data: { justification: string; attachments?: AttachmentFile[] }) => {
    if (!selectedVereador) return;

    const newAttendance = {
      id: Math.random().toString(),
      vereadorId: selectedVereador.id,
      status: 'ausente' as const,
      justification: data.justification,
      attachments: data.attachments,
      timestamp: new Date(),
    };

    onUpdate({
      ...session,
      attendance: [...session.attendance, newAttendance],
    });

    setSelectedVereador(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gerenciar Sessão</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('documents')}
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
              onClick={() => setActiveTab('voting')}
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
              onClick={() => setActiveTab('attendance')}
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
        </div>

        {activeTab === 'documents' && (
          <div>
            <FileUpload onFileUpload={handleAddDocuments} />
            
            {session.documents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Documentos da Sessão</h3>
                <ul className="divide-y divide-gray-200 border rounded-md">
                  {session.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <FileText className="text-blue-500 mr-3" size={20} />
                        <span>{doc.title}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'voting' && (
          <div>
            {!showVotingForm ? (
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Votações da Sessão</h3>
                <button
                  onClick={() => setShowVotingForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Nova Votação
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Nova Votação</h3>
                  <button
                    onClick={() => setShowVotingForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
                <VotingTopicForm
                  onSubmit={handleAddVotingTopic}
                  sessionId={session.id}
                />
              </div>
            )}

            {session.votingTopics.length > 0 && !showVotingForm && (
              <ul className="divide-y divide-gray-200 border rounded-md">
                {session.votingTopics.map((topic) => (
                  <li key={topic.id} className="p-4">
                    <h4 className="font-medium">{topic.title}</h4>
                    <p className="text-gray-500 mt-1">{topic.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {topic.votes.length} votos registrados
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <AttendanceList
            attendance={session.attendance}
            vereadores={vereadores}
            onAddAbsence={handleAddAbsence}
          />
        )}
      </div>

      <AbsenceRegistrationModal
        isOpen={!!selectedVereador}
        onClose={() => setSelectedVereador(null)}
        onConfirm={handleAbsenceConfirm}
        vereadorName={selectedVereador?.name || ''}
      />
    </div>
  );
}