const express = require('express');
const router = express.Router(); // /dialog-flow
const { defaultLanguageCode } = require('../../config/config');
const chatbot = require('../../middleware/chatbot');
const { WebhookClient } = require('dialogflow-fulfillment');

router.get('/', (req, res) => {
  return res.send();
});

router.post('/query-text', async (req, res) => {
  const { queries, parameters, languageCode, userId } = req.body;
  const responses = await chatbot.queryText(
    queries,
    parameters,
    languageCode || defaultLanguageCode,
    userId
  );
  return res.send(responses[0].queryResult);
});

router.post('/query-event', async (req, res) => {
  const { queries, parameters, languageCode, userId } = req.body;
  if (!languageCode) languageCode = defaultLanguageCode;
  const responses = await chatbot.queryEvent(
    queries,
    parameters,
    languageCode || defaultLanguageCode,
    userId
  );
  return res.send(responses[0].queryResult);
});

router.post('/', async (req, res) => {
  if (!req.body.queryResult.fulfillmentMessages) return;
  req.body.queryResult.fulfillmentMessages =
    req.body.queryResult.fulfillmentMessages.map((m) => {
      if (!m.platform) m.platform = 'PLATFORM_UNSPECIFIED';
      return m;
    });
  const agent = new WebhookClient({ request: req, response: res });

  let intentMap = new Map();

  agent.handleRequest(intentMap);
});

module.exports = router;
