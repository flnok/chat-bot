const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const moment = require('moment');
require('moment-round');
const Booking = require('../models/Booking');

function handleWebhook(req, res) {
  if (!req.body.queryResult.fulfillmentMessages) return;
  req.body.queryResult.fulfillmentMessages =
    req.body.queryResult.fulfillmentMessages.map((m) => {
      if (!m.platform) m.platform = 'PLATFORM_UNSPECIFIED';
      return m;
    });
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();

  async function checkBookingInformation(agent) {
    const info = await Booking.find({
      person: agent.parameters.name.name,
      phone: agent.parameters.phone,
    });

    if (info.length > 0) {
      let count = 0;
      info.forEach((i) => {
        if (
          moment(i.date, 'DD-MM-YYYY').isSameOrAfter(
            moment(new Date(), 'DD-MM-YYYY'),
            'minutes'
          )
        ) {
          agent.add(
            `Thông tin đặt bàn của bạn là\nTên: ${i.person}\nNgày: ${i.date} vào lúc ${i.time}\nSố lượng khách: ${i.guestAmount}`
          );
          count++;
        }
      });
      if (count === 0) agent.add(`Không có thông tin đặt bàn`);
    } else {
      agent.add(`Không có thông tin đặt bàn`);
    }
    agent.add(agent.consoleMessages[0]); //Navigation
  }
  intentMap.set('Information', checkBookingInformation);

  async function dateTime(agent) {
    const [openTime, closeTime] = ['07:59', '22:01'];
    const inputDateTime =
      agent.parameters.dateTime['date_time'] || agent.parameters.dateTime;
    console.log(
      '🚀 ~ file: webhook.js ~ line 37 ~ dateTime ~ inputDateTime',
      inputDateTime
    );
    const [date, time] = moment(inputDateTime)
      .utcOffset('+0700') //Chỉ hiện thị chứ không ghi vào db
      .ceil(30, 'minutes')
      .format('DD-MM-YYYY HH:mm')
      .split(' ');
    const isBooked = await Booking.findOne({
      date,
      time,
    });
    console.log('🚀 ~ file: webhook.js ~ line 50 ~ dateTime ~ date', date);
    console.log('🚀 ~ file: webhook.js ~ line 50 ~ dateTime ~ time', time);
    console.log(moment(time, 'HH:mm'), moment(openTime, 'HH:mm'));
    const isOpenTime = moment(time, 'HH:mm').isBetween(
      moment(openTime, 'HH:mm'),
      moment(closeTime, 'HH:mm')
    );
    const isValidDate = moment(inputDateTime).isSameOrAfter(
      moment(new Date()),
      'minutes'
    );

    console.log(
      'isBooked: ',
      isBooked,
      'isOpenTime: ',
      isOpenTime,
      'isValidDate: ',
      isValidDate
    );
    if (
      agent.parameters.hasOwnProperty('dateTime') &&
      isOpenTime &&
      isValidDate &&
      !isBooked
    ) {
      agent.add(
        `Hiện bạn có thể đặt bàn vào lúc ${time} ngày ${date}.\nBạn hãy nhấn nút tiếp tục để hoàn tất việc đặt bàn`
      );
      agent.add(
        // Navigation
        new Payload(
          agent.UNSPECIFIED,
          {
            richContent: [
              [
                {
                  title: 'Tiếp tục',
                  type: 'list',
                  event: {
                    languageCode: 'vi',
                    name: 'Booking_next',
                  },
                },
                {
                  title: 'Quay lại',
                  type: 'list',
                  event: {
                    languageCode: 'vi',
                    name: 'Welcome_again',
                  },
                },
              ],
            ],
          },
          {
            rawPayload: true,
            sendAsMessage: true,
          }
        )
      );
    } else {
      // Slot filling request
      let wrongInput = agent.contexts.filter(
        (context) => context.name === 'pre_booking_dialog_context'
      );
      if (wrongInput.length > 0) {
        // Chưa nhập hoặc nhập sai kiểu dữ liệu
        agent.add(agent.consoleMessages[0]);
        agent.add(
          new Payload(
            agent.UNSPECIFIED,
            {
              options: [
                {
                  text: 'Hôm nay',
                },
                {
                  text: 'Ngày mai',
                },
              ],
              type: 'chips',
            },
            {
              rawPayload: true,
              sendAsMessage: true,
            }
          )
        );
      } else {
        // Nhập rồi nhưng không đúng
        if (isBooked) {
          agent.add(`Thời gian này không có bàn trống hãy chọn thời gian khác`);
        } else {
          agent.add(
            `Vui lòng nhập ngày và giờ hợp lệ 8h-22h từ lúc này trở đi (vd : 18h 22-7, ngày mai 17h)`
          );
        }
      }
    }
  }
  intentMap.set('Pre Booking', dateTime);

  async function verifyRateNumber(agent) {
    if (
      agent.parameters.rate &&
      agent.parameters.rate >= 0 &&
      agent.parameters.rate < 11
    ) {
      agent.consoleMessages.forEach((message) => {
        agent.add(message);
      });
    } else {
      let wrongInput = agent.contexts.filter(
        (context) => context.name === 'rate_dialog_context'
      );
      if (wrongInput.length > 0) {
        // Chưa nhập hoặc nhập sai kiểu dữ liệu
        agent.add(agent.consoleMessages[0]);
        agent.add(
          new Payload(
            agent.UNSPECIFIED,
            {
              options: [
                {
                  text: '👎',
                },
                {
                  text: '😊',
                },
                {
                  text: '👍',
                },
                {
                  text: '😍',
                },
              ],
              type: 'chips',
            },
            {
              rawPayload: true,
              sendAsMessage: true,
            }
          )
        );
      } else {
        // Nhập rồi nhưng không đúng
        agent.add(`^^ Chỉ đánh giá từ 1 - 10 thôi bạn nha`);
      }
    }
  }
  intentMap.set('Rate', verifyRateNumber);

  agent.handleRequest(intentMap);
}

module.exports = { handleWebhook };
