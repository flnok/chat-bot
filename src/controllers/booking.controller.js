const message = require('../assets/message');
const { BookingService } = require('../services');

class BookingController {
  bookingService = new BookingService();

  getBookings = async (req, res, next) => {
    try {
      const user = await this.bookingService.findAllBookings();

      return res.status(200).send({ message: message.GET_ALL, data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteBookingById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteBookingData = await this.bookingService.deleteBooking(id);

      return res.status(200).json({ message: message.DELETE, data: deleteBookingData });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { BookingController };
