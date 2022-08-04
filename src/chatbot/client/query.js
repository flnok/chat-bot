const Intent = require('../../models/chatbot/Intent');
const Context = require('../../models/chatbot/Context');
const _ = require('lodash');

async function queryText(
  text,
  intent = null,
  inContext = null,
  parameters = null
) {
  if (_.isEmpty(text)) return;
  const query = { trainingPhrases: text.trim().toLowerCase() };
  if (!_.isEmpty(parameters)) query.parameters = parameters;
  try {
    if (intent) query.name = intent;
    if (inContext) query.contexts = await Context.findOne({ name: inContext });
    let result = await Intent.findOne(query);
    if (_.isEmpty(result)) {
      result = await Intent.findOne({ name: 'default fallback' });
    }
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

async function queryEvent(
  event,
  intent = null,
  inContext = null,
  parameters = null
) {
  if (_.isEmpty(event)) return;
  const query = { event: event.trim().toLowerCase() };
  if (!_.isEmpty(parameters)) query.parameters = parameters;
  try {
    if (intent) query.name = intent;
    if (inContext) query.contexts = await Context.findOne({ name: inContext });
    let result = await Intent.findOne(query);
    if (_.isEmpty(result)) {
      result = await Intent.findOne({ name: 'default fallback' });
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
