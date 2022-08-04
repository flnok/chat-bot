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
  const query = { trainingPhrases: text };
  if (!_.isEmpty(parameters)) query.parameters = parameters;
  try {
    if (intent) query.name = intent;
    if (inContext) query.contexts = await Context.findOne({ name: inContext });
    let result = await Intent.findOne(query);
    if (_.isEmpty(result)) {
      result = await Intent.findOne({ name: 'Default Fallback' });
    }
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

async function queryEvent(event, inContext = null) {
  //   if (_.isEmpty(event)) return;
  //   const query = { trainingPhrases: event };
  //   if (!_.isEmpty(parameters)) query.parameters = parameters;
  //   try {
  //     if (event) query.name = intent;
  //     if (inContext) query.contexts = await Context.findOne({ name: inContext });
  //     let result = await Intent.findOne(query);
  //     if (_.isEmpty(result)) {
  //       result = await Intent.findOne({ name: 'Default Fallback' });
  //     }
  //     return result;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
}

module.exports = {
  queryText,
  queryEvent,
};
