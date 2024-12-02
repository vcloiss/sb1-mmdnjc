import React from 'react';
import { User } from '../types';
import { UserCircle, Building2, Award, History } from 'lucide-react';

type VereadorProfileProps = {
  user: User;
};

export function VereadorProfile({ user }: VereadorProfileProps) {
  if (!user.profile) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-6">
        <img
          src={user.profile.foto}
          alt={user.name}
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 size={20} />
              <span>Partido: {user.profile.partido}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Award size={20} />
              <span>Cargo: {user.profile.cargo}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History size={20} />
          História Política
        </h3>
        <p className="mt-2 text-gray-600">{user.profile.historiaPolitica}</p>
      </div>
    </div>
  );
}