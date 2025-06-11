import cron from 'node-cron';
import UserDatabase from '../data/data.js';

// Schedule: Every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  const db = await UserDatabase.getInstance();
  await db.backup();
  console.log('🕑 Nightly backup completed.');
});

// Prevent script from exiting immediately
console.log('⏳ Cron job running...');

// Run it using command: node cron/backupCron.js
