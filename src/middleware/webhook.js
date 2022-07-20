const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const Booking = require('../models/Booking');
const moment = require('moment');
require('moment-round');

function handleWebhook(req, res) {
  if (!req.body.queryResult.fulfillmentMessages) return;
  req.body.queryResult.fulfillmentMessages =
    req.body.queryResult.fulfillmentMessages.map((m) => {
      if (!m.platform) m.platform = 'PLATFORM_UNSPECIFIED';
      return m;
    });
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();

  async function information(agent) {
    const info = await Booking.findOne({
      person: agent.parameters.name,
      date: agent.parameters.date,
    });
    let response = `Không có thông tin đặt bàn`;

    if (info) {
      response = `Thông tin đặt bàn của bạn là\nTên: ${
        info.person
      }\nNgày: ${moment(info.date).format('DD-MM-YYYY')} vào lúc ${moment(
        info.time
      ).format('hh:mm')}\nSố lượng khách: ${info.guestAmount}\nYêu cầu khác: ${
        info.note
      } `;
    }
    agent.add(response);
    agent.add(agent.consoleMessages[0]);
  }
  intentMap.set('Information', information);

  async function dateTime(agent) {
    const inputDateTime =
      agent.parameters.dateTime['date_time'] || agent.parameters.dateTime;

    if (
      agent.parameters.hasOwnProperty('dateTime') &&
      moment(inputDateTime).isSameOrAfter(moment(new Date()), 'minutes')
    ) {
      const [date, time] = moment(inputDateTime)
        .ceil(30, 'minutes')
        .format('DD-MM-YYYY HH:mm')
        .split(' ');
      const isBooked = await Booking.findOne({
        date,
        time,
      });
      
      if (!isBooked) {
        agent.add(
          `Hiện bạn có thể đặt bàn vào lúc ${time} ngày ${date}.\nBạn hãy nhập số điện thoại vào đây để tiếp tục hoàn tất việc đặt bàn`
        );
        agent.add(
          new Payload(
            agent.UNSPECIFIED,
            {
              richContent: [
                [
                  {
                    type: 'list',
                    event: {
                      parameters: {},
                      languageCode: 'vi',
                      name: 'Booking_next',
                    },
                    title: 'Tiếp tục',
                  },
                  {
                    type: 'list',
                    event: {
                      parameters: {},
                      languageCode: 'vi',
                      name: 'Welcome_again',
                    },
                    title: 'Quay lại',
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
        agent.add(`Thời gian này không có bàn trống hãy chọn thời gian khác`);
      }
    } else {
      let no_context = agent.contexts.filter(
        (context) => context.name === 'pre_booking_dialog_context'
      );

      if (no_context.length > 0) {
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
        agent.add(
          `Vui lòng nhập ngày và giờ hợp lệ 8h-22h (vd : 18h 22-7, ngày mai 17h)`
        );
      }
    }
  }
  intentMap.set('Pre Booking', dateTime);

  async function getRateNumber(agent) {
    if (
      agent.parameters.hasOwnProperty('rate') &&
      agent.parameters.rate > 0 &&
      agent.parameters.rate < 6
    ) {
      agent.consoleMessages.forEach((message) => {
        agent.add(message);
      });
    } else {
      let nocontext = agent.contexts.filter(
        (context) => context.name === 'rate_dialog_context'
      );
      if (nocontext.length > 0) {
        agent.add(agent.consoleMessages[0]);
      } else {
        agent.add(`^^ Chỉ đánh giá từ 1 - 5 thôi bạn nha`);
      }
    }
  }
  intentMap.set('Rate', getRateNumber);

  agent.handleRequest(intentMap);
}

module.exports = { handleWebhook };
