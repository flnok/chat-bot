const express = require('express');
const {
  getAllIntents,
  createIntent,
  deleteIntent,
  updateIntent,
  getIntentById,
} = require('../../../chatbot/intent');
const { isAuth } = require('../../../middleware/auth');
const router = express.Router(); // api/chatbot

router.get('/intent', isAuth, async (req, res) => {
  const result = await getAllIntents();
  return res.status(200).json(result);
});

router.get('/intent/:id', isAuth, async (req, res) => {
  if (req.params.id != 'favicon.ico') {
    const { id } = req.params;
    const result = await getIntentById(id);
    if (result) return res.status(200).json(result);
    else return res.status(500).send('Không có intent tên này');
  }
  return;
});

router.post('/intent', isAuth, async (req, res) => {
  const {
    name,
    contexts,
    event,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  } = req.body;
  if (!name) return res.status(403).send('Cần nhập tên intent');
  const result = await createIntent({
    name,
    contexts: contexts || [],
    event: event || '',
    trainingPhrases: trainingPhrases || [],
    action: action || '',
    followUp: followUp || [],
    parameters: parameters || [],
    responses: responses || [],
  });
  if (result?.intent) return res.status(200).json(result);
  else return res.status(500);
});

router.put('/intent/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const {
    updateName,
    contexts,
    event,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  } = req.body;
  const result = await updateIntent(id, {
    updateName: updateName || null,
    contexts: contexts || [],
    event: event || '',
    trainingPhrases: trainingPhrases || [],
    action: action || null,
    followUp: followUp || [],
    parameters: parameters || [],
    responses: responses || [],
  });
  if (result?.intent) return res.status(200).json(result);
  else return res.status(500);
});

router.delete('/intent/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const result = await deleteIntent(id);
  if (result?.intent) return res.status(200).json(result);
  else return res.status(500);
});

module.exports = router;
