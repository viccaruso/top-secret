const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = class UserService {
  static async createUser({ email, password }) {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    const user = await User.insert({ email, hashedPassword });

    return user;
  }

  static async signIn({ email, password }) {
    // Try to get the user
    const user = await User.findUser(email);

    // If the user does not exist throw error
    if (!user) throw new Error('Invalid email or password');

    // If the user does exist, compare hashed passwords
    const isMatch = bcrypt.compareSync(password, user.hashedPassword); // <- hashedPassword is instance method that gets private property from User class
    // If the passwords did not match throw error
    if (!isMatch) throw new Error('Invalid email or password');

    // If the passwords did match - finally return the user
    return user;
  }
};
