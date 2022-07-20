const dialogflow = require('@google-cloud/dialogflow');
const moment = require('moment');
require('moment-round');
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
        const outputContexts = queryResult.outputContexts;

        let i = 0;
        while (outputContexts[i].name.search('prebooking-followup') === -1) {
          i++;
        }
        const parameters = outputContexts[i].parameters.fields;
        const [date, time] = moment(
          parameters.dateTime.structValue.fields.date_time.stringValue
        )
          .ceil(30, 'minutes')
          .format('DD-MM-YYYY HH:mm')
          .split(' ');
        const data = {
          person: fields.name.structValue.fields.name.stringValue,
          phone: fields.phone.stringValue,
          date: date,
          time: time,
          guestAmount: fields.guests.numberValue,
          note: fields.note.stringValue,
        };
        try {
          await Booking.create(data);
        } catch (error) {
          console.log(error);
        }
      }
      break;

    case 'rate':
      if (queryResult.allRequiredParamsPresent) {
        let i = 0;
        for (; i < queryResult.outputContexts; i++) {
          if (
            queryResult.outputContexts[i].name.search('booking-followup') != -1
          )
            break;
        }
        const parameters = queryResult.outputContexts[i].parameters.fields;
        try {
          await Booking.findOneAndUpdate(
            {
              person: parameters.name.structValue.fields.name.stringValue,
              phone: parameters.phone.stringValue,
            },
            { rate: queryResult.parameters.fields.rate.numberValue }
          );
        } catch (error) {
          console.log(error);
        }
      }
      break;

    default:
      break;
  }
}

module.exports = { queryText, queryEvent };
