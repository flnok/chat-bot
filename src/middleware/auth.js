function isAuth(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).send('Chưa đăng nhập');
}

module.exports = { isAuth };
