var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require models
var db =  require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Connecting htmlRoutes
// app.use(express.static("./routes/htmlRoutes"));

// GET route for scraping nyt website and putting it in to the db
app.get("/scrape", function(req, res) {
  const nyt = "https://www.nytimes.com";

  axios.get(nyt).then(function(response){
      const $ = cheerio.load(response.data);

      $("article").each(function(i, element){
          var result = {};

          result.title = $(this)
              .find("h2")
              .text();
          console.log(result.title); 
          result.link = $(this)
              .find("a")
              .attr("href");
          console.log(result.link);
          result.summary = $(this)
              .find("p") 
              .text()
      
      db.Article.create(result)
          .then(function(dbArticle){
              console.log(dbArticle);
          })
          .catch(function(err) {
              console.log(err);
          });
      });

      console.log("Scrape Completed!");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});