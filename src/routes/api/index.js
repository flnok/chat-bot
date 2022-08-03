const express = require('express');
const router = express.Router(); // api
const Booking = require('../../models/Booking');
const moment = require('moment');

router.post('/update-db', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    const promisesToAwait = [];
    for (let b of bookings) {
      const sortDate = moment(`${b.date}`, 'DD-MM-YYYY')
        .add(`${b.time}`, 'hours')
        .format();
      promisesToAwait.push(
        Booking.updateOne(
          {
            person: b.person,
            phone: b.phone,
            date: b.date,
            time: b.time,
            guestAmount: b.guestAmount,
          },
          { sortDate: sortDate }
        )
      );
    }
    const data = await Promise.all(promisesToAwait);
    return res.send({ status: 'success', data });
  } catch (error) {
    throw error;
  }
});

router.use('/dialog-flow', require('./dialogFlow')); // /api/dialog-flow
router.use('/auth', require('./auth')); // /api/auth
router.use('/bookings', require('./booking')); // /api/bookings
router.use('/chatbot', require('./chatbot')); // /api/chatbot

module.exports = router;
