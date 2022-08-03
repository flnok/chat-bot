const express = require('express');
const {
  getAllIntents,
  createIntent,
  deleteIntent,
  updateIntent,
  getIntentByName,
} = require('../../../chatbot/intent');
const { isAuth } = require('../../../middleware/auth');
const router = express.Router();

router.get('/intent', isAuth, async (req, res) => {
  const result = await getAllIntents();
  if (result) return res.status(200).json(result);
  else return res.status(500);
});

router.get('/intent/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const result = await getIntentByName(name);
  if (result.length > 0) return res.status(200).json(result);
  else return res.status(500).send('Không có intent tên này');
});

router.post('/intent', isAuth, async (req, res) => {
  const {
    name,
    contexts,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  } = req.body;

  if (name == null) return res.status(403).send('Cần nhập tên intent');

  const result = await createIntent({
    name,
    contexts: contexts || [],
    trainingPhrases: trainingPhrases || [],
    action: action || '',
    followUp: followUp || [],
    parameters: parameters || [],
    responses: responses || [],
  });
  if (result?.intent) return res.status(200).json(result);
  else return res.status(500);
});

router.put('/intent/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const { contexts, trainingPhrases, action, followUp, parameters, responses } =
    req.body;
  const result = await updateIntent(name, {
    contexts: contexts || [],
    trainingPhrases: trainingPhrases || [],
    action: action || '',
    followUp: followUp || [],
    parameters: parameters || [],
    responses: responses || [],
  });
  if (result?.intent) return res.status(200).json(result);
  else return res.status(500);
});

router.delete('/intent/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const result = await deleteIntent(name);
  if (result?.intent) return res.status(200).json(result);
  else return res.status(500);
});

module.exports = router;
