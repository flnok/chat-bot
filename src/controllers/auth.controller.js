const message = require('../assets/message');
const { AuthService } = require('../services');

class AuthController {
  authService = new AuthService();

  login = async (req, res, next) => {
    try {
      const userData = req.body;
      const user = await this.authService.login(userData);
      req.session.user = user;
      return res.send({ message: message.SUCCESS_LOGIN, code: 200, user });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      req.session.destroy();
      return res.send({ loggedIn: false });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { AuthController };
