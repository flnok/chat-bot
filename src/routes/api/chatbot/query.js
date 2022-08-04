const express = require('express');
const router = express.Router();
const chatbot = require('../../../chatbot/client/query');

router.post('/query-text', async (req, res) => {
  const { text, intent, inContext, parameters } = req.body;
  const responses = await chatbot.queryText(
    text,
    intent || null,
    inContext || null,
    parameters || []
  );

  return res.json(responses);
});

// router.post('/query-event', async (req, res) => {
//   const { queries, parameters, languageCode, userId } = req.body;
//   const responses = await chatbot.queryEvent(
//     queries,
//     parameters,
//     languageCode,
//     userId
//   );
//   return res.send(responses[0].queryResult);
// });

module.exports = router;
