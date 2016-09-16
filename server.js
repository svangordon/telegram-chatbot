var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/reversobot');

var TelegramBot = require('node-telegram-bot-api');

var token = '256121999:AAErcXm0hy-WKttT2uyQ7pjIkCjJsK6JP3s';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

var userMessages = {};

var commands = [/\/reciprocal/, /\save/, /\speak/];

// // Matches /echo [whatever]
bot.onText(/\/reciprocal (\d+)$/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = 1 / parseInt(match[1]);
  bot.sendMessage(fromId, resp);
});

bot.onText(/\menu/, function (msg) {
  var fromId = msg.from.id;
  var resp = "Commands: \n \/remember to save a message \n \/remind to repeat a message \n Or, send me any message to see it reversed.";
  bot.sendMessage(fromId, resp);
});

bot.onText(/\/remember (.+$)/, function (msg, match) { 
  var fromId = msg.from.id;
  userMessages[fromId] = match[1];
  bot.sendMessage(fromId, "Got it. Tell me to \/remind you later."); 
});

bot.onText(/\/remind/, function (msg) { 
  var fromId = msg.from.id;
  var message = userMessages[fromId];
  var resp = message ? "Earlier, you asked me to remember this message:\n" + message : "I'm sorry, I can't remember your message.";
  bot.sendMessage(fromId, resp);
});

bot.onText(/^([^\/].+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[0].split('').reverse().join('');
  bot.sendMessage(fromId, resp);
})

// Any kind of message
//bot.on('message', function (msg) {
//  var fromId = msg.from.id;
//  console.log('bang');
//  if (msg.text.indexOf('/reciprocal') === -1) {
//    bot.sendMessage(fromId, msg.text.split('').reverse().join(''))
//  }
//});
