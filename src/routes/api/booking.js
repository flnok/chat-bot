const express = require('express');
const { getBookings } = require('../../middleware/bookings');
const Booking = require('../../models/Booking');
const router = express.Router(); // api/bookings
const ObjectId = require('mongoose').Types.ObjectId;

// api/bookings
router.get('/', async (req, res) => {
  if (!req.session.user) return;
  try {
    return res.status(200).json(await getBookings());
  } catch (error) {
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.session.user) return;
  const { id } = req.params;
  try {
    await Booking.findByIdAndDelete(new ObjectId(id));
    console.log('Deleted');
    return res.sendStatus(200);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
