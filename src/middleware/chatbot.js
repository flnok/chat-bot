const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/dialogFlow');
const { struct } = require('pb-util');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
// const credentials = {
//   client_email: config.googleClientEmail,
//   private_key: config.googlePrivateKey,
// };
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
// async function detectIntent(projectId, sessionId, query, languageCode) {
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: query,
//         languageCode: languageCode,
//       },
//     },
//   };

//   // if (contexts && contexts.length > 0) {
//   //   request.queryParams = {
//   //     contexts: contexts,
//   //   };
//   // }

//   const responses = await sessionClient.detectIntent(request);
//   console.log(responses);
//   return responses;
// }

// async function executeQueries(projectId, sessionId, queries, languageCode) {
//   let context;
//   let intentResponse;
//   for (const query of queries) {
//     try {
//       console.log(`Sending Query: ${query}`);
//       intentResponse = await detectIntent(
//         projectId,
//         sessionId,
//         query,
//         context,
//         languageCode
//       );
//       console.log('Detected intent');
//       console.log(
//         `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
//       );
//       context = intentResponse.queryResult.outputContexts;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

async function queryText(queries, parameters = {}, languageCode) {
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

async function queryEvent(queries, parameters = {}, languageCode) {
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
