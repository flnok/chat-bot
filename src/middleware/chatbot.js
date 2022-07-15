const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/config');
const { struct } = require('pb-util');
const Booking = require('../models/Booking');
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

  switch (responses[0].queryResult.action) {
    case 'booking':
      if (responses[0].queryResult.allRequiredParamsPresent) {
        const fields = responses[0].queryResult.parameters.fields;
        const data = {
          person: fields.name.structValue.fields.name.stringValue,
          date: fields.date.stringValue,
          time: fields.time.stringValue,
          note: fields.other.stringValue,
          guestAmount: fields.guests.numberValue,
        };
        try {
          const b = await Booking.create(data);
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
      break;

    default:
      break;
  }

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
