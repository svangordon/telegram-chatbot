'use strict';
const moment = require('moment');
const Message = require('./models.js').Message;
const fs = require('fs');

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
  // console.log(createChatLog());
  createChatLog().then((chatLog) => {
    // console.log('getchatlog', chatLog);
    bot.sendMessage(msg.from.id, formatChatLog(chatLog));
  });
}

const downloadChatLog = (bot, msg) => {
  createChatLog().then((chatLog) => {
    fs.writeFile('./chatlog.txt', formatChatLog(chatLog), (err) => {
      bot.sendDocument(msg.from.id, './chatlog.txt');
    });
  });
}

module.exports = {
  saveMessage: saveMessage,
  createChatLog: createChatLog,
  getChatLog: getChatLog
}
