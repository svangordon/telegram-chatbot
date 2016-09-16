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
  Message.find({}).sort({date: 1}, (err, messages) => {
    console.log('found messages', messages);
    const output = messages.map((msg) => {
      return {
        date: moment(msg.date).format(),
        from: msg.from.id,
        username: msg.from.username,
        text: msg.from.username
      }
    });
    console.log('mapped msgs to', output);
  });
};

createChatLog();

module.exports = {
  saveMessage: saveMessage
}
