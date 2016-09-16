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

const commands = adminMethods.getCommands();

// // TODO: write the image one of these
// bot.onText(/\/setcommand .+/, (msg, match) => {
//   if (authorizeMsg(msg)) {
//     setCommand(match, "text");
//   }
// });

bot.onText(/^.+$/, (msg, match) => {
  var fromId = msg.from.id;
  console.log('match ==', match);
  if (match[0].match(/^(\/.+?)( |$)/)) { // a command has been found
    const command = match[0].match(/^\/(.+?)( |$)/)[1]; // get the command, drop / and trailing space
    if (adminMethods.adminCommands.indexOf(command) !== -1) {
      // It's an admin command
      // TODO: add authentication
      console.log('firing admin callback')
      adminMethods.adminCallbacks[command](bot, msg);
    } else {
      // It's not an admin command
      console.log('firing generic handler, command ==','"'+ command+'"');
      adminMethods.genericCommandHandler(bot, msg, command);
    }
  } else { // no command has been found
    bot.sendMessage(fromId, "Imagine this is the menu");
  }
});

bot.on('photo', msg => {
  // TODO: AUTH
  // if (adminMethods.auth(msg)) {
    adminMethods.adminCallbacks.setPhotoCommand(bot, msg);
  // }
});
