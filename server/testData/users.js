const testUser = {
  firstName: 'dora',
  lastName: 'ofili',
  email: 'doraofili@yahoo.com',
  password: 'dorasecurepassword',
};

const testUserTwo = {
  firstName: 'auwal',
  lastName: 'mohammed',
  email: 'mohammeda@gmail.com',
  type: 'cashier',
};

const client = {
  email: 'emmanuelroic@gmail.com', password: 'securepassword1'
};

const clientTwo = {
  email: 'leomustapha@yahoo.com', password: 'securepassword2'
};

const cashier = {
  email: 'cyrilu@gmail.com', password: 'strongpassword1'
};

const cashierTwo = {
  email: 'mikebanks@live.com', password: 'strongpassword2'
};

const admin = {
  email: 'darknight@live.com', password: 'adminpassword2'
};

const adminTwo = {
  email: 'bigbang@live.com', password: 'adminpassword3'
};

const invalidToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
                      .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG
                      4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT
                      4fwpMeJf36POk6yJV_adQssw5c`;

export default {
  client,
  clientTwo,
  cashier,
  cashierTwo,
  admin,
  adminTwo,
  testUser,
  testUserTwo,
  invalidToken,
};
