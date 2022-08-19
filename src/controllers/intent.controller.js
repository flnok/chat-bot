const message = require('../assets/message');
const HttpException = require('../exceptions/HttpException');
const { IntentService } = require('../services');
const { mappingResponsesInternal } = require('../utils');

class IntentController {
  intentService = new IntentService();

  getAllIntents = async (req, res, next) => {
    try {
      const data = await this.intentService.findAllIntents();

      return res.status(200).json({ data, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  getIntentById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id === 'favicon.ico') throw new HttpException(400, message.EMPTY_ID);

      console.log(`🚀 --> file: intent.controller.js --> line 23 --> IntentController --> getIntentById= --> id`, id);

      const intent = await this.intentService.findIntentById(id);
      const responses = mappingResponsesInternal(intent.responses);

      return res.status(200).json({ data: { intent, responses }, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
  createIntent = async (req, res, next) => {
    try {
      const dto = req.body;

      const data = await this.intentService.createIntent(dto);

      return res.status(201).json({ data: data, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  updateIntent = async (req, res, next) => {
    try {
      const id = req.params.id;
      const dto = req.body;

      const intent = await this.intentService.updateIntent(id, dto);
      const responsesMapping = mappingResponsesInternal(intent.responses);

      return res.status(200).json({
        data: { intent, responses: responsesMapping },
        message: 'updated',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteIntent = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.intentService.deleteIntent(id);

      res.status(200).json({ data: result, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { IntentController };
