const dialogflow = require('@google-cloud/dialogflow');
const moment = require('moment');
require('moment-round');
const { struct } = require('pb-util');
const config = require('../config/config');
const Booking = require('../models/Booking');
const { defaultLanguageCode } = require('../config/config');
const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};
const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

async function queryText(
  queries,
  parameters = {},
  languageCode = defaultLanguageCode,
  userId
) {
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

async function queryEvent(
  queries,
  parameters = {},
  languageCode = defaultLanguageCode,
  userId
) {
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
          parameters.dateTime?.structValue?.fields?.date_time?.stringValue
        )
          .utcOffset('+0700')
          .ceil(30, 'minutes')
          .format('DD-MM-YYYY HH:mm')
          .split(' ');

        const sortDate = moment(`${date}`, 'DD-MM-YYYY')
          .add(`${time}`, 'hours')
          .format();

        const data = {
          person: fields.name.structValue.fields.name.stringValue,
          phone: fields.phone.stringValue,
          date: date,
          time: time,
          guestAmount: fields.guests.numberValue,
          sortDate: sortDate,
        };
        try {
          const booked = await Booking.create(data);
          if (booked) console.log('Booked');
        } catch (error) {
          console.log(error);
        }
      }
      break;

    case 'rate':
      if (queryResult.allRequiredParamsPresent) {
        const outputContexts = queryResult.outputContexts;
        let i = 0;
        while (outputContexts[i].name.search('booking-followup') === -1) {
          i++;
        }
        const parameters = outputContexts[i].parameters.fields;
        try {
          const update = await Booking.findOneAndUpdate(
            {
              person: parameters.name.structValue.fields.name.stringValue,
              phone: parameters.phone.stringValue,
            },
            { rate: queryResult.parameters.fields.rate.numberValue }
          );
          if (update) console.log('Rated');
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
