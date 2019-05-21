const users = `CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  photoUrl VARCHAR(500),
  type VARCHAR(20) DEFAULT('client'),
  isAdmin BOOLEAN DEFAULT false,
  createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export default users;
