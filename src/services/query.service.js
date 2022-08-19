const message = require('../assets/message');
const HttpException = require('../exceptions/HttpException');
const _ = require('lodash');
const { isEmpty } = require('../utils');
const { Intent, Context } = require('../models');
const { handleAction } = require('../chatbot/hook');

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
      const responsesFromAction = await handleAction(data.action, data.parameters, data.fullInContexts);
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

    if (data.action) query.action = action;

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
}

module.exports = {
  QueryService,
};
