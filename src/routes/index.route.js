const { Router } = require('express');
const { IndexController } = require('../controllers');

class IndexRouter {
  path = '/';
  router = Router();
  indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}`, this.indexController.index);
  }
}

module.exports = IndexRouter;
