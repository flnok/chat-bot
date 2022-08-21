const { User } = require('../models');
const { isEmpty } = require('../utils');
const HttpException = require('../exceptions/HttpException');
const message = require('../assets/message');

class AuthService {
  async login(userData) {
    if (isEmpty(userData)) throw
    new HttpException(400, message.EMPTY_DATA);
    const user = await User.findOne({ username: userData.username });
    if (!user) throw new HttpException(409, message.NOT_FOUND_USER);
    const match = userData.password == user.password;
    if (!match) throw new HttpException(409, message.WRONG_PASSWORD);

    return user;
  }
}

module.exports = { AuthService };
