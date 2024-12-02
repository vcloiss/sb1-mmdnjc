import fs from 'fs';
import path from 'path';
import { db } from './index';

export function restoreFromBackup(backupFile: string) {
  try {
    const backupPath = path.join(process.cwd(), 'backups', backupFile);
    
    // Close the current database connection
    db.close();
    
    // Replace the current database file with the backup
    fs.copyFileSync(backupPath, 'data.db');
    
    console.log('Backup restored successfully');
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
}