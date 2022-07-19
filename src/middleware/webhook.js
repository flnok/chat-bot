const { WebhookClient } = require('dialogflow-fulfillment');
const Booking = require('../models/Booking');
const moment = require('moment');

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

  agent.handleRequest(intentMap);
}

module.exports = { handleWebhook };
