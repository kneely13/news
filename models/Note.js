var mongoose = require("mongoose");

// Saving a reference to the Schema constructor
var Schema = mongoose.Schema;

//create a new noteSchema object
var NoteSchema = new Schema ({
    type: String,
    body: String
});

//used the mongoose model method, the schema above creates the model
var Note = mongoose.model("Note", NoteSchema);

//use the model name Note from our named Note.js while this js file represents the info making up the Note modle.
module.exports=Note;