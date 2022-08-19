const { Router } = require('express');
const { BookingController } = require('../controllers');
const { isAuth } = require('../middleware');

class BookingRouter {
  path = '/bookings';
  router = Router();
  bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, isAuth, this.bookingController.getBookings);
    // this.router.get(`${this.path}/:id`, this.bookingController.getById);
    // this.router.post(`${this.path}`, this.bookingController.create);
    // this.router.put(`${this.path}/:id`, this.bookingController.update);
    this.router.delete(`${this.path}/:id`, isAuth, this.bookingController.deleteBookingById);
  }
}

module.exports = BookingRouter;
