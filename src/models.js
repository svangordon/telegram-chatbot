var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // Command Schema
  // Keeps tracks of commands, and what they should output
  commandSchema = new Schema({
    commandWord: String, // the text to invoke the command
    resp: {
      text: String,
      image: String // filepath to the image
    }
  });

module.exports = {
  Command: mongoose.model('Command', commandSchema)
};
