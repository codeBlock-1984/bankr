const testUser = {
  firstName: 'Dora',
  lastName: 'Ofili',
  email: 'doraofili@yahoo.com',
  password: 'dorasecurepassword',
  type: 'client',
  isAdmin: false,
};
const testUserData = {
  firstName: 'Maureen',
  lastName: 'George',
  email: 'maumau@yahoo.com',
  password: 'maureensecurepassword',
  type: 'staff',
  isAdmin: true,
};

const client = { email: 'alicen1995@yahoo.com', password: 'securepassword1' };
const cashier = { email: 'cyrilu@gmail.com', password: 'strongpassword1' };
const admin = { email: 'darknight@live.com', password: 'adminpassword2' };

export default {
  client,
  cashier,
  admin,
  testUser,
  testUserData,
};
