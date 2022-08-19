const uuid = require('uuid');
const { config } = require('dotenv');
config();

module.exports = {
  googleProjectID: process.env.GOOGLE_PROJECT_ID,
  dialogFlowSessionID: uuid.v4(),
  dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: JSON.parse(process.env.GOOGLE_PRIVATE_KEY),
  defaultLanguageCode: 'vi',
  mongoURI: process.env.MONGODB_URI,
  secret: process.env.SECRET,
};
