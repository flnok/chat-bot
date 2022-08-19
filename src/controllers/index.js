module.exports = {
  ...require('./auth.controller'),
  ...require('./booking.controller'),
  ...require('./intent.controller'),
  ...require('./index.controller'),
  ...require('./internal.controller'),
  ...require('./query.controller'),
};
