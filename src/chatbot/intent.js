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
    const intent = await Intent.findOne({ _id: new ObjectId(id) }).populate(
      'contexts'
    );
    return intent;
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
    parameters,
    responses,
  };

  try {
    if (data.contexts?.length > 0) {
      data.contexts = data.contexts.map((ct) => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: data.contexts.map((c) => c.name) },
      });
      const newContexts = _.differenceBy(
        data.contexts,
        duplicateContexts,
        'name'
      );
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        data.contexts = await Context.find({
          name: { $in: data.contexts.map((c) => c.name) },
        });
      } else {
        data.contexts = duplicateContexts;
      }
    }
    if (data.parameters) {
      data.parameters = data.parameters.map((p) => {
        return { key: p.trim() };
      });
    }
    const intent = await Intent.create(data);
    return { message: 'Tạo thành công', intent };
  } catch (error) {
    console.error(error.message);
    if (error.code == '11000' && error.keyValue?.name) {
      return { message: 'Bị trùng tên', status: 'DUPLICATE_NAME' };
    }
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
  if (!_.isEmpty(parameters)) update.parameters = parameters;
  if (!_.isEmpty(responses)) update.responses = responses;
  try {
    if (update.contexts?.length > 0) {
      update.contexts = update.contexts.map((ct) => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: update.contexts.map((c) => c.name) },
      });
      const newContexts = _.differenceBy(
        update.contexts,
        duplicateContexts,
        'name'
      );
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        update.contexts = await Context.find({
          name: { $in: update.contexts.map((c) => c.name) },
        });
      } else {
        update.contexts = duplicateContexts;
      }
    }
    if (update.parameters?.length > 0) {
      update.parameters = update.parameters?.map((p) => {
        return { key: p.trim() };
      });
    }
    const intent = await Intent.findOneAndUpdate(
      { _id: new ObjectId(id) },
      update,
      {
        new: true,
      }
    ).populate('contexts');
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
