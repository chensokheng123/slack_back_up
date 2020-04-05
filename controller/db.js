const { AsyncNedb } = require('nedb-async');

const db = new AsyncNedb({
  filename: 'main.db',
  autoload: true,
});

const storeSheetInfomation = async (sheetName, channelID) => {
  let sheet_index = await db.asyncCount({});
  sheet_index = sheet_index + 1;
  await db.asyncInsert({
    sheet_name: sheetName,
    channel_id: channelID,
    sheet_index,
    last_ts: '0',
  });
};

const findSheet = async (sheet_name) => {
  const sheet = await db.asyncFindOne({ sheet_name });
  return sheet;
};
const findAllSheets = async () => {
  const sheets = await db.asyncFind({});
  return sheets;
};
const updateSheetInformation = async (sheet_name, last_ts) => {
  await db.asyncUpdate(
    { sheet_name },
    {
      $set: { last_ts },
    }
  );
};

module.exports = {
  updateSheetInformation,
  findAllSheets,
  storeSheetInfomation,
  findSheet,
};
