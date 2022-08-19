class IndexController {
  index = (req, res, next) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { IndexController };
