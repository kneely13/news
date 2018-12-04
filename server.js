var express = require('express');



var mongoose = require( 'mongoose');
var bodyParser = require("body-parser");

//defining the port 
var PORT = 3000;

// Made public a static folder

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



//defining the express to the varibale named app
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI,{ useNewUrlParser: true });


// Routes

// A GET route for scraping the oneamericannews website

app.get("/scrape", function(req,res) {
    axios.get("https://")
})









//connect to the port 
app.listen( PORT, function() {
    console.log('You are connected on PORT ' + PORT + '...')
});