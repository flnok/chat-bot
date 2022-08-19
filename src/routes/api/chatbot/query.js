// const express = require('express');
// const router = express.Router();
// const chatbot = require('../../../chatbot/client/query');
// const { mappingResponsesToQuery } = require('../../../util/format');

// router.post('/query-text', async (req, res) => {
//   const { text, inContext, parameters, action, fullInContexts } = req.body;
// const result = await chatbot.queryText(text, inContext || [], action || '', parameters || {}, fullInContexts || []);

//   return res.json({
//     intent: result,
//     msg: mappingResponsesToQuery(result?.responses),
//   });
// });

// router.post('/query-event', async (req, res) => {
//   const { event, inContext, parameters, action } = req.body;
// const result = await chatbot.queryEvent(event, inContext || [], action || '', parameters || {});

//   return res.json({
//     intent: result,
//     msg: mappingResponsesToQuery(result?.responses),
//   });
// });

// module.exports = router;
