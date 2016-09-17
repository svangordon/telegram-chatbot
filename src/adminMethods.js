'use strict';
const Command = require('./models.js').Command;
const chatMethods = require('./chatMethods');
// Admin


const setCommand = (bot, msg) => {
  let command;
  if (msg.text) {
    command = {
      name: msg.text.split(' ')[1],
      resp: msg.text.split(' ').slice(2).join(' ').replace(/\|/g, '\n'),
      type: "text"
    };
    saveCommand(command, bot, msg);
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
      //console.log('file to dl ==', file);
      bot.downloadFile(file.file_id, './photos');
      command.resp = './photos/' + file.file_path.split('/')[1];
      //console.log('command ==', command);
      saveCommand(command, bot, msg);
    });
  }
};

const saveCommand = (command, bot, msg) => {
  Command.findOne({'name': command.name}, (err, foundCommand) => {
    if (err) {
      bot.sendMessage(msg.from.id, "Error saving /" + command.name)
    } else if (foundCommand) {
      Object.assign(foundCommand, command);
      foundCommand.save((err) => {
        bot.sendMessage(msg.from.id, "Updated command /" + command.name)
        createMenu();
      });
    } else {
      const newCommand = new Command();
      Object.assign(newCommand, command);
      newCommand.save(() => {
        bot.sendMessage(msg.from.id, "Saved new command /" + command.name)
        createMenu();
      });
    }
  });
};

const deleteCommand = (bot, msg) => {
  const command = msg.text.split(' ')[1];
  Command.remove({name: command}, (err) => {
    if (err) {
      bot.sendMessage(msg.from.id, "Sorry, couldn't delete /" + command);
    } else {
      bot.sendMessage(msg.from.id, "/" + command +" deleted");
      createMenu();
    }
  });

}

const getCommands = () => { //
  return Command.find({}).exec((err, commands) => {
    if (err) {
      //console.log('getCommands err:', err);
    }
    return commands;
  });
}

const genericCommandHandler = (bot, msg, commandName) => { // I'm pretty sure that I need to be passing bot here, or else binding it somewhere else
  const fromId = msg.from.id;
  Command.findOne({'name': commandName}, (err, command) => {
    if (err) {
      //console.log('error', err);
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
  deletecommand: deleteCommand,
  deleteCommand: deleteCommand,
  getchatlog: chatMethods.getChatLog,
  downloadchatlog: chatMethods.downloadChatLog,
  sendmessage: chatMethods.sendMessage,
  clearchatlog: chatMethods.clearChatLog
};

const adminCommands = [
  'setcommand',
  'deletecommand',
  'getchatlog',
  'downloadchatlog',
  'sendmessage',
  'clearchatlog'
];

const createMenu = () => {
  Command.find({}).exec((err, commands) => {
    menu.text = 'Menu:' + commands.map((command) => '\n\/' + command.name).join('');
    //console.log('menu.text ==', menu.text);
  });
}

const authenticate = (msg) => {
  return whitelistedUsers.indexOf(msg.from.username) !== -1;
}

const whitelistedUsers = ['Frankendracula', 'Tourney15K'];

let menu = {}; // somewhat hackishly making this an object, so it's pass by ref
createMenu();

module.exports = {
  setCommand: setCommand,
  getCommands: getCommands,
  adminCallbacks: adminCallbacks,
  adminCommands: adminCommands,
  genericCommandHandler: genericCommandHandler,
  createMenu: createMenu,
  menu: menu,
  authenticate: authenticate
};
