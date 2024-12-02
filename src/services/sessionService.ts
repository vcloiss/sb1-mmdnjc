import { db } from '../lib/db';

export interface CreateSessionData {
  title: string;
  description: string;
  date: Date;
  creatorId: string;
  documents?: Array<{ title: string; url: string }>;
}

export const sessionService = {
  createSession: (data: CreateSessionData) => {
    const { title, description, date, creatorId, documents } = data;

    const session = db.transaction(() => {
      // Insert session
      const result = db.prepare(`
        INSERT INTO sessions (id, title, description, date, status, creator_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        Math.random().toString(36).substr(2, 9),
        title,
        description,
        date.toISOString(),
        'agendada',
        creatorId
      );

      const sessionId = result.lastInsertRowid.toString();

      // Insert documents if any
      if (documents && documents.length > 0) {
        const insertDoc = db.prepare(`
          INSERT INTO documents (id, title, url, session_id)
          VALUES (?, ?, ?, ?)
        `);

        for (const doc of documents) {
          insertDoc.run(
            Math.random().toString(36).substr(2, 9),
            doc.title,
            doc.url,
            sessionId
          );
        }
      }

      return this.getSessionById(sessionId);
    })();

    return session;
  },

  getSessionById: (id: string) => {
    const session = db.prepare(`
      SELECT s.*, json_group_array(
        json_object(
          'id', d.id,
          'title', d.title,
          'url', d.url
        )
      ) as documents
      FROM sessions s
      LEFT JOIN documents d ON d.session_id = s.id
      WHERE s.id = ?
      GROUP BY s.id
    `).get(id);

    if (!session) return null;

    return {
      ...session,
      documents: JSON.parse(session.documents),
      date: new Date(session.date),
    };
  },

  getAllSessions: () => {
    return db.prepare(`
      SELECT s.*, 
        json_group_array(DISTINCT json_object(
          'id', d.id,
          'title', d.title,
          'url', d.url
        )) as documents,
        json_group_array(DISTINCT json_object(
          'id', vt.id,
          'title', vt.title,
          'description', vt.description,
          'status', vt.status
        )) as voting_topics,
        json_group_array(DISTINCT json_object(
          'id', a.id,
          'status', a.status,
          'vereadorId', a.vereador_id,
          'justification', a.justification,
          'timestamp', a.timestamp
        )) as attendance
      FROM sessions s
      LEFT JOIN documents d ON d.session_id = s.id
      LEFT JOIN voting_topics vt ON vt.session_id = s.id
      LEFT JOIN attendance a ON a.session_id = s.id
      GROUP BY s.id
      ORDER BY s.date DESC
    `).all().map(session => ({
      ...session,
      documents: JSON.parse(session.documents),
      votingTopics: JSON.parse(session.voting_topics),
      attendance: JSON.parse(session.attendance),
      date: new Date(session.date),
    }));
  },

  updateSessionStatus: (id: string, status: 'agendada' | 'em_andamento' | 'encerrada') => {
    return db.prepare(`
      UPDATE sessions
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, id);
  },

  addDocument: (sessionId: string, document: { title: string; url: string }) => {
    return db.prepare(`
      INSERT INTO documents (id, title, url, session_id)
      VALUES (?, ?, ?, ?)
    `).run(
      Math.random().toString(36).substr(2, 9),
      document.title,
      document.url,
      sessionId
    );
  },

  removeDocument: (documentId: string) => {
    return db.prepare(`
      DELETE FROM documents
      WHERE id = ?
    `).run(documentId);
  },
};