// getting all articles and converting to html
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append(
            "<ul class='list-group'>" +
            "<a href='" + data[i].link + "'>" +
            "<li class='list-group-item active'>" + data[i].title + "<button class='btn btn-secondary float-right' id='save-article'>Save Article</button></li>" +
            "</a>" +
            "<li class='list-group-item'>" + data[i].summary + "</li>" +
            "</ul>" +
            "<br>"
        )
    }
});

// when user clicks the save article button
$(document).on("click", "#save-article", function () {

});

// when user clicks the clear articles button
$(document).on("click", "#clear", function () {
    $("#articles").empty();
    $("#articles").append(
        "<h1 style='color:white'>Looks like you haven't scraped any articles yet!</h1>"
    )
});

// when user scrapes new articles
$(document).on("click", "#scrape", function () {

});