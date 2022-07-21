const express = require('express');
const router = express.Router();

router.use('/dialog-flow', require('./dialogFlow')); // /api/dialog-flow

module.exports = router;
