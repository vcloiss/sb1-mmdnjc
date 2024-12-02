import { db } from '../lib/db';
import { AttachmentFile } from '../components/attendance/AttendanceFileUpload';

interface RegisterAttendanceData {
  sessionId: string;
  vereadorId: string;
  status: 'presente' | 'ausente';
  justification?: string;
  attachments?: AttachmentFile[];
}

export const attendanceService = {
  registerAttendance: (data: RegisterAttendanceData) => {
    const { sessionId, vereadorId, status, justification, attachments } = data;

    return db.transaction(() => {
      // Insert attendance record
      const result = db.prepare(`
        INSERT INTO attendance (id, status, justification, vereador_id, session_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        Math.random().toString(36).substr(2, 9),
        status,
        justification,
        vereadorId,
        sessionId
      );

      const attendanceId = result.lastInsertRowid.toString();

      // Insert attachments if any
      if (attachments && attachments.length > 0) {
        const insertAttachment = db.prepare(`
          INSERT INTO attendance_attachments (id, name, type, url, size, attendance_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const attachment of attachments) {
          insertAttachment.run(
            Math.random().toString(36).substr(2, 9),
            attachment.name,
            attachment.type,
            attachment.url,
            attachment.size,
            attendanceId
          );
        }
      }

      return this.getAttendanceById(attendanceId);
    })();
  },

  getAttendanceById: (id: string) => {
    const attendance = db.prepare(`
      SELECT a.*, json_group_array(
        json_object(
          'id', aa.id,
          'name', aa.name,
          'type', aa.type,
          'url', aa.url,
          'size', aa.size,
          'uploadedAt', aa.uploaded_at
        )
      ) as attachments
      FROM attendance a
      LEFT JOIN attendance_attachments aa ON aa.attendance_id = a.id
      WHERE a.id = ?
      GROUP BY a.id
    `).get(id);

    if (!attendance) return null;

    return {
      ...attendance,
      attachments: JSON.parse(attendance.attachments),
      timestamp: new Date(attendance.timestamp),
    };
  },

  getSessionAttendance: (sessionId: string) => {
    return db.prepare(`
      SELECT a.*, json_group_array(
        json_object(
          'id', aa.id,
          'name', aa.name,
          'type', aa.type,
          'url', aa.url,
          'size', aa.size,
          'uploadedAt', aa.uploaded_at
        )
      ) as attachments
      FROM attendance a
      LEFT JOIN attendance_attachments aa ON aa.attendance_id = a.id
      WHERE a.session_id = ?
      GROUP BY a.id
    `).all(sessionId).map(attendance => ({
      ...attendance,
      attachments: JSON.parse(attendance.attachments),
      timestamp: new Date(attendance.timestamp),
    }));
  },
};