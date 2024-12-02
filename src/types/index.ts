export type User = {
  id: string;
  name: string;
  email: string;
  role: 'vereador' | 'diretor';
  profile?: VereadorProfile;
};

export type VereadorProfile = {
  id: string;
  partido: string;
  cargo: string;
  historiaPolitica: string;
  foto: string;
};

export type Session = {
  id: string;
  title: string;
  date: Date;
  description: string;
  documents: Document[];
  votingTopics: VotingTopic[];
  attendance: Attendance[];
  status: 'agendada' | 'em_andamento' | 'encerrada';
};

export type Document = {
  id: string;
  title: string;
  url: string;
};

export type VotingTopic = {
  id: string;
  title: string;
  description: string;
  votes: Vote[];
  status: 'open' | 'closed';
  attachments: VotingAttachment[];
};

export type VotingAttachment = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
};

export type Vote = {
  id: string;
  vereadorId: string;
  vote: 'favor' | 'contra' | 'abstencao';
  timestamp: Date;
  confirmed: boolean;
};

export type Attendance = {
  id: string;
  vereadorId: string;
  status: 'presente' | 'ausente';
  justification?: string;
  attachments?: AttachmentFile[];
  timestamp: Date;
};

export type AttachmentFile = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
};