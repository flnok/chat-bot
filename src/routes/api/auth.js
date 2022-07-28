const express = require('express');
const User = require('../../models/User');
const router = express.Router(); // api/auth

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.send({ message: 'Tài khoản không tồn tại', code: 400 });
    }
    const match = password == user.password;
    if (match) {
      req.session.user = user;
      return res.send({ message: 'Đăng nhập thành công', code: 200 });
    } else {
      return res.send({ message: 'Mật khẩu không đúng', code: 400 });
    }
  } catch (error) {
    res.send(error);
  }
});

router.post('/logout', async (req, res) => {
  req.session.destroy();
  return res.send({ loggedIn: false });
});

module.exports = router;
