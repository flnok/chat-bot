const { Booking } = require('../models');
const HttpException = require('../exceptions/HttpException');
const message = require('../assets/message');

class BookingService {
  async findAllBookings() {
    const bookings = await Booking.find({}).sort({
      sortDate: 'desc',
    });

    return bookings;
  }

  async deleteBooking(id) {
    const deleteBooking = await Booking.findByIdAndDelete(id);
    if (!deleteBooking) throw new HttpException(409, message.NOT_FOUND_BOOKING);

    return deleteBooking;
  }
}

module.exports = {BookingService};
