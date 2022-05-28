const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('dashboard');
});

router.use('/api', require('./api'));

module.exports = router;
