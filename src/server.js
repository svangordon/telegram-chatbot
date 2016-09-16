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
  if (match[0].match(/^\/.+? /)) { // a command has been found
    const command = match.match(/^\/.+? /)[0].slice(1, -1); // get the command, drop / and trailing space
    if (adminMethods.adminCommands.indexOf(command) !== -1) {
      // It's an admin command
      // TODO: add authentication
      console.log('firing admin callback')
      adminMethods.adminCallbacks[command](bot, msg);
    } else {
      // It's not an admin command
      console.log('firing generic handler')
      adminMethods.genericCommandHandler(bot, msg, command);
    }
  } else { // no command has been found
    bot.sendMessage(fromId, "Imagine this is the menu");
  }
  // for (let i = 0; i < commands.length; i++) { // check all of our commands to see if any match. possibly needs to be streamlined (maybe just check for /)
  //   if (match.indexOf('/' + commands[i].name) !== -1) { // we've found a command; check if it's an admin command
  //     if (adminMethods.adminCallbacks[i]) {
  //       adminMethods.adminCallbacks[i](msg)
  //     } else {
  //       adminMethods.genericCommandHandler(msg);
  //     }
  //   }
  // }
  // if (commands.some((cur) => {
  //   return match.indexOf(cur.name) !== -1;
  // })) {
  //   adminMethods.commandCallbacks[]
  // } else {
  //   bot.sendMessage(fromId, createMenu());
  // }
});
