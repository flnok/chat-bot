const { IntentController } = require('../controllers');
const { isAuth } = require('../middleware');
const { Router } = require('express');

class IntentRouter {
  path = '/intent';
  router = Router();
  intentController = new IntentController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // this.router.use(isAuth);
    this.router.get(`${this.path}`, isAuth, this.intentController.getAllIntents);
    this.router.get(`${this.path}/:id`, isAuth, this.intentController.getIntentById);
    this.router.post(`${this.path}`, isAuth, this.intentController.createIntent);
    this.router.put(`${this.path}/:id`, isAuth, this.intentController.updateIntent);
    this.router.delete(`${this.path}/:id`, isAuth, this.intentController.deleteIntent);
  }
}

module.exports = IntentRouter;
