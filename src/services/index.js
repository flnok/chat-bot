module.exports = {
  ...require('./booking.service'),
  ...require('./auth.service'),
  ...require('./intent.service'),
  ...require('./internal.service'),
  ...require('./query.service'),
};
