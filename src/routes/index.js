const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('backend dashboard');
});

router.use('/api', require('./api'));

module.exports = router;
