var path = require("path");

module.exports = function (app) {
    // * A GET Route to `/survey` which should display the survey page.
    app.get("/saved", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/saved.html"));
    });
    // * A default, catch-all route that leads to `index.html` which displays the home page.
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
};