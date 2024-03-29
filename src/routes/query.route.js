const { QueryController } = require('../controllers');
const { Router } = require('express');
const { webhook } = require('../middleware');

class QueryRouter {
  path = '/query';
  router = Router();
  queryController = new QueryController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/text`, this.queryController.queryText);
    this.router.post(`${this.path}/event`, this.queryController.queryEvent);
    this.router.post(`${this.path}/dialogflow/webhook`, (req, res) => {
      webhook.handleWebhook(req, res);
    });
    this.router.post(`${this.path}/dialogflow/text`, this.queryController.dialogFlowQueryText);
    this.router.post(`${this.path}/dialogflow/event`, this.queryController.dialogFlowQueryEvent);
  }
}

module.exports = QueryRouter;
