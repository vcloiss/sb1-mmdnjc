import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VotingAttachments } from './VotingAttachments';
import { VotingAttachment } from '../../types';

const votingTopicSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
});

type VotingTopicFormData = z.infer<typeof votingTopicSchema>;

type VotingTopicFormProps = {
  onSubmit: (data: VotingTopicFormData & { attachments: VotingAttachment[] }) => void;
  sessionId: string;
};

export function VotingTopicForm({ onSubmit, sessionId }: VotingTopicFormProps) {
  const [attachments, setAttachments] = React.useState<VotingAttachment[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VotingTopicFormData>({
    resolver: zodResolver(votingTopicSchema),
  });

  const handleFormSubmit = (data: VotingTopicFormData) => {
    onSubmit({ ...data, sessionId, attachments });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título da Votação</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <span className="text-sm text-red-500">{errors.title.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <span className="text-sm text-red-500">{errors.description.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Anexos</label>
        <VotingAttachments
          attachments={attachments}
          onAttachmentsChange={setAttachments}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Criar Votação
        </button>
      </div>
    </form>
  );
}