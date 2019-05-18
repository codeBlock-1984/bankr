import debug from 'debug';

import pool from '../db';
import users from '../models/users';
import accounts from '../models/accounts';
import transactions from '../models/transactions';
import actions from '../models/actions';

const debugg = debug('Migrate');
(async function migrate() {
  debugg('migrating...');
  const client = await pool.connect();
  try {
    console.log('migrating users...');
    await client.query(users);

    console.log('migrating accounts...');
    await client.query(accounts);

    console.log('migrating transactions...');
    await client.query(transactions);

    console.log('migrating actions...');
    await client.query(actions);
  } catch (error) {
    debugg(error);
  } finally {
    await client.release();
    console.log('migration is complete');
  }
}());
