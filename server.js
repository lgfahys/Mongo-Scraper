const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools
// const axios = require("axios");
// const cheerio = require("cheerio");

// Require models
// const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/mongoHeadlines", {
  useNewUrlParser: true
});

// Connecting htmlRoutes
const htmlRoutes = require("./routes/htmlRoutes");
app.use(htmlRoutes);
const apiRoutes = require("./routes/apiRoutes");
app.use(apiRoutes);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
