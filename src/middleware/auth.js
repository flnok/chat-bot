function isAuth(req, res, next) {
  if (req.session.user) return next();
  return res
    .status(401)
    .send({ message: 'Chưa đăng nhập', errorStatus: 'NOT_LOGIN' });
}

module.exports = { isAuth };
