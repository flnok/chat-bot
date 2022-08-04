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

router.post('/query-event', async (req, res) => {
  const { event, intent, inContext, parameters } = req.body;
  const responses = await chatbot.queryEvent(
    event,
    intent || null,
    inContext || null,
    parameters || []
  );
  return res.json(responses);
});

module.exports = router;
