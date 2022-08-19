// const express = require('express');
// const {
//   getAllIntents,
//   createIntent,
//   deleteIntent,
//   updateIntent,
//   getIntentById,
// } = require('../../../chatbot/intent');
// const { isAuth } = require('../../../middleware/auth');
// const { mappingResponsesInternal } = require('../../../util/format');
// const router = express.Router(); // api/chatbot

// router.get('/intent', isAuth, async (req, res) => {
//   const result = await getAllIntents();
//   return res.status(200).json(result);
// });

// router.get('/intent/:id', isAuth, async (req, res) => {
//   if (req.params.id != 'favicon.ico') {
//     const { id } = req.params;
//     const intent = await getIntentById(id);
//     const responses = mappingResponsesInternal(intent.responses);
//     if (intent) return res.status(200).json({ intent, responses });
//     else return res.status(500).send('Không có intent tên này');
//   }
//   return;
// });

// router.post('/intent', isAuth, async (req, res) => {
//   const {
//     name,
//     inContexts,
//     contexts,
//     event,
//     trainingPhrases,
//     action,
//     parameters,
//     responses,
//   } = req.body;
//   if (!name) return res.status(403).send('Cần nhập tên intent');
//   const result = await createIntent({
//     name,
//     inContexts: inContexts || [],
//     contexts: contexts || [],
//     event: event || '',
//     trainingPhrases: trainingPhrases || [],
//     action: action || '',
//     parameters: parameters || [],
//     responses: responses || [],
//   });
//   if (result?.intent) return res.status(200).json(result);
//   else if (result?.status === 'DUPLICATE_NAME')
//     return res.status(501).send('Bị trùng tên');
//   else return res.status(500);
// });

// router.put('/intent/:id', isAuth, async (req, res) => {
//   const { id } = req.params;
//   const {
//     updateName,
//     inContexts,
//     contexts,
//     event,
//     trainingPhrases,
//     action,
//     parameters,
//     responses,
//   } = req.body;
//   const intent = await updateIntent(id, {
//     updateName: updateName || '',
//     inContexts: inContexts || [],
//     contexts: contexts || [],
//     event: event || ' ',
//     trainingPhrases: trainingPhrases || [],
//     action: action || ' ',
//     parameters: parameters || [],
//     responses: responses || [],
//   });
//   const responsesMapping = mappingResponsesInternal(intent.intent?.responses);
//   if (intent?.intent)
//     return res.status(200).json({ intent, responses: responsesMapping });
//   else return res.status(500);
// });

// router.delete('/intent/:id', isAuth, async (req, res) => {
//   const { id } = req.params;
//   const result = await deleteIntent(id);
//   if (result?.intent) return res.status(200).json(result);
//   else return res.status(500);
// });

// module.exports = router;
