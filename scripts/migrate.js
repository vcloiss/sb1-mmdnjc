import { db } from '../src/lib/db';
import { createBackup } from '../src/lib/db/backup';

// Run migrations
console.log('Running migrations...');

// Create backup before migrations
createBackup()
  .then(() => {
    console.log('Database backup created successfully');
  })
  .catch((error) => {
    console.error('Error creating backup:', error);
    process.exit(1);
  });

// Add any new migrations here
// Example:
// db.exec(`
//   ALTER TABLE sessions ADD COLUMN new_column TEXT;
// `);

console.log('Migrations completed successfully');