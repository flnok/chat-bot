const express = require('express');
const {
  getAllContexts,
  getContextByName,
  createContext,
  updateContext,
  deleteContext,
} = require('../../../chatbot/context');
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
  return res.status(200).json(result);
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
  if (!name) return res.status(403).send('Cần nhập tên intent');
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
  const {
    updateName,
    contexts,
    trainingPhrases,
    action,
    followUp,
    parameters,
    responses,
  } = req.body;
  const result = await updateIntent(name, {
    updateName: updateName || null,
    contexts: contexts || [],
    trainingPhrases: trainingPhrases || [],
    action: action || null,
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

router.get('/context', isAuth, async (req, res) => {
  const result = await getAllContexts();
  return res.status(200).json(result);
});

router.get('/context/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const result = await getContextByName(name);
  if (result.length > 0) return res.status(200).json(result);
  else return res.status(500).send('Không có context tên này');
});

router.post('/context', isAuth, async (req, res) => {
  const { name, lifeSpan, parameters } = req.body;
  if (!name) return res.status(403).send('Cần nhập tên context');
  const result = await createContext({
    name,
    lifeSpan: lifeSpan || 1,
    parameters: parameters || [],
  });
  if (result?.context) return res.status(200).json(result);
  else return res.status(500).send('Không tạo context thành công');
});

router.put('/context/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const { updateName, lifeSpan, parameters } = req.body;
  const result = await updateContext(name, {
    updateName: updateName || null,
    lifeSpan: lifeSpan || 1,
    parameters: parameters || [],
  });
  if (result?.context) return res.status(200).json(result);
  else return res.status(500);
});

router.delete('/context/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const result = await deleteContext(name);
  if (result?.context) return res.status(200).json(result);
  else return res.status(500);
});

module.exports = router;
