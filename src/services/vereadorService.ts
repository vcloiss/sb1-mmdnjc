import { db } from '../lib/db';
import { User, VereadorProfile } from '../types';

export interface CreateVereadorData {
  email: string;
  name: string;
  password: string;
  partido: string;
  cargo: string;
  historiaPolitica: string;
  foto: string;
}

export const vereadorService = {
  createVereador: (data: CreateVereadorData) => {
    const { email, name, password, partido, cargo, historiaPolitica, foto } = data;

    return db.transaction(() => {
      // Insert user
      const userResult = db.prepare(`
        INSERT INTO users (id, email, name, password, role)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        Math.random().toString(36).substr(2, 9),
        email,
        name,
        password, // In production, hash the password
        'vereador'
      );

      const userId = userResult.lastInsertRowid.toString();

      // Insert vereador profile
      db.prepare(`
        INSERT INTO vereador_profiles (id, partido, cargo, historia_politica, foto, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        Math.random().toString(36).substr(2, 9),
        partido,
        cargo,
        historiaPolitica,
        foto,
        userId
      );

      return this.getVereadorById(userId);
    })();
  },

  getVereadorById: (id: string): (User & { profile: VereadorProfile }) | null => {
    const user = db.prepare(`
      SELECT u.*, 
        json_object(
          'id', vp.id,
          'partido', vp.partido,
          'cargo', vp.cargo,
          'historiaPolitica', vp.historia_politica,
          'foto', vp.foto
        ) as profile
      FROM users u
      LEFT JOIN vereador_profiles vp ON vp.user_id = u.id
      WHERE u.id = ? AND u.role = 'vereador'
    `).get(id);

    if (!user) return null;

    return {
      ...user,
      profile: JSON.parse(user.profile),
    };
  },

  getAllVereadores: () => {
    return db.prepare(`
      SELECT u.*, 
        json_object(
          'id', vp.id,
          'partido', vp.partido,
          'cargo', vp.cargo,
          'historiaPolitica', vp.historia_politica,
          'foto', vp.foto
        ) as profile
      FROM users u
      LEFT JOIN vereador_profiles vp ON vp.user_id = u.id
      WHERE u.role = 'vereador'
    `).all().map(user => ({
      ...user,
      profile: JSON.parse(user.profile),
    }));
  },

  updateVereador: (id: string, data: Partial<CreateVereadorData>) => {
    return db.transaction(() => {
      if (data.email || data.name || data.password) {
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

        if (updates.length > 0) {
          db.prepare(`
            UPDATE users
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(...params, id);
        }
      }

      if (data.partido || data.cargo || data.historiaPolitica || data.foto) {
        const updates = [];
        const params = [];

        if (data.partido) {
          updates.push('partido = ?');
          params.push(data.partido);
        }
        if (data.cargo) {
          updates.push('cargo = ?');
          params.push(data.cargo);
        }
        if (data.historiaPolitica) {
          updates.push('historia_politica = ?');
          params.push(data.historiaPolitica);
        }
        if (data.foto) {
          updates.push('foto = ?');
          params.push(data.foto);
        }

        if (updates.length > 0) {
          db.prepare(`
            UPDATE vereador_profiles
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
          `).run(...params, id);
        }
      }

      return this.getVereadorById(id);
    })();
  },

  deleteVereador: (id: string) => {
    return db.prepare(`
      DELETE FROM users
      WHERE id = ? AND role = 'vereador'
    `).run(id);
  },

  getVereadorVotingHistory: (id: string) => {
    return db.prepare(`
      SELECT 
        v.id,
        v.vote,
        v.timestamp,
        vt.title as topic_title,
        vt.description as topic_description,
        s.title as session_title,
        s.date as session_date
      FROM votes v
      JOIN voting_topics vt ON v.topic_id = vt.id
      JOIN sessions s ON vt.session_id = s.id
      WHERE v.vereador_id = ?
      ORDER BY v.timestamp DESC
    `).all(id);
  },

  getVereadorAttendanceHistory: (id: string) => {
    return db.prepare(`
      SELECT 
        a.*,
        s.title as session_title,
        s.date as session_date,
        json_group_array(
          json_object(
            'id', aa.id,
            'name', aa.name,
            'type', aa.type,
            'url', aa.url,
            'size', aa.size
          )
        ) as attachments
      FROM attendance a
      JOIN sessions s ON a.session_id = s.id
      LEFT JOIN attendance_attachments aa ON aa.attendance_id = a.id
      WHERE a.vereador_id = ?
      GROUP BY a.id
      ORDER BY a.timestamp DESC
    `).all(id).map(record => ({
      ...record,
      attachments: JSON.parse(record.attachments),
    }));
  },
};