const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('dashboard');
});

module.exports = router;
