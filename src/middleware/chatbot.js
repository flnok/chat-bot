const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/config');
const { struct } = require('pb-util');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};
const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

async function queryText(queries, parameters = {}, languageCode, userId) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId + userId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queries,
        languageCode: languageCode,
      },
    },
    queryParams: { payload: { data: parameters } },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses;
}

async function queryEvent(queries, parameters = {}, languageCode, userId) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId + userId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        name: queries,
        parameters: struct.encode(parameters),
        languageCode: languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses;
}

module.exports = { queryText, queryEvent };
