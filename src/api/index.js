const express = require('express');
const router = express.Router(); // /api

router.get('/', (req, res) => {
  return res.send('Đây là trang api');
});

router.use('/dialog-flow', require('./dialogFlow'));

module.exports = router;
