const Intent = require('../models/chatbot/Intent');
const mongoose = require('mongoose');
const Context = require('../models/chatbot/Context');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

async function getAllIntents() {
  try {
    const intents = await Intent.find({}).populate('contexts');
    return { total: intents.length, intents };
  } catch (error) {
    console.error(error.message);
  }
}

async function getIntentById(id) {
  try {
    const intents = await Intent.findOne({ _id: new ObjectId(id) })
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
  event,
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
    event,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  };

  try {
    if (data.contexts) {
      const duplicateContexts = await Context.find({
        name: { $in: data.contexts.map((c) => c.name) },
      }).select('name -_id');
      const newContexts = _.differenceBy(
        data.contexts,
        duplicateContexts,
        'name'
      );
      if (!_.isEmpty(newContexts)) {
        data.contexts = await Context.create(newContexts);
      } else {
        data.contexts = null;
      }
    }
    const intent = await Intent.create(data);
    return { message: 'Tạo thành công', intent };
  } catch (error) {
    if (error.code == '11000' && error.keyValue?.name) {
      return { message: 'Bị trùng tên', status: 'DUPLICATE_NAME' };
    }
    console.error(error.message);
  }
}

async function updateIntent(
  id,
  {
    updateName,
    contexts,
    event,
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
  if (!_.isEmpty(event)) update.event = event;
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

    const intent = await Intent.findOneAndUpdate(
      { _id: new ObjectId(id) },
      update,
      {
        new: true,
      }
    );
    return { message: 'Cập nhật thành công', intent };
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteIntent(id) {
  try {
    const intent = await Intent.findOneAndDelete({ _id: new ObjectId(id) });
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
  getIntentById,
};
