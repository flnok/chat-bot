const uuid = require('uuid');

const config = {
  googleProjectID: process.env.GOOGLE_PROJECT_ID,
  dialogFlowSessionID: uuid.v4(),
  dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE,
  // googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  // googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
  defaultLanguageCode: process.env.DEFAULT_LANGUAGE_CODE,
};

module.exports = config;
