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

  return res.json([
    { intent: result, msg: mappingResponses(result.responses) },
  ]);
});

function mappingResponses(responses) {
  let result;
  responses.map((res) => {
    switch (res.type) {
      case 'text':
        result = { text: { text: res.value } };
        break;
      case 'options':
        result = { payload: res.payload };
        break;
      case 'image':
        break;
      case 'chips':
        break;
      default:
        break;
    }
  });
  return result;
}

module.exports = router;
