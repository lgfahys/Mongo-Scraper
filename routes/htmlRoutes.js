const express = require("express");
const db = require("../models");
const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");

const app = express();

// GET route for rendering home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// GET route for rendering saved articles page
app.get("/saved", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/saved.html"));
});

module.exports = app;