const HttpException = require('../exceptions/HttpException');
const message = require('../assets/message');

const authMiddleware = (req, res, next) => {
  if (req.session.user) return next();
  return next(new HttpException(401, message.NOT_LOGIN));
};

module.exports = authMiddleware;
