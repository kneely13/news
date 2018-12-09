var express = require('express');
var mongoose = require( 'mongoose');
var bodyParser = require("body-parser");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require ('express-handlebars');
var routes = require('./routes/index')
var path = require('path');
//defining the port 
var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//defining the express to the varibale named app
var app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true });

// set up to handle handle-bars
app.engine("handlebars", exphbs({ defaultLayout: "main" , layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use("/", routes)

//catch 404 and foward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})


// A GET route for scraping the oneamericannews website
app.get("/scrape", function(req,res) {
    //first, grab the body of the html with axios
    axios.get("https://www.oann.com/").then(function(response) {
    //now i load that into cheerio and save it to $ for a shorthand selector    
    var $ = cheerio.load(response.data);

    //now, i grab every h2 within the article tag, and do the following:
    $("article h2").each(function(i, element) {
        //now i save the empty result object 
        var result = {};

        //now i will add the text and href of every link, and save them as proporties of the result object
        result.title = $(this)
        .children("a")
        .text();

        result.link = $(this)
        .children("a")
        .attr("href")


        //here i create a new article using the object of result above this, which was built from scraping
        db.Article.create(result)
            .then(function(dbArticle) {
                //view the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        //now i send a message to the client telling it the scrape is complete
        res.send("Scrape Is Now Complete")
    });
});




//now this new route will be to get all the articles from the db
app.get("/articles", function(req,res) {
    //Now i finish the route so it grabs all the articles
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        //If error occurs, this catch will send back to the client 
        res.json(err);
    });
});



// Now this new Route for grabbing a specific Article by id, populate it with it's note
app.get('/articles/:id', function(req, res) {
   // Finish the route so it finds one article using the req.params.id,
  db.Article.findOne({_id: req.params.id })
   // and run the populate method with "note",
   .populate('note')
  // then responds with the article with the note included
.then(function (article) {
       res.json(article)
   }).catch(function(err) {
        res.json(err)
   });  
});



// New Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    //save new note which is posted to the Notes Collection
    db.Note.create(req, res)
    // then find an article from the req.params.id
    .then(function() {
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {note: dbNote._id}, { new: true })
    })
    //update its "note" proporty with the _id of the new note
    .then(function(dbArticle) {
    })
    .catch(function (err) {
        res.json(err)
    })
});

//connect to the port / starting the server
app.listen( PORT, function() {
    console.log('You are connected on PORT ' + PORT + '...')
});