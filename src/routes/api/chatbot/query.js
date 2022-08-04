const express = require('express');
const router = express.Router();
const chatbot = require('../../../chatbot/client/query');

router.post('/query-text', async (req, res) => {
  const { text, intent, inContext, parameters } = req.body;
  const result = await chatbot.queryText(
    text,
    intent || null,
    inContext || null,
    parameters || []
  );
  return res.json(result);
});

router.post('/query-event', async (req, res) => {
  const { event, intent, inContext, parameters } = req.body;
  const result = await chatbot.queryEvent(
    event,
    intent || null,
    inContext || null,
    parameters || []
  );
  return res.json(result);
});

module.exports = router;
