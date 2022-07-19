const { WebhookClient } = require('dialogflow-fulfillment');

function handleWebhook(req, res) {
  if (!req.body.queryResult.fulfillmentMessages) return;
  req.body.queryResult.fulfillmentMessages =
    req.body.queryResult.fulfillmentMessages.map((m) => {
      if (!m.platform) m.platform = 'PLATFORM_UNSPECIFIED';
      return m;
    });
  const agent = new WebhookClient({ request: req, response: res });

  let intentMap = new Map();
  // const payload = `[
  //   {
  //     richContent: [
  //       [
  //         {
  //           event: {
  //             parameters: {},
  //             languageCode: 'vi',
  //             name: 'Booking',
  //           },
  //           type: 'list',
  //           title: 'Tôi muốn đặt bàn',
  //         },
  //         {
  //           title: 'Tôi muốn xem Menu',
  //           type: 'list',
  //           event: {
  //             languageCode: 'vi',
  //             name: 'Menu',
  //             parameters: {},
  //           },
  //         },
  //       ],
  //     ],
  //   },
  // ];`;
  // function booking(agent) {
  //   if (agent) agent.add(payload);
  // }
  // intentMap.set('Booking', booking);
  console.log(agent.consoleMessages);
  agent.handleRequest(intentMap);
}

module.exports = { handleWebhook };
