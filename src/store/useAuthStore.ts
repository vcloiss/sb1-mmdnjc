import { create } from 'zustand';
import { User } from '../types';

type AuthStore = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    // Simulação de API - Em produção, conectar com backend real
    if (email === 'diretor@example.com' && password === '123456') {
      set({
        user: {
          id: '1',
          name: 'Diretor',
          email: 'diretor@example.com',
          role: 'diretor',
        },
      });
    } else if (email === 'vereador@example.com' && password === '123456') {
      set({
        user: {
          id: '2',
          name: 'Vereador',
          email: 'vereador@example.com',
          role: 'vereador',
        },
      });
    } else {
      throw new Error('Credenciais inválidas');
    }
  },
  logout: () => set({ user: null }),
}));