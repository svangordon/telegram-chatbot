'use strict';
const moment = require('moment');
const Message = require('./models.js').Message;

const saveMessage = (msg) => {
  console.log('saving message', msg);
  const newMessage = new Message();
  Object.assign(newMessage, msg);
  newMessage.save((err) => {
    if (err) {
      console.log('error saving message');
    }
  });
}

const createChatLog = () => {
  return Message.find({})
    .sort({date: 1})
    .exec((err, messages) => {
      // is this doing anything? don't think so...
    //   //console.log('found messages', messages);
    //   const output = messages.map((msg) => {
    //     return {
    //       date: moment.unix(msg.date).format(),
    //       from: msg.from.id,
    //       username: msg.from.username,
    //       text: msg.text
    //     }
    //   }).map((msg) => {
    //     return "\n" + "From:" + " " + msg.username + "\n" + msg.text + "\n" + msg.date + "\n" + "=========";
    //   }).join('');
    // // bot.sendMessage(msg.from.id, output);
  });
};

const formatChatLog = (chatArr) => {
  return chatArr.map((msg) => {
    return {
      date: moment.unix(msg.date).format(),
      from: msg.from.id,
      username: msg.from.username,
      text: msg.text
    }
  }).map((msg) => {
    return "\n" + "From:" + " " + msg.username + "\n" + msg.text + "\n" + msg.date + "\n" + "=========";
  }).join('');
}

const getChatLog = (bot, msg) => {
  console.log(createChatLog());
  createChatLog().then((chatLog) => {
    console.log('getchatlog', chatLog);
    bot.sendMessage(msg.from.id, formatChatLog(chatLog));
  });
}

module.exports = {
  saveMessage: saveMessage,
  createChatLog: createChatLog,
  getChatLog: getChatLog
}
