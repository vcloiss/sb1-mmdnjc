import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, VereadorProfile } from '../types';

const vereadorSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  partido: z.string().min(2, 'Partido é obrigatório'),
  cargo: z.string().min(2, 'Cargo é obrigatório'),
  historiaPolitica: z.string().min(10, 'História política deve ter no mínimo 10 caracteres'),
  foto: z.string().url('URL da foto inválida'),
});

type VereadorFormData = z.infer<typeof vereadorSchema>;

type VereadorFormProps = {
  onSubmit: (data: VereadorFormData) => void;
  initialData?: Partial<User & VereadorProfile>;
  isEditing?: boolean;
};

export function VereadorForm({ onSubmit, initialData, isEditing }: VereadorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VereadorFormData>({
    resolver: zodResolver(vereadorSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Partido</label>
          <input
            type="text"
            {...register('partido')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.partido && (
            <span className="text-sm text-red-500">{errors.partido.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            {...register('cargo')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.cargo && (
            <span className="text-sm text-red-500">{errors.cargo.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL da Foto</label>
          <input
            type="url"
            {...register('foto')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.foto && (
            <span className="text-sm text-red-500">{errors.foto.message}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">História Política</label>
        <textarea
          {...register('historiaPolitica')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.historiaPolitica && (
          <span className="text-sm text-red-500">{errors.historiaPolitica.message}</span>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar Vereador' : 'Cadastrar Vereador'}
        </button>
      </div>
    </form>
  );
}