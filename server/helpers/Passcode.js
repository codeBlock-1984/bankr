import bcrypt from 'bcrypt';

class Passcode {
  static async encryptPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    } catch (error) {
      console.log(error);
    }
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}
export default Passcode;
