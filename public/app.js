loadPage();
renderSavedArticles();

// Grab the articles as a json and renders them on the screen
function renderArticles() {
  $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").prepend(
        "<div class='news-card'>" +
        "<ul class='list-group'>" +
        "<a href='" + data[i].link + "'>" +
        "<li class='list-group-item active' id='article-title'>" + data[i].title + "</a>" + "<button class='btn btn-secondary float-right' id='save-article' data-id=" + data[i]._id + ">Save Article</button></li>" +
        "<li class='list-group-item' id='article-subtitle'>" + data[i].summary + "</li>" +
        "</ul>" +
        "</div>" +
        "<br>"
      )
    }
  });
}

// Grab the saved articles as a json and render them on the screen
function renderSavedArticles() {
  $.getJSON("/articles/saved", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#saved-articles").append(
        "<div class='news-card'>" +
        "<ul class='list-group'>" +
        "<a href='" + data[i].link + "'>" +
        "<li class='list-group-item active' id='article-title'>" + data[i].title + "</a>" + "<button class='btn btn-success float-right' id='add-note' data-toggle='modal' data-target='#add-note-modal' data-id=" + data[i]._id + ">Add/View Note</button>" +
        "<button class='btn btn-danger float-right' style='margin-right: 10px' id='delete-article' data-id=" + data[i]._id + ">Delete</button></li>" +
        "<li class='list-group-item' id='article-subtitle'>" + data[i].summary + "</li>" +
        "</ul>" +
        "</div>" +
        "<br>"
      )
    }
  });
}

// Creating a load page function to determine what to display
function loadPage() {
  $.get("/articles/").then(function (data) {
    if (data && data.length) {
      renderArticles();
    } else {
      emptyMessage();
    }
  });
}

// Creating a function to display that there are no articles to read
function emptyMessage() {
  $("#articles").append("<h2 style='color: #283A6D'>There are no articles to read. Scrape some!</h2>")
}

// When user clicks the 'save article' button
$(document).on("click", "#save-article", function (data) {
  event.preventDefault();
  let thisId = $(this).data().id;
  console.log(thisId)
  $.ajax({
    method: "GET",
    url: `/save/${thisId}`,
  }).then(function () {
    alert("Article Saved!");
    loadPage();
  });
});

// When user clicks the 'clear articles' button
$(document).on("click", "#clear", function () {
  $.ajax({
    method: "GET",
    url: "/clear"
  }).then(function () {
    $("#articles").empty();
    loadPage();
  });
});

// When user clicks 'scrape articles' button
$(document).on("click", "#scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).then(function (data) {
    loadPage();
  })
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      // Get all our notes associated with thearticle
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      }).then(function (data){
        console.log(data);
        $("#saved-notes").empty();
        for (var i = 0; i < data.note.length; i++) {
          $("#saved-notes").append("<div class=row style='margin-right: 30px; margin-left: 30px; margin-top: 5px;'><p style='color: grey; margin-right: 5px;'>" + data.note[i].body + "</p><button class='btn btn-danger'>x</button></div>");
        }
        alert("Note Saved!");
      })
    });
});

// Whenever someone clicks the add note button tag
$(document).on("click", "#add-note", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the button
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // emptying the saved notes div and then displaying all notes
      $("#saved-notes").empty();
      for (var i = 0; i < data.note.length; i++) {
        $("#saved-notes").append("<div class=row style='margin-right: 30px; margin-left: 30px; margin-top: 5px;'><p style='color: grey; margin-right: 5px;'>" + data.note[i].body + "</p><button class='btn btn-danger'>x</button></div>");
      }
      // The title of the article
      $("#note-modal-title").empty();
      $("#note-modal-title").append("Notes for: " + data.title);
      // A button to submit a new note, with the id of the article saved to it
      $(".modal-footer").empty();
      $(".modal-footer").append("<button type= button class='btn btn-secondary' data-dismiss='modal'>Close</button>")
      $(".modal-footer").append("<button type= button class='btn btn-success' id='savenote' data-id ='" + data._id + "'>Save note</button>");
    });
});

    // $(document).on("click", ".deletenote", function() {
    //     event.preventDefault();
    //     let thisId = $(this).attr("data-id");

    //     $.ajax({
    //         method: "PUT",
    //         url: "/notes/" + thisId
    //     })
    //     .then(function(data) {
    //         console.log(data);
    //         $(this).empty();
    //     });