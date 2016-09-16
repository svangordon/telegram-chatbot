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

const sendMessage = (bot, msg) => {
  //console.log('msg.txt ==', msg.text.split(' '), msg.text.split(' ').slice());
  const target = new RegExp(msg.text.split(' ')[1], "i");
  const messageText = msg.text.split(' ').slice(2).join(' ');
  console.log('msgtxt ==', messageText);
  Message.findOne({'from.username': target}, (err, msg) => {
    console.log('found ', msg);
    bot.sendMessage(msg.from.id, messageText);
  });
};

const clearChatLog = (bot, msg) => {
  Message.db.db.dropCollection('messages', (err, result) => {
    bot.sendMessage(msg.from.id,"Chat log cleared");
  });
}

module.exports = {
  saveMessage: saveMessage,
  createChatLog: createChatLog,
  getChatLog: getChatLog,
  downloadChatLog: downloadChatLog,
  sendMessage: sendMessage,
  clearChatLog: clearChatLog
}
