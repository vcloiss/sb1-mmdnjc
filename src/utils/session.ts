import { Session } from '../types';

export function canVereadorVote(session: Session, vereadorId: string): boolean {
  const attendance = session.attendance.find(
    (a) => a.vereadorId === vereadorId
  );
  
  return attendance?.status === 'presente';
}

export function getSessionStatus(session: Session): 'agendada' | 'em_andamento' | 'encerrada' {
  const now = new Date();
  const sessionDate = new Date(session.date);

  if (session.status === 'encerrada') return 'encerrada';
  if (sessionDate > now) return 'agendada';
  return 'em_andamento';
}