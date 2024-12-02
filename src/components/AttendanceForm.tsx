import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const attendanceSchema = z.object({
  status: z.enum(['presente', 'ausente']),
  justification: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

type AttendanceFormProps = {
  onSubmit: (data: AttendanceFormData) => void;
};

export function AttendanceForm({ onSubmit }: AttendanceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
  });

  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Presença</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="presente">Presente</option>
          <option value="ausente">Ausente</option>
        </select>
      </div>

      {status === 'ausente' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Justificativa
          </label>
          <textarea
            {...register('justification')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Registrar Presença
      </button>
    </form>
  );
}