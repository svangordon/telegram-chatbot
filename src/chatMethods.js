'use strict';
const Message = require('./models.js');

const saveMessage = (msg) => {
  console.log('saving message', msg);
  const newMessage = new Command();
  Object.assign(newCommand, command);
  newMessage.save((err) => {
    if (err) {
      console.log('error saving message');
    }
  });
}

module.exports = {
  saveMessage: saveMessage
}
