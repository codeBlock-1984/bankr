import debug from 'debug';

import pool from '../db';
import users from '../models/users';
import accounts from '../models/accounts';
import transactions from '../models/transactions';

const debugg = debug('Migrate');
(async function migrate() {
  debugg('migrating...');
  const client = await pool.connect();
  try {
    debugg('migrating users...');
    await client.query(users);

    debugg('migrating accounts...');
    await client.query(accounts);

    debugg('migrating transactions...');
    await client.query(transactions);
  } catch (error) {
    console.log(error);
  } finally {
    await client.release();
    debugg('migration is complete');
  }
}());
