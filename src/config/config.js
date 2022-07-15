const uuid = require('uuid');

module.exports = {
  googleProjectID: process.env.GOOGLE_PROJECT_ID,
  dialogFlowSessionID: uuid.v4(),
  dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: JSON.parse(process.env.GOOGLE_PRIVATE_KEY),
  defaultLanguageCode: process.env.DEFAULT_LANGUAGE_CODE,
  mongoURI: process.env.MONGODB_URI,
};
