'use strict';
const Command = require('./models.js').Command;

// Admin

// true if msg comes from an authorized user (the client, basically)
const authorizeMsg = () => {
  // TODO: check authorization
  return true
};

// const setCommand = (bot, msg) => {
//   if (msg.text) {
//     setTextCommand(bot, msg);
//   } else {
//     setPhotoCommand(bot, msg);
//   }
// }

const setPhotoCommand = (bot, msg) => {
  console.log('received photo message, msg ==', msg);
}

const setCommand = (bot, msg) => {
  let command;
  if (msg.text) {
    command = {
      name: msg.text.split(' ')[1],
      resp: msg.text.split(' ').slice(2).join(' '),
      type: "text"
    };
    saveCommand(command);
  }
  if (msg.photo) {
    // TODO : some kind of handler for photo but no caption
    command = {
      name: msg.caption,
      resp: null,
      type: 'photo'
    }
    const fileId = msg.photo.slice(-1)[0].file_id;
    // now, download that file
    // console.log("dl'ing photo, command ==", command);
    bot.getFile(fileId).then((file) => {
      console.log('file to dl ==', file);
      bot.downloadFile(file.file_id, './photos');
      command.resp = './photos/' + file.file_path.split('/')[1];
      console.log('command ==', command);
      saveCommand(command);
    });
    // bot.sendPhoto(msg.from.id, 'photo/file_8.jpg');
    //bot.downloadFile(command.resp, '../photos'); //TODO: constant for photos directory
  }
};

const saveCommand = (command) => {
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
      } else { 
        bot.sendPhoto(fromId, command.resp);
      }
    }
  });
};

const adminCallbacks = {
  setcommand: setCommand,
  setCommand: setCommand,
  setPhotoCommand: setPhotoCommand
};

const adminCommands = [
  'setcommand'
];

const createMenu = () => {
  console.log('get commands = ', getCommands());
}

createMenu();

module.exports = {
  authorizeMsg: authorizeMsg,
  setCommand: setCommand,
  getCommands: getCommands,
  adminCallbacks: adminCallbacks,
  handleError: handleError,
  adminCommands: adminCommands,
  genericCommandHandler: genericCommandHandler,
  createMenu: createMenu
};
