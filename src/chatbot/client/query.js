const Intent = require('../../models/chatbot/Intent');
const Context = require('../../models/chatbot/Context');
const { handleAction } = require('./hook');
const _ = require('lodash');

async function queryText(
  text,
  inContext = [],
  action = '',
  parameters = {},
  fullInContexts = []
) {
  if (_.isEmpty(text)) return;
  const query = { trainingPhrases: text.trim().toLowerCase() };
  try {
    let result;
    if (!action) {
      if (!_.isEmpty(inContext)) {
        query.inContext = await Context.find({
          name: { $in: inContext.map((name) => name) },
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
    if (action) {
      const responsesFromAction = await handleAction(
        action,
        parameters,
        fullInContexts
      );
      result = await Intent.findOne({
        action: `${action}_output`,
      })
        .populate({ path: 'inContexts' })
        .populate({ path: 'contexts' })
        .lean();
      if (result) {
        result.responses = responsesFromAction?.concat(result?.responses);
        result.contexts.forEach((context) => (context.parameters = parameters));
      }
    }
    if (_.isEmpty(result)) {
      result = await Intent.findOne({ name: 'DEFAULT FALLBACK' }).populate(
        'contexts'
      );
    }
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

async function queryEvent(event, inContext = [], action = '', parameters = []) {
  if (_.isEmpty(event)) return;
  const query = { event: event.trim().toUpperCase() };
  // if (!_.isEmpty(parameters)) query.parameters = parameters;
  if (action) query.action = action;
  try {
    if (!_.isEmpty(inContext)) {
      query.inContext = await Context.find({
        name: { $in: inContext.map((name) => name) },
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
      result = await Intent.findOne({ name: 'default fallback' }).populate(
        'contexts'
      );
    }
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  queryText,
  queryEvent,
};
