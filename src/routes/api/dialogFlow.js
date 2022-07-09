const express = require('express');
const router = express.Router(); // /dialog-flow
const { defaultLanguageCode } = require('../../config/config');
const chatbot = require('../../middleware/chatbot');

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

module.exports = router;
