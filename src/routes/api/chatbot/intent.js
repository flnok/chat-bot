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

const mappingPayload = (str) => {
  if (str.length < 1) return null;
  if (str.length === 1) return str;
  const result = str.map((r) => {
    switch (r.type) {
      case 'text':
        return r.value;
      case 'options':
        r.list?.forEach((opt) => {
          JSON.stringify(opt, null, 2);
        });
        return r.list;
      case 'image':
        break;
      case 'chip':
        break;
      default:
        break;
    }
  });
  return result;
};

router.get('/intent', isAuth, async (req, res) => {
  const result = await getAllIntents();
  return res.status(200).json(result);
});

router.get('/intent/:id', isAuth, async (req, res) => {
  if (req.params.id != 'favicon.ico') {
    const { id } = req.params;
    const intent = await getIntentById(id);
    const responses = mappingPayload(intent.responses);
    if (intent) return res.status(200).json({ intent, responses });
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
    parameters: parameters || [],
    responses: responses || [],
  });
  if (result?.intent) return res.status(200).json(result);
  else if (result?.status === 'DUPLICATE_NAME')
    return res.status(501).send('Bị trùng tên');
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
    parameters,
    responses,
  } = req.body;
  const result = await updateIntent(id, {
    updateName: updateName || null,
    contexts: contexts || [],
    event: event || '',
    trainingPhrases: trainingPhrases || [],
    action: action || null,
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
