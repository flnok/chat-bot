const Booking = require('../../models/Booking');
const _ = require('lodash');
const moment = require('moment');

async function handleAction(action, parameters, fullInContexts) {
  if (_.isEmpty(parameters)) return;
  const response = [];
  switch (action) {
    case 'action.information':
      const info = await Booking.find({
        person: parameters.name,
        phone: parameters.phone,
      }).sort({
        sortDate: 'asc',
      });
      if (_.isEmpty(info)) {
        response.push({
          type: 'text',
          text: 'Không có thông tin đặt bàn',
        });
        return response;
      }
      let count = 0;
      info.forEach((i) => {
        if (!i.sortDate) console.log(i);
        if (
          moment(i.sortDate).isSameOrAfter(
            moment(new Date(), 'DD-MM-YYYY'),
            'minutes'
          )
        ) {
          response.push({
            type: 'text',
            text: `Thông tin đặt bàn của bạn là\nTên: ${i.person}\nNgày: ${i.date} vào lúc ${i.time}\nSố lượng khách: ${i.guestAmount}`,
          });
          count++;
        }
      });
      if (count === 0) {
        response.push({
          type: 'text',
          text: 'Không có thông tin đặt bàn hoặc bàn đặt đã hết hạn',
        });
      }
      return response;

    case 'action.booking':
      const { time, date, name, phone, guests } = parameters;
      const data = { person: name, phone, guestAmount: guests };
      const [openTime, closeTime] = ['07:59', '22:01'];
      const inputDateTime = `${time} ${date}`;
      const [inputDate, inputTime] = moment(inputDateTime, [
        'HH:mm DD-MM-YYYY',
        'HH:mm DD-MM',
        'HH DD-MM-YYYY',
        'HH DD-MM',
      ])
        .utcOffset('+0700')
        .ceil(30, 'minutes')
        .format('DD-MM-YYYY HH:mm')
        .split(' ');
      const isOpenTime = moment(inputTime, 'HH:mm').isBetween(
        moment(openTime, 'HH:mm'),
        moment(closeTime, 'HH:mm')
      );
      if (!isOpenTime) {
        response.push({
          type: 'text',
          text: 'Không trong thời gian mở cửa',
        });
        return response;
      }
      const isValidDate = moment(inputDateTime, [
        'HH:mm DD-MM-YYYY',
        'HH:mm DD-MM',
        'HH DD-MM-YYYY',
        'HH DD-MM',
      ]).isSameOrAfter(moment(new Date()), 'minutes');
      if (!isValidDate) {
        response.push({
          type: 'text',
          text: 'Chỉ nhận bàn từ thời điểm này trở đi',
        });
        return response;
      }
      const isBooked = await Booking.findOne({
        date: inputDate,
        time: inputTime,
      });
      if (isBooked) {
        response.push({
          type: 'text',
          text: 'Thời gian này đã có người đặt, bạn hãy đặt lại và chọn thời gian khác nhé',
        });
        return response;
      }
      data.date = inputDate;
      data.time = inputTime;
      data.sortDate = moment(`${inputDate}`, 'DD-MM-YYYY')
        .add(`${inputTime}`, 'hours')
        .format();
      try {
        const booked = await Booking.create(data);
        if (booked)
          response.push(
            {
              type: 'text',
              text: `Chúc mừng bạn  đã đặt bàn thành công 🎊\nHẹn gặp bạn tại nhà hàng và chúc bạn có 1 bữa ăn ngon miệng 👌`,
            },
            {
              type: 'text',
              text: `Thông tin đặt bàn của bạn là:\nTên: ${data.person}\nSố điện thoại: ${data.phone}\nSố lượng khách: ${data.guestAmount}\nThời gian nhận bàn: ${data.time} giờ ngày ${data.date}\nBạn có thể kiểm tra lại thông tin ở dưới`,
            },
            {
              type: 'text',
              text: `Cảm ơn bạn đã sử dụng dịch vụ. Mời bạn đánh giá chất lượng của mình (chatbot) để giúp tớ ngày càng tốt ngày càng tốt hơn!`,
            },
            {
              type: 'options',
              options: [
                {
                  title: 'Đánh giá chatbot',
                  event: 'RATE',
                },
                {
                  title: 'Kiểm tra thông tin đặt bàn',
                  event: 'INFORMATION',
                },
              ],
            }
          );
        return response;
      } catch (error) {
        console.log(error);
        response.push({
          type: 'text',
          text: `Đặt bàn không thành công, hãy thử lại lần nữa nhé`,
        });
        return response;
      }

    case 'action.rate':
      const lastedBooking = await Booking.findOne().sort({ _id: -1 });
      const { rate } = parameters;
      try {
        const update = await Booking.findOneAndUpdate(
          {
            person: lastedBooking.person,
            phone: lastedBooking.phone,
            date: lastedBooking.date,
            time: lastedBooking.time,
          },
          { rate: rate },
          { new: true }
        );
        if (update)
          response.push({
            type: 'text',
            text: `Bạn đã cho ${rate} điểm 💖`,
          });
        return response;
      } catch (error) {
        console.log(error);
        response.push({
          type: 'text',
          text: `Đánh giá không thành công`,
        });
        return response;
      }

    default:
      break;
  }
}

module.exports = {
  handleAction,
};
