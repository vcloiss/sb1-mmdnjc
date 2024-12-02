import React from 'react';
import { VotingTopic } from '../types';
import { VotingConfirmationModal } from './VotingConfirmationModal';

type VotingFormProps = {
  topic: VotingTopic;
  onVote: (vote: 'favor' | 'contra' | 'abstencao') => void;
};

export function VotingForm({ topic, onVote }: VotingFormProps) {
  const [selectedVote, setSelectedVote] = React.useState<'favor' | 'contra' | 'abstencao' | null>(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleVoteClick = (vote: 'favor' | 'contra' | 'abstencao') => {
    setSelectedVote(vote);
    setShowConfirmation(true);
  };

  const handleConfirmVote = () => {
    if (selectedVote) {
      onVote(selectedVote);
      setShowConfirmation(false);
      setSelectedVote(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{topic.title}</h3>
      <p className="text-gray-600 mb-6">{topic.description}</p>

      <div className="flex gap-4">
        <button
          onClick={() => handleVoteClick('favor')}
          className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          A Favor
        </button>
        <button
          onClick={() => handleVoteClick('contra')}
          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Contra
        </button>
        <button
          onClick={() => handleVoteClick('abstencao')}
          className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Abstenção
        </button>
      </div>

      <VotingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmVote}
        vote={selectedVote!}
        topic={topic.title}
      />
    </div>
  );
}