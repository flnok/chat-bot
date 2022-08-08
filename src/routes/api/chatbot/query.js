const express = require('express');
const router = express.Router();
const chatbot = require('../../../chatbot/client/query');

router.post('/query-text', async (req, res) => {
  const { text, intent, inContext, parameters, action } = req.body;
  const result = await chatbot.queryText(
    text,
    intent || null,
    inContext || null,
    parameters || []
  );

  return res.json({ intent: result, msg: mappingResponses(result?.responses) });
});

router.post('/query-event', async (req, res) => {
  const { event, inContext, parameters } = req.body;
  const result = await chatbot.queryEvent(
    event,
    inContext || null,
    parameters || []
  );

  return res.json({ intent: result, msg: mappingResponses(result?.responses) });
});

function mappingResponses(responses) {
  if (!responses) return null;
  const result = [];
  responses.map((res) => {
    switch (res.type) {
      case 'text':
        result.push({ text: { text: res.text } });
        break;
      case 'options':
        result.push({ type: 'options', payload: res.options });
        break;
      case 'image':
        result.push({ type: 'image', payload: res.image });
        break;
      case 'chips':
        result.push({ type: 'chips', payload: res.chips });
        break;
      default:
        break;
    }
  });
  return result;
}

module.exports = router;
