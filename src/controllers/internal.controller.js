const { InternalService } = require('../services');

class InternalController {
  internalService = new InternalService();

  syncDatabase = async (req, res, next) => {
    try {
      const data = await this.internalService.syncDatabase();

      return res.status(200).json({ data, message: 'syncDB' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { InternalController };
