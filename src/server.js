'use strict';
// Requires
var mongoose = require('mongoose');
const Command = require('./models.js').Command;
mongoose.connect('mongodb://127.0.0.1:27017/reversobot');

var TelegramBot = require('node-telegram-bot-api');

// move this to config, again
var token = '256121999:AAErcXm0hy-WKttT2uyQ7pjIkCjJsK6JP3s';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

const adminMethods = require('./adminMethods.js');
const chatMethods = require('./chatMethods.js');

bot.onText(/^.+$/, (msg, match) => {
  var fromId = msg.from.id;
//  console.log('match ==', match);
  let command = match[0].match(/^\/(.+?)( |$)/);
  if (command) { // a command has been found
//    console.log('command found, ==', command)
    // command = command[1]; // get the command, drop / and trailing space
    if (adminMethods.adminCommands.indexOf(command[1]) !== -1 && adminMethods.authenticate(msg)) {
      // It's an admin command
//      console.log('firing admin callback')
      adminMethods.adminCallbacks[command[1]](bot, msg);
    } else {
      if (command[1] === 'start') {
        bot.sendMessage(fromId, adminMethods.menu.text);
      }
      // It's not an admin command
//      console.log('firing generic handler, command ==','"'+ command[1]+'"');
      adminMethods.genericCommandHandler(bot, msg, command[1]);
    }
  } else { // no command has been found
    if (match.indexOf('price') !== -1) {
      // hard coding in recognition of price command
      adminMethods.genericCommandHandler(bot, msg, 'price');
      return;
    }
//    console.log('adminMethods.menu ==', adminMethods.menu);
    bot.sendMessage(fromId, adminMethods.menu.text);
  }
});

bot.on('photo', msg => {
  // TODO: AUTH
  // if (adminMethods.auth(msg)) {
    adminMethods.adminCallbacks.setCommand(bot, msg);
  // }
});

bot.on('text', msg => {
  chatMethods.saveMessage(msg);
});
