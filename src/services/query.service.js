const message = require('../assets/message');
const HttpException = require('../exceptions/HttpException');
const _ = require('lodash');
const { isEmpty } = require('../utils');
const { Intent, Context, Booking } = require('../models');
const { handleAction } = require('../middleware');
const dialogflow = require('@google-cloud/dialogflow');
const moment = require('moment');
require('moment-round');
const { struct } = require('pb-util');
const config = require('../config');
const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};
const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

class QueryService {
  async queryText(dto) {
    if (isEmpty(dto)) throw new HttpException(400, message.EMPTY_DATA);

    const data = {
      text: dto.text,
      inContext: dto.inContext || [],
      action: dto.action || '',
      parameters: dto.parameters || {},
      fullInContexts: dto.fullInContexts || [],
    };
    if (_.isEmpty(data.text)) throw new HttpException(400, message.EMPTY_DATA);

    const query = { trainingPhrases: data.text.trim().toLowerCase() };
    let result;

    if (!data.action) {
      if (!_.isEmpty(data.inContext)) {
        query.inContext = await Context.find({
          name: { $in: data.inContext.map(name => name) },
        });
      }
      result = await Intent.findOne({
        trainingPhrases: query.trainingPhrases,
        $or: [
          { inContexts: { $in: query.inContext } },
          { inContexts: { $in: [null] } },
          { inContexts: { $exists: false } },
          { inContexts: { $eq: [] } },
        ],
      })
        .populate({ path: 'inContexts' })
        .populate({ path: 'contexts' })
        .lean();
    }

    if (data.action) {
      const responsesFromAction = await handleAction(
        data.action,
        data.parameters,
        data.fullInContexts,
      );
      result = await Intent.findOne({
        action: `${data.action}_output`,
      })
        .populate({ path: 'inContexts' })
        .populate({ path: 'contexts' })
        .lean();
      if (result) {
        result.responses = responsesFromAction?.concat(result?.responses);
        result.contexts.forEach(context => (context.parameters = data.parameters));
      }
    }

    if (_.isEmpty(result)) {
      result = await Intent.findOne({ name: 'DEFAULT FALLBACK' }).populate('contexts');
    }

    return result;
  }

  async queryEvent(dto) {
    if (isEmpty(dto)) throw new HttpException(400, message.EMPTY_DATA);

    const data = {
      event: dto.event,
      inContext: dto.inContext || [],
      action: dto.action || '',
      parameters: dto.parameters || {},
    };
    if (_.isEmpty(data.event)) throw new HttpException(400, message.EMPTY_DATA);

    const query = { event: data.event.trim().toUpperCase() };

    if (data.action) query.action = data.action;

    if (!_.isEmpty(data.inContext)) {
      query.inContext = await Context.find({
        name: { $in: data.inContext.map(name => name) },
      });
    }

    let result = await Intent.findOne({
      event: query.event,
      $or: [
        { inContexts: { $in: query.inContext } },
        { inContexts: { $in: [null] } },
        { inContexts: { $exists: false } },
        { inContexts: { $eq: [] } },
      ],
    })
      .populate({ path: 'inContexts' })
      .populate({ path: 'contexts' })
      .lean();

    if (_.isEmpty(result)) {
      result = await Intent.findOne({ name: 'default fallback' }).populate('contexts');
    }

    return result;
  }

  async dialogFlowQueryText({
    queries,
    parameters = {},
    languageCode = config.defaultLanguageCode,
    userId,
  }) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId + userId);
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

  async dialogFlowQueryEvent({
    queries,
    parameters = {},
    languageCode = config.defaultLanguageCode,
    userId,
  }) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId + userId);
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
}

const addDb = async queryResult => {
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
          parameters.dateTime?.structValue?.fields?.date_time?.stringValue ||
            parameters.dateTime?.stringValue,
        )
          .utcOffset('+0700')
          .ceil(30, 'minutes')
          .format('DD-MM-YYYY HH:mm')
          .split(' ');

        const sortDate = moment(`${date}`, 'DD-MM-YYYY').add(`${time}`, 'hours').format();

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
        while (outputContexts[i].name.search('prebooking-followup') === -1) {
          i++;
        }
        const parameters = outputContexts[i].parameters.fields;
        const [date, time] = moment(
          parameters.dateTime?.structValue?.fields?.date_time?.stringValue ||
            parameters.dateTime?.stringValue,
        )
          .utcOffset('+0700')
          .ceil(30, 'minutes')
          .format('DD-MM-YYYY HH:mm')
          .split(' ');

        try {
          const update = await Booking.updateOne(
            {
              person: parameters.name.structValue.fields.name.stringValue,
              phone: parameters.phone.stringValue,
              date,
              time,
            },
            { rate: queryResult.parameters.fields.rate.numberValue },
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
};

module.exports = {
  QueryService,
};
