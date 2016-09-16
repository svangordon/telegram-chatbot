const Command = require('./models.js').Command;

// Admin

// true if msg comes from an authorized user (the client, basically)
const authorizeMsg = () => {
  // TODO: check authorization
  return true
};

const setCommand = (command, type) => {
  command = {
    name: command[0].split(' ')[1],
    resp: command[0].split(' ').slice(2).join(' '),
    type: type
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
      } else {
        bot.sendPhoto(fromId, command.resp);
      }
    }
  });
};

const adminCallbacks = {
  setcommand: setCommand
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
