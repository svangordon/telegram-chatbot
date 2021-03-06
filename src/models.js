var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // Command Schema
  // Keeps tracks of commands, and what they should output
  commandSchema = new Schema({
    name: {
      type: String,
      required: true
    }, // the text to invoke the command
    type: String,
    resp: String
  });

  // Message Schema
  // A log of all of the messages that the bot receives
  messageSchema = new Schema({
    messageId: Number,
    from: Schema.Types.Mixed,
    chat: Schema.Types.Mixed,
    date: Number,
    text: String
  });

module.exports = {
  Command: mongoose.model('Command', commandSchema),
  Message: mongoose.model('Message', messageSchema)
};
