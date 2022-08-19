const { InternalController } = require('../controllers');
const { isAuth } = require('../middleware');
const { Router } = require('express');

class InternalRouter {
  path = '/internal';
  router = Router();
  internalController = new InternalController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/database/sync`, isAuth, this.internalController.syncDatabase);
  }
}

module.exports = InternalRouter;
