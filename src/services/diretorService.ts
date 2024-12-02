import { db } from '../lib/db';

export interface CreateDiretorData {
  email: string;
  name: string;
  password: string;
}

export const diretorService = {
  createDiretor: (data: CreateDiretorData) => {
    const { email, name, password } = data;

    return db.prepare(`
      INSERT INTO users (id, email, name, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      Math.random().toString(36).substr(2, 9),
      email,
      name,
      password, // In production, hash the password
      'diretor'
    );
  },

  getDiretorById: (id: string) => {
    return db.prepare(`
      SELECT *
      FROM users
      WHERE id = ? AND role = 'diretor'
    `).get(id);
  },

  updateDiretor: (id: string, data: Partial<CreateDiretorData>) => {
    const updates = [];
    const params = [];

    if (data.email) {
      updates.push('email = ?');
      params.push(data.email);
    }
    if (data.name) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.password) {
      updates.push('password = ?');
      params.push(data.password); // In production, hash the password
    }

    if (updates.length === 0) return null;

    return db.prepare(`
      UPDATE users
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND role = 'diretor'
    `).run(...params, id);
  },

  getSessionStatistics: () => {
    return db.prepare(`
      SELECT
        COUNT(*) as total_sessions,
        SUM(CASE WHEN status = 'em_andamento' THEN 1 ELSE 0 END) as active_sessions,
        SUM(CASE WHEN status = 'encerrada' THEN 1 ELSE 0 END) as completed_sessions,
        (
          SELECT COUNT(*)
          FROM attendance
          WHERE status = 'presente'
        ) as total_attendances,
        (
          SELECT COUNT(*)
          FROM votes
          WHERE confirmed = 1
        ) as total_votes
      FROM sessions
    `).get();
  },

  getVereadorStatistics: () => {
    return db.prepare(`
      SELECT
        u.id,
        u.name,
        vp.partido,
        COUNT(DISTINCT a.id) as attendance_count,
        COUNT(DISTINCT v.id) as vote_count,
        (
          SELECT COUNT(*)
          FROM attendance a2
          WHERE a2.vereador_id = u.id AND a2.status = 'presente'
        ) as present_count,
        (
          SELECT COUNT(*)
          FROM attendance a2
          WHERE a2.vereador_id = u.id AND a2.status = 'ausente'
        ) as absent_count
      FROM users u
      LEFT JOIN vereador_profiles vp ON vp.user_id = u.id
      LEFT JOIN attendance a ON a.vereador_id = u.id
      LEFT JOIN votes v ON v.vereador_id = u.id
      WHERE u.role = 'vereador'
      GROUP BY u.id
    `).all();
  },
};