const Command = require('./models.js').Command;

// Admin

// true if msg comes from an authorized user (the client, basically)
const authorizeMsg = () => {
  // TODO: check authorization
  return true
};

const setCommand = (bot, msg) => {
  if (msg.text) {
    setTextCommand(bot, msg);
  } else {
    setPhotoCommand(bot, msg);
  }
}

const setPhotoCommand = (bot, msg) => {
  console.log('received photo message, msg ==', msg);
}

const setTextCommand = (bot, msg) => {
  command = {
    name: msg.text.split(' ')[1],
    resp: msg.text.split(' ').slice(2).join(' '),
    type: "text"
  };
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
      Object.assign(newCommand, command);
      newCommand.save();
      // TODO: success handler
    }
  });
};

const handleError = (err, fromId) => {
  const errs = {
    saveCommand: "Sorry, I couldn't save that command. Please try again."
  };
  bot.sendMessage(fromId, errs[err]);
};

const getCommands = () => { //
  return Command.find({}).exec((err, commands) => {
    if (err) {
      console.log('getCommands err:', err);
    }
    return commands;
  });
}

const genericCommandHandler = (bot, msg, commandName) => { // I'm pretty sure that I need to be passing bot here, or else binding it somewhere else
  const fromId = msg.from.id;
  Command.findOne({'name': commandName}, (err, command) => {
    if (err) {
      console.log('error', err);
    }
    if (command) {
      if (command.type === "text") {
        bot.sendMessage(fromId, command.resp);
      } /*else { photos are going to be handled from bot.on('photo')
        bot.sendPhoto(fromId, command.resp);
      }*/
    }
  });
};

const adminCallbacks = {
  setcommand: setCommand,
  setPhotoCommand: setPhotoCommand
};

const adminCommands = [
  'setcommand'
];

module.exports = {
  authorizeMsg: authorizeMsg,
  setCommand: setCommand,
  getCommands: getCommands,
  adminCallbacks: adminCallbacks,
  handleError: handleError,
  adminCommands: adminCommands,
  genericCommandHandler: genericCommandHandler
};
