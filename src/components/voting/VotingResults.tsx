import React from 'react';
import { Vote, User } from '../../types';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

type VotingResultsProps = {
  votes: Vote[];
  vereadores: User[];
};

export function VotingResults({ votes, vereadores }: VotingResultsProps) {
  const getVoteIcon = (vote: 'favor' | 'contra' | 'abstencao') => {
    switch (vote) {
      case 'favor':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'contra':
        return <XCircle className="text-red-500" size={20} />;
      case 'abstencao':
        return <MinusCircle className="text-gray-500" size={20} />;
    }
  };

  const totals = votes.reduce(
    (acc, vote) => {
      acc[vote.vote]++;
      return acc;
    },
    { favor: 0, contra: 0, abstencao: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-green-700">A Favor</span>
            <span className="text-2xl font-bold text-green-700">{totals.favor}</span>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-red-700">Contra</span>
            <span className="text-2xl font-bold text-red-700">{totals.contra}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Abstenções</span>
            <span className="text-2xl font-bold text-gray-700">{totals.abstencao}</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {votes.map((vote) => {
            const vereador = vereadores.find((v) => v.id === vote.vereadorId);
            if (!vereador) return null;

            return (
              <li key={vote.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={vereador.profile?.foto}
                    alt={vereador.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {vereador.name}
                  </span>
                </div>
                <div className="flex items-center">
                  {getVoteIcon(vote.vote)}
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(vote.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}