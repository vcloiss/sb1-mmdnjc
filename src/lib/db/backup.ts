import fs from 'fs';
import path from 'path';
import { db } from './index';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

export async function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.db`);

  try {
    // Create a backup of the database file
    fs.copyFileSync('data.db', backupPath);
    console.log(`Backup created successfully at ${backupPath}`);

    // Keep only last 5 backups
    const files = fs.readdirSync(BACKUP_DIR);
    if (files.length > 5) {
      const oldestFiles = files
        .map(file => ({ file, time: fs.statSync(path.join(BACKUP_DIR, file)).mtime }))
        .sort((a, b) => a.time.getTime() - b.time.getTime())
        .slice(0, files.length - 5);

      oldestFiles.forEach(({ file }) => {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
      });
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

// Schedule automatic backups every 24 hours
setInterval(createBackup, 24 * 60 * 60 * 1000);