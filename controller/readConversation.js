const { WebClient } = require('@slack/web-api');
const _ = require('lodash');
const config = require('../config/config');
const {
  findAllSheets,
  storeSheetInfomation,
  findSheet,
  updateSheetInformation,
} = require('./db');
const { insertToSheet, createSheet } = require('./googelsheet');
const web = new WebClient(config.slackBotToken);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getAllChannels = async () => {
  const res = await web.conversations.list();
  let { channels } = res;
  channels = channels.filter((channel) => channel.is_member);
  for (channel of channels) {
    await sleep(1000);
    const existSheet = await findSheet(channel.name);
    if (!existSheet) {
      await createSheet(channel.name);
      await storeSheetInfomation(channel.name, channel.id);
      console.log('🦄 make sheet');
    } else {
      console.log('🦄xx sheet already exist');
    }
  }
};
const getMessages = async () => {
  await getAllChannels();
  let lookUpUser = {};
  let username = '';
  const sheets = await findAllSheets();
  for (sheet of sheets) {
    await sleep(1000);
    console.log('🦄 running in ', sheet.sheet_name);
    let oldest = sheet.last_ts;
    const { messages } = await web.conversations.history({
      channel: sheet.channel_id,
      oldest,
    });
    if (messages.length != 0) {
      for (message of messages) {
        await sleep(10);
        if (lookUpUser[message.user]) {
          username = lookUpUser[message.user];
        } else {
          username = await getUserName(message.user);
          lookUpUser[message.user] = username;
        }

        if (_.has(message, 'thread_ts')) {
          const replies = await web.conversations.replies({
            channel: sheet.channel_id,
            ts: message.ts,
          });
          for (reply of replies.messages) {
            await sleep(5);
            if (lookUpUser[reply.user]) {
              username = lookUpUser[reply.user];
            } else {
              username = await getUserName(reply.user);
              lookUpUser[reply.user] = username;
            }
            await insertToSheet(sheet.sheet_index, {
              Sender: username,
              Messages: reply.text,
              Date: new Date(reply.ts * 1000),
              isReply: 'Yes',
            });
          }
        } else {
          await insertToSheet(sheet.sheet_index, {
            Sender: username,
            Messages: message.text,
            Date: new Date(message.ts * 1000),
            isReply: 'No',
          });
        }
      }
      await updateSheetInformation(sheet.sheet_name, messages[0].ts);
    }
    console.log('Data in ', sheet.sheet_name, ' is up to date');
  }
  console.log('finish getting data');
};
const getUserName = async (userID) => {
  const { user } = await web.users.info({
    user: userID,
  });
  return user.name;
};

module.exports = { getMessages };
