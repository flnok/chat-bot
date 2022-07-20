const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    person: String,
    phone: String,
    date: String,
    time: String,
    guestAmount: Number,
    note: String,
    rate: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema, 'bookings');
