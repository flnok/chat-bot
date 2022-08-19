const { QueryService } = require('../services');
const { mappingResponsesToQuery } = require('../utils');

class QueryController {
  queryService = new QueryService();

  queryText = async (req, res, next) => {
    try {
      const dto = req.body;
      const data = await this.queryService.queryText(dto);

      return res.status(200).json({
        data,
        msg: mappingResponsesToQuery(data?.responses),
      });
    } catch (error) {
      next(error);
    }
  };

  queryEvent = async (req, res, next) => {
    try {
      const dto = req.body;
      const data = await this.queryService.queryEvent(dto);

      return res.status(200).json({
        data,
        msg: mappingResponsesToQuery(data?.responses),
      });
    } catch (error) {
      next(error);
    }
  };

  dialogFlowQueryText = async (req, res, next) => {
    try {
      const dto = req.body;
      const responses = await this.queryService.dialogFlowQueryText(dto);
      const data = responses[0].queryResult;

      return res.status(200).json({ data, message: 'dialogFlowQueryText' });
    } catch (error) {
      next(error);
    }
  };

  dialogFlowQueryEvent = async (req, res, next) => {
    try {
      const dto = req.body;
      const responses = await this.queryService.dialogFlowQueryEvent(dto);
      const data = responses[0].queryResult;

      return res.status(200).json({ data, message: 'syncDB' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { QueryController };
