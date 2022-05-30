const express = require('express');
const router = express.Router(); // /dialog-flow
const { defaultLanguageCode } = require('../../config/dialogFlow');
const chatbot = require('../../middleware/chatbot');

router.get('/', (req, res) => {
  return res.send();
});

router.post('/query-text', async (req, res) => {
  const { queries, languageCode, parameters } = req.body;
  if (!languageCode) languageCode = defaultLanguageCode;
  let responses = await chatbot.queryText(queries, parameters, languageCode);
  return res.send(responses[0].queryResult);
});

router.post('/query-event', async (req, res) => {
  const { queries, languageCode, parameters } = req.body;
  if (!languageCode) languageCode = defaultLanguageCode;
  let responses = await chatbot.queryEvent(queries, parameters, languageCode);
  return res.send(responses[0].queryResult);
});

module.exports = router;
