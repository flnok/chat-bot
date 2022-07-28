const Booking = require('../models/Booking');

async function getBookings() {
  try {
    const bookings = await Booking.find({}).sort({
      sortDate: 'desc',
    });

    return { total: bookings.length, bookings };
  } catch (error) {
    throw error;
  }
}

module.exports = { getBookings };
