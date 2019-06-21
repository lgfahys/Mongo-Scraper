const express = require("express");
const db = require("../models");
const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");

const app = express();


// Routes

// GET route for scraping nyt website and putting it in to the db
app.get("/scrape", function (req, res) {
    const nyt = "https://www.nytimes.com";

    axios.get(nyt).then(function (response) {
        const $ = cheerio.load(response.data);

        $("article").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .find("h2")
                .text();
            console.log(result.title);
            result.link = nyt + $(this)
                .find("a")
                .attr("href");
            console.log(result.link);
            result.summary = $(this)
                .find("p")
                .text()
            console.log(result.summary);

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });

            db.Article.find({ saved: false })
                .then(function (dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    res.json(err);
                });
        });

        console.log("Scrape Completed!");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    db.Article.find({ saved: false })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for getting all saved Articles from the db
app.get("/articles/saved", function (req, res) {
    db.Article.find({ saved: true })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for deleting a saved Article from the db
app.get("/articles/saved/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    console.log(req.params.id)
    db.Article.deleteOne({ _id: req.params.id })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            console.log({ note: dbNote });
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving an article
app.get("/save/:id", function (req, res) {
    console.log("Saving Article")
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });;
});

// Route for clearing articles (not saved)
app.get("/clear", function (req, res) {
    console.log("Clearing Articles")
    db.Article.deleteMany({ saved: false }, function (error) {
        if (error) {
            console.log(error);
            res.send(error);
        }
    });
    db.Article.find({ saved: false })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for getting notes by id
app.get("/notes/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    console.log(req.params.id)
    db.Note.deleteOne({ _id: req.params.id })
        .then(function (dbNote) {
            // If we were able to successfully find an Note with the given id, send it back to the client
            res.json(dbNote);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

module.exports = app;