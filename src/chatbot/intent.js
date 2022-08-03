const Intent = require('../models/chatbot/Intent');
const mongoose = require('mongoose');
const Context = require('../models/chatbot/Context');
const _ = require('lodash');

async function getAllIntents() {
  try {
    const intents = await Intent.find({}).populate('contexts');
    return { total: intents.length, intents };
  } catch (error) {
    console.error(error.message);
  }
}
async function getIntentByName(name) {
  try {
    const intents = await Intent.find({ name: name })
      .populate('contexts')
      .populate('followUp');
    return intents;
  } catch (error) {
    console.error(error.message);
  }
}

async function createIntent({
  name,
  contexts,
  trainingPhrases,
  action,
  followUp,
  parameters,
  responses,
}) {
  const _id = new mongoose.Types.ObjectId();
  const data = {
    _id,
    name,
    contexts,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  };

  try {
    if (data.contexts) data.contexts = await Context.create(data.contexts);
    const intent = await Intent.create(data);
    return { message: 'Tạo thành công', intent };
  } catch (error) {
    console.error(error.message);
  }
}

async function updateIntent(
  name,
  {
    updateName,
    contexts,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  }
) {
  const update = {};
  if (!_.isEmpty(updateName)) update.name = updateName;
  if (!_.isEmpty(contexts)) update.contexts = contexts;
  if (!_.isEmpty(trainingPhrases)) update.trainingPhrases = trainingPhrases;
  if (!_.isEmpty(action)) update.action = action;
  if (!_.isEmpty(followUp)) update.followUp = followUp;
  if (!_.isEmpty(parameters)) update.parameters = parameters;
  if (!_.isEmpty(responses)) update.responses = responses;
  try {
    if (update.contexts) {
      const duplicateContexts = await Context.find({
        name: { $in: update.contexts.map((c) => c.name) },
      }).select('name -_id');
      const newContexts = _.differenceBy(
        update.contexts,
        duplicateContexts,
        'name'
      );
      if (!_.isEmpty(newContexts)) {
        const updateContexts = await Context.create(newContexts);
        update.contexts = updateContexts;
      }
    }

    const intent = await Intent.findOneAndUpdate({ name: name }, update, {
      new: true,
    });
    return { message: 'Cập nhật thành công', intent };
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteIntent(name) {
  try {
    const intent = await Intent.findOneAndDelete({ name: name });
    return { message: 'Xóa thành công', intent };
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  createIntent,
  getAllIntents,
  updateIntent,
  deleteIntent,
  getIntentByName,
};
