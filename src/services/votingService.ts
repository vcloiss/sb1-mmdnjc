import { db } from '../lib/db';
import { VotingAttachment } from '../types';

interface CreateVotingTopicData {
  sessionId: string;
  title: string;
  description: string;
  attachments?: VotingAttachment[];
}

export const votingService = {
  createVotingTopic: (data: CreateVotingTopicData) => {
    const { sessionId, title, description, attachments } = data;

    return db.transaction(() => {
      // Insert voting topic
      const result = db.prepare(`
        INSERT INTO voting_topics (id, title, description, status, session_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        Math.random().toString(36).substr(2, 9),
        title,
        description,
        'open',
        sessionId
      );

      const topicId = result.lastInsertRowid.toString();

      // Insert attachments if any
      if (attachments && attachments.length > 0) {
        const insertAttachment = db.prepare(`
          INSERT INTO voting_attachments (id, name, type, url, size, topic_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const attachment of attachments) {
          insertAttachment.run(
            Math.random().toString(36).substr(2, 9),
            attachment.name,
            attachment.type,
            attachment.url,
            attachment.size,
            topicId
          );
        }
      }

      return this.getVotingTopicById(topicId);
    })();
  },

  getVotingTopicById: (id: string) => {
    const topic = db.prepare(`
      SELECT vt.*, 
        json_group_array(DISTINCT json_object(
          'id', va.id,
          'name', va.name,
          'type', va.type,
          'url', va.url,
          'size', va.size,
          'uploadedAt', va.uploaded_at
        )) as attachments,
        json_group_array(DISTINCT json_object(
          'id', v.id,
          'vote', v.vote,
          'vereadorId', v.vereador_id,
          'confirmed', v.confirmed,
          'timestamp', v.timestamp
        )) as votes
      FROM voting_topics vt
      LEFT JOIN voting_attachments va ON va.topic_id = vt.id
      LEFT JOIN votes v ON v.topic_id = vt.id
      WHERE vt.id = ?
      GROUP BY vt.id
    `).get(id);

    if (!topic) return null;

    return {
      ...topic,
      attachments: JSON.parse(topic.attachments),
      votes: JSON.parse(topic.votes),
    };
  },

  registerVote: (topicId: string, vereadorId: string, vote: 'favor' | 'contra' | 'abstencao') => {
    return db.prepare(`
      INSERT INTO votes (id, vote, vereador_id, topic_id, confirmed)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      Math.random().toString(36).substr(2, 9),
      vote,
      vereadorId,
      topicId,
      true
    );
  },

  closeVotingTopic: (id: string) => {
    return db.prepare(`
      UPDATE voting_topics
      SET status = 'closed', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);
  },
};