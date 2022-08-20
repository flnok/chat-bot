module.exports = {
  errorMiddleware: require('./error.middleware'),
  isAuth: require('./auth.middleware'),
  webhook: require('./webhook.middleware'),
  ...require('./hook.middleware'),
};
