require('dotenv').config();
const cred = require(process.env.KEYFILENAME);
const config = {
  client_email: cred.client_email,
  private_key: cred.private_key,
  spreadsheetId: process.env.SHEETID,
  slackBotToken: process.env.SLACK_BOT_TOKEN,
};
module.exports = config;
