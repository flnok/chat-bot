const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/dialogFlow');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
// const defaultLanguageCode = config.dialogFlowSessionLanguageCode;
// const credentials = {
//   client_email: config.googleClientEmail,
//   private_key: config.googlePrivateKey,
// };
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(projectId, sessionId, query, languageCode) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  // if (contexts && contexts.length > 0) {
  //   request.queryParams = {
  //     contexts: contexts,
  //   };
  // }

  const responses = await sessionClient.detectIntent(request);
  console.log(responses);
  return responses;
}

async function executeQueries(projectId, sessionId, queries, languageCode) {
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log('Detected intent');
      console.log(
        `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      );
      context = intentResponse.queryResult.outputContexts;
    } catch (error) {
      console.log(error);
    }
  }
}

async function queryText(queries, languageCode) {
  return await detectIntent(projectId, sessionId, queries, languageCode);
}

module.exports = { queryText };
