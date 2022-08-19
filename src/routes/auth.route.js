const { Router } = require('express');
const {AuthController} = require('../controllers');

class AuthRouter {
  path = '/auth';
  router = Router();
  authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/logout`, this.authController.logout);
  }
}

module.exports = AuthRouter;
