const { Booking } = require('../models');
const moment = require('moment');

class InternalService {
  async syncDatabase() {
    const bookings = await Booking.find({});
    const promisesToAwait = [];
    for (let b of bookings) {
      const sortDate = moment(`${b.date}`, 'DD-MM-YYYY').add(`${b.time}`, 'hours').format();
      promisesToAwait.push(
        Booking.updateOne(
          {
            person: b.person,
            phone: b.phone,
            date: b.date,
            time: b.time,
            guestAmount: b.guestAmount,
          },
          { sortDate: sortDate },
        ),
      );
    }
    const data = await Promise.all(promisesToAwait);
    return data;
  }
}

module.exports = { InternalService };
