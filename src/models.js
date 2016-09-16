var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // Command Schema
  // Keeps tracks of commands, and what they should output
  commandSchema = new Schema({
    name: String, // the text to invoke the command
    type: String,   
    resp: String 
  });

module.exports = {
  Command: mongoose.model('Command', commandSchema)
};
