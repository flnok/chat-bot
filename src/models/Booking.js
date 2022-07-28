const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    person: String,
    phone: String,
    date: String,
    time: String,
    guestAmount: Number,
    rate: Number,
    sortDate: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema, 'bookings');
