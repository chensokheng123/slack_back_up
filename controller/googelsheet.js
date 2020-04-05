const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');
const config = require('../config/config');

let doc = new GoogleSpreadsheet(config.spreadsheetId);

async function insertToSheet(index, infomation) {
  await doc.useServiceAccountAuth({
    client_email: config.client_email,
    private_key: config.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[index];
  await sheet.addRow(infomation);
}

const createSheet = async (sheetName) => {
  await doc.useServiceAccountAuth({
    client_email: config.client_email,
    private_key: config.private_key,
  });
  const sheet = await doc.addSheet({
    headerValues: ['Sender', 'Messages', 'Date', 'isReply'],
  });
  await sheet.updateProperties({ title: sheetName });
};

module.exports = { insertToSheet, createSheet };
