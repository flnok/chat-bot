const mongoose = require('mongoose');
const Context = require('../models/chatbot/Context');
const _ = require('lodash');

async function getAllContexts() {
  try {
    const contexts = await Context.find({});
    return { total: contexts.length, contexts };
  } catch (error) {
    console.error(error.message);
  }
}
async function getContextByName(name) {
  try {
    const context = await Context.findOne({ name: name });
    return context;
  } catch (error) {
    console.error(error.message);
  }
}

async function createContext({ name, lifeSpan, parameters }) {
  const _id = new mongoose.Types.ObjectId();
  const data = {
    _id,
    name,
    lifeSpan,
    parameters,
  };
  try {
    const context = await Context.create(data);
    return { message: 'Tạo thành công', context };
  } catch (error) {
    console.error(error.message);
  }
}

async function updateContext(name, { updateName, lifeSpan = 1, parameters }) {
  const update = { name, lifeSpan };
  if (!_.isEmpty(updateName)) update.parameters = updateName;
  if (!_.isEmpty(parameters)) update.parameters = parameters;
  try {
    const context = await Context.findOneAndUpdate({ name: name }, update, {
      new: true,
    });
    return { message: 'Cập nhật thành công', context };
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteContext(name) {
  try {
    const context = await Context.findOneAndDelete({ name: name });
    return { message: 'Xóa thành công', context };
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  createContext,
  getAllContexts,
  updateContext,
  deleteContext,
  getContextByName,
};
