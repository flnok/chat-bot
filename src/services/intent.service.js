const { Intent, Context } = require('../models');
const message = require('../assets/message');
const { isEmpty } = require('../utils');
const _ = require('lodash');
const HttpException = require('../exceptions/HttpException');
const ObjectId = require('mongoose').Types.ObjectId;

class IntentService {
  async findAllIntents() {
    const intents = await Intent.find({}).populate('inContexts').populate('contexts');

    return intents;
  }

  async findIntentById(id) {
    if (isEmpty(id)) throw new HttpException(400, message.EMPTY_ID);

    const intent = await Intent.findOne({ _id: new ObjectId(id) })
      .populate('inContexts')
      .populate('contexts');
    if (!intent) throw new HttpException(409, message.NOT_FOUND_INTENT);

    return intent;
  }

  async updateIntent(id, data) {
    if (isEmpty(id)) throw new HttpException(400, message.EMPTY_ID);
    if (isEmpty(data)) throw new HttpException(400, message.EMPTY_DATA);

    const { updateName, inContexts, contexts, event, trainingPhrases, action, parameters, responses } = data;
    const update = {};

    if (!_.isEmpty(updateName)) update.name = updateName;
    update.inContexts = inContexts;
    update.contexts = contexts;
    if (!_.isEmpty(event)) update.event = event;
    update.trainingPhrases = trainingPhrases;
    if (!_.isEmpty(action)) update.action = action;
    update.parameters = parameters;
    if (!_.isEmpty(responses)) update.responses = responses;

    if (update.contexts?.length > 0) {
      update.contexts = update.contexts.map(ct => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: update.contexts.map(c => c.name) },
      });
      const newContexts = _.differenceBy(update.contexts, duplicateContexts, 'name');
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        update.contexts = await Context.find({
          name: { $in: update.contexts.map(c => c.name) },
        });
      } else {
        update.contexts = duplicateContexts;
      }
    }

    if (update.parameters?.length > 0) {
      update.parameters = update.parameters?.map(p => {
        return { key: p.trim() };
      });
    }

    const intent = await Intent.findOneAndUpdate({ _id: new ObjectId(id) }, update, {
      new: true,
    })
      .populate('contexts')
      .populate('inContexts');
    if (!intent) throw new HttpException(409, message.NOT_FOUND_INTENT);

    return intent;
  }

  async createIntent(dto) {
    if (isEmpty(dto)) throw new HttpException(400, message.EMPTY_DATA);
    const data = {
      name: dto.name,
      inContexts: dto.inContexts || [],
      contexts: dto.contexts || [],
      event: dto.event || '',
      trainingPhrases: dto.trainingPhrases || [],
      action: dto.action || '',
      parameters: dto.parameters || [],
      responses: dto.responses || [],
    };
    const isDuplicateName = await Intent.findOne({ name: data.name });
    if (isDuplicateName) throw new HttpException(409, message.DUPLICATE_NAME);

    const _id = new ObjectId();
    data._id = _id;

    if (data.contexts?.length > 0) {
      data.contexts = data.contexts.map(ct => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: data.contexts.map(c => c.name) },
      });
      const newContexts = _.differenceBy(data.contexts, duplicateContexts, 'name');
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        data.contexts = await Context.find({
          name: { $in: data.contexts.map(c => c.name) },
        });
      } else {
        data.contexts = duplicateContexts;
      }
    }

    if (data.inContexts?.length > 0) {
      data.inContexts = data.inContexts.map(ct => {
        return { name: ct.trim() };
      });
      const duplicateContexts = await Context.find({
        name: { $in: data.inContexts.map(c => c.name) },
      });
      const newContexts = _.differenceBy(data.inContexts, duplicateContexts, 'name');
      if (!_.isEmpty(newContexts)) {
        await Context.create(newContexts);
        data.inContexts = await Context.find({
          name: { $in: data.inContexts.map(c => c.name) },
        });
      } else {
        data.inContexts = duplicateContexts;
      }
    }

    if (data.parameters) {
      data.parameters = data.parameters.map(p => {
        return { key: p.trim() };
      });
    }

    const intent = await Intent.create(data);

    return intent;
  }

  async deleteIntent(id) {
    if (isEmpty(id)) throw new HttpException(400, message.EMPTY_ID);

    const intent = await Intent.findOneAndDelete({ _id: new ObjectId(id) });
    if (!intent) throw new HttpException(409, message.NOT_FOUND_INTENT);

    return intent;
  }
}

module.exports = {IntentService};
