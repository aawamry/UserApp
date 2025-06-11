import UserDatabase from '../data/data.js';

const db = await UserDatabase.getInstance();
await db.backup();
console.log('✅ Backup completed successfully.');