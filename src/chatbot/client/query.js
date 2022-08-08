const Intent = require('../../models/chatbot/Intent');
const Context = require('../../models/chatbot/Context');
const _ = require('lodash');

async function queryText(text, inContext = null, parameters = null) {
  if (_.isEmpty(text)) return;
  const query = { trainingPhrases: text.trim().toLowerCase() };
  if (!_.isEmpty(parameters)) query.parameters = parameters;
  try {
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

async function queryEvent(event, inContext = null, parameters = null) {
  if (_.isEmpty(event)) return;
  const query = { event: event.trim().toUpperCase() };
  if (!_.isEmpty(parameters)) query.parameters = parameters;
  try {
    if (inContext) query.contexts = await Context.findOne({ name: inContext });
    let result = await Intent.findOne(query).populate('contexts');
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

module.exports = {
  queryText,
  queryEvent,
};
