const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    person: String,
    date: Date,
    time: String,
    guestAmount: Number,
    note: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema, 'bookings');
