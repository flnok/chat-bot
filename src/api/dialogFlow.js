const express = require('express');
const router = express.Router(); // /dialog-flow
const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/dialogFlow');

// Create session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);

router.get('/', (req, res) => {
  return res.send();
});

router.post('/query-text', async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body,
        languageCode: config.dialogFlowSessionLanguageCode,
      },
    },
  };
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log('  No intent matched.');
  }
  return res.send(result);
});

router.post('/query-event', (req, res) => {
  return res.send(JSON.parse('{ "do": "thing" }'));
});

module.exports = router;
