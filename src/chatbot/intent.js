const Intent = require('../models/chatbot/Intent');
const mongoose = require('mongoose');
const Context = require('../models/chatbot/Context');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

async function getAllIntents() {
  try {
    const intents = await Intent.find({})
      .populate('inContexts')
      .populate('contexts');
    return { total: intents.length, intents };
  } catch (error) {
    console.error(error.message);
  }
}

async function getIntentById(id) {
  try {
    const intent = await Intent.findOne({ _id: new ObjectId(id) })
      .populate('inContexts')
      .populate('contexts');
    return intent;
  } catch (error) {
    console.error(error.message);
  }
}

async function createIntent({
  name,
  inContexts,
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
    inContexts,
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
    if (data.inContexts?.length > 0) {
      data.inContexts = data.inContexts.map((ct) => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: data.inContexts.map((c) => c.name) },
      });
      const newContexts = _.differenceBy(
        data.inContexts,
        duplicateContexts,
        'name'
      );
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        data.inContexts = await Context.find({
          name: { $in: data.inContexts.map((c) => c.name) },
        });
      } else {
        data.inContexts = duplicateContexts;
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
    inContexts,
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
  update.contexts = contexts;
  if (!_.isEmpty(event)) update.event = event;
  update.trainingPhrases = trainingPhrases;
  if (!_.isEmpty(action)) update.action = action;
  update.parameters = parameters;
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
    if (update.inContexts?.length > 0) {
      update.inContexts = update.inContexts.map((ct) => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: update.inContexts.map((c) => c.name) },
      });
      const newContexts = _.differenceBy(
        update.inContexts,
        duplicateContexts,
        'name'
      );
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        update.inContexts = await Context.find({
          name: { $in: update.inContexts.map((c) => c.name) },
        });
      } else {
        update.inContexts = duplicateContexts;
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
    )
      .populate('contexts')
      .populate('inContexts');
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
