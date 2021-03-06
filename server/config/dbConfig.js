import './config';

const dbConfig = {
  test: process.env.DB_TEST,
  development: process.env.DB_DEV,
  production: process.env.DATABASE_URL,
  dbEnv: process.env.NODE_ENV,
};

export default dbConfig;
