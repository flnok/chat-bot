class IndexController {
  index = (req, res, next) => {
    try {
      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { IndexController };
