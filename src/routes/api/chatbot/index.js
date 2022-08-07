const express = require('express');
const {
  getAllContexts,
  getContextByName,
  createContext,
  updateContext,
  deleteContext,
} = require('../../../chatbot/context');
const { isAuth } = require('../../../middleware/auth');
const router = express.Router(); // api/chatbot

router.get('/context', isAuth, async (req, res) => {
  const result = await getAllContexts();
  return res.status(200).json(result);
});

router.get('/context/:name', isAuth, async (req, res) => {
  const { name } = req.params;
  const result = await getContextByName(name);
  if (result) return res.status(200).json(result);
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

router.use('/', require('./query'));
router.use('/', require('./intent'));

module.exports = router;
