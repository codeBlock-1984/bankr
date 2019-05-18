import debug from 'debug';

import pool from '../db';

const debugg = debug('Migrate undo');

(async function migrateUndo() {
  const client = await pool.connect();
  try {
    debugg('rolling back migrations...');
    await client.query('DROP TABLE IF EXISTS actions CASCADE');
    await client.query('DROP TABLE IF EXISTS transactions CASCADE');
    await client.query('DROP TABLE IF EXISTS accounts CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
  } catch (error) {
    debugg(error);
  } finally {
    await client.release();
    debugg('migration rollback is complete');
  }
}());
