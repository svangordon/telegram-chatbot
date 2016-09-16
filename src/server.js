// Requires
var mongoose = require('mongoose');
const Command = require('./models.js').Command;
mongoose.connect('mongodb://127.0.0.1:27017/reversobot');

var TelegramBot = require('node-telegram-bot-api');

// move this to config, again
var token = '256121999:AAErcXm0hy-WKttT2uyQ7pjIkCjJsK6JP3s';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

var userMessages = {};

var commands = [/\/reciprocal/, /\/save/, /\/speak/];

const createMenu = () => {
  return "Menu \n Stewed frogs \n pickled bats";
};

// true if msg comes from an authorized user (the client, basically)
const authorizeMsg = () => {
  // TODO: check authorization
  return true
};

const parseSetCommandMsg = (msg) => {
  console.log('parsing msg', msg);
  const parsedMsg = {
    name: msg[0].split(' ')[1],
    resp: msg[0].split(' ').slice(2).join(' ')
  };
  console.log('parsed msg ==', parsedMsg);
  return parsedMsg;
};

const setCommand = command => {
  Command.findOne({'name': command.name}, (err, foundCommand) => {
    if (err) {
      //TODO: some kind of error handling 
    } else if (foundCommand) {
      Object.assign(foundCommand, command);
      foundCommand.save((err) => {
        // TODO: Success handler, i guess? I don't like having to pass around fromId like this
      });
    } else {
      const newCommand = new Command();
      //Object.assign(newCommand, command);
      newCommand.name = command.name;
      newCommand.type = command.type;
      newCommand.resp = command.resp;
      newCommand.save();
    }
  });

};


const handleError = (err, fromId) => {
  const errs = {
    saveCommand: "Sorry, I couldn't save that command. Please try again."
  };
  bot.sendMessage(fromId, errs[err]);
}

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

// TODO: write the image one of these
bot.onText(/\/setcommand .+/, (msg, match) => {
  if (authorizeMsg(msg)) {
    const commandData = parseSetCommandMsg(match);
    commandData.type = "text";
    console.log('setting command', commandData);
    setCommand(commandData);
  }
});

//bot.onText(/^([^\/].+)/, function (msg, match) {
//  var fromId = msg.from.id;
//  var resp = match[0].split('').reverse().join('');
//  bot.sendMessage(fromId, resp);
//})

bot.onText(/^.+$/, (msg, match) => {
  var fromId = msg.from.id;
  if (commands.some((cur) => {
    console.log('evaluating', cur);
    return cur.test(match);
  })) {
    // the user used a command, so don't do anything.
    // Actually, use this spot to write the message to the db
  } else {
    bot.sendMessage(fromId, createMenu());
  }
});

// Any kind of message
//bot.on('message', function (msg) {
//  var fromId = msg.from.id;
//  console.log('bang');
//  if (msg.text.indexOf('/reciprocal') === -1) {
//    bot.sendMessage(fromId, msg.text.split('').reverse().join(''))
//  }
//});
