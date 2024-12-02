import React from 'react';
import { User, Attendance } from '../../types';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AttendanceListProps = {
  attendance: Attendance[];
  vereadores: User[];
  onAddAbsence: (vereadorId: string) => void;
};

export function AttendanceList({ attendance, vereadores, onAddAbsence }: AttendanceListProps) {
  const getAttendanceIcon = (status: 'presente' | 'ausente') => {
    return status === 'presente' ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );
  };

  const getVereadorAttendance = (vereadorId: string) => {
    return attendance.find((a) => a.vereadorId === vereadorId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Presença
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle size={16} className="text-green-500" />
              Presentes: {attendance.filter((a) => a.status === 'presente').length}
            </div>
            <div className="flex items-center gap-1">
              <XCircle size={16} className="text-red-500" />
              Ausentes: {attendance.filter((a) => a.status === 'ausente').length}
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {vereadores.map((vereador) => {
            const attendanceRecord = getVereadorAttendance(vereador.id);

            return (
              <li key={vereador.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={vereador.profile?.foto}
                      alt={vereador.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vereador.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vereador.profile?.partido}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {attendanceRecord ? (
                      <div className="flex items-center gap-2">
                        {getAttendanceIcon(attendanceRecord.status)}
                        <span className="text-sm text-gray-500">
                          {format(new Date(attendanceRecord.timestamp), "HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                        {attendanceRecord.status === 'ausente' && (
                          <button
                            onClick={() => {
                              const url = attendanceRecord.attachments?.[0]?.url;
                              if (url) window.open(url, '_blank');
                            }}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            disabled={!attendanceRecord.attachments?.length}
                          >
                            <FileText size={16} />
                            Ver anexo
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow-500" size={20} />
                        <span className="text-sm text-yellow-600">Não registrado</span>
                        <button
                          onClick={() => onAddAbsence(vereador.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Registrar ausência
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {attendanceRecord?.status === 'ausente' && attendanceRecord.justification && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="font-medium">Justificativa:</p>
                    <p className="mt-1">{attendanceRecord.justification}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}