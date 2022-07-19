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
  // console.log(JSON.stringify(responses[0]));
  await addDb(responses[0].queryResult);

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
  await addDb(responses[0].queryResult);
  return responses;
}

async function addDb(queryResult) {
  switch (queryResult.action) {
    case 'booking':
      if (queryResult.allRequiredParamsPresent) {
        const fields = queryResult.parameters.fields;
        let isoDate = fields.date.stringValue;
        var d = new Date(isoDate);
        d.toLocaleDateString('en-GB');
        console.log(d);
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
}

module.exports = { queryText, queryEvent };
