var mongoose = require("mongoose");


//saving reference to schema constructor
var Schema = mongoose.Schema;
// 
var ArticleSchema = new Schema({

    headline: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required:true
    },
// `link` is required and of type String
    link: {
        type: String,
        required: true
    },

    // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

    
});

// This creates our model from the above schema, using mongoose's model method
    var Article = mongoose.model("Article", ArticleSchema);

    //exporting the Article mondle holding the info needed in each article
    module.exports = Article;