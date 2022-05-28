const express = require('express');
const router = express.Router(); // /dialog-flow
const { defaultLanguageCode } = require('../../config/dialogFlow');
const chatbot = require('../../middleware/chatbot');

router.get('/', (req, res) => {
  return res.send();
});

router.post('/query-text', async (req, res) => {
  const { queries, languageCode } = req.body;
  console.log(req.body);
  if (!languageCode) languageCode = defaultLanguageCode;
  let responses = await chatbot.queryText(queries, languageCode);
  return res.send(responses[0].queryResult);
});

// router.post('/query-event', (req, res) => {
//   return res.send(JSON.parse('{ "do": "thing" }'));
// });

module.exports = router;
