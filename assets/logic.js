// Giphy API key: g1Can9EJuWv920hp8qsAkS5yv0CX99se

///// VARIABLES /////

// Array to hold the topics (button choices)
var topics = ["Pokemon", "Naruto", "One Piece", "Spirited Away", "Evangelion"];

///// Functions /////

// This renders the buttons from the default topics array and then any new buttons added by the user's form input
function renderButtons() {
  $("#buttons-view").empty();

  for (var i = 0; i < topics.length; i++) {
    var newButton = $("<button>")
      .addClass(
        "btn mx-1 my-1 text-lavender-muted bg-lavender-muted btn-hover ajax-btn"
      )
      .text(topics[i])
      .attr("data-name", topics[i]);
    $("#buttons-view").append(newButton);
  }
}

function getThoseGifs() {
  var animeName = $(this).attr("data-name");

  console.log(animeName);

  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    animeName +
    "&api_key=g1Can9EJuWv920hp8qsAkS5yv0CX99se&limit=12";

  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var results = response.data;

    console.log(results);

    console.log(results[1].images.original.url);

    console.log(results[1].images.fixed_height.url);

    for (var j = 0; j < results.length; j++) {

        var col4Div = $("<div>").addClass("col-md-4");
        var cardDiv = $("<div>").addClass("card mb-4 shadow-sm");
        var imgDiv = $("<img>").attr("src", results[j].images.original_still.url).attr("alt", "it's a gif").addClass("card-img-top gif").attr("data-still", results[j].images.original_still.url).attr("data-animate", results[j].images.original.url).attr("data-state", "still");
        var cardBody = $("<div>").addClass("card-body");
        var link = $("<a>").attr("href", results[j].url).attr("target", "_blank").addClass("giphy-link");
        
        var linkImg = $("<img>").addClass("link-image").attr("src", "assets/images/link.png").attr("style", "width: 20px; height: 20px;").attr("data-toggle", "tooltip").attr("title", "GIPHY");

        var p = $("<p>").addClass("card-text text-center").html("Rating: " + "<h2>" + results[j].rating.toUpperCase() + "</h2>");
        
        $(link).append(linkImg);
        $(cardBody).append(p, link);
        $(cardDiv).append(imgDiv, cardBody);
        $(col4Div).append(cardDiv);

        $("#cards-view").append(col4Div);

    }
  });
}

function changeGifState() {
    var state = $(this).attr("data-state");

    if (state === "still") {
        $(this).attr("data-state", "animate");
        $(this).attr("src", $(this).attr("data-animate"));
    } else {
        $(this).attr("data-state", "still");
        $(this).attr("src", $(this).attr("data-still"));
    }
}

///// USER INTERACTIONS /////

// This on("click") pulls the user's form input and adds it to the topics array, creating a new button
$("#add-topic").on("click", function(event) {
  event.preventDefault();

  var userAnime = $("#topic-input")
    .val()
    .trim();

  topics.push(userAnime);

  renderButtons();
});

// This allows the user to click a button to start the ajax call
$(document).on("click", ".ajax-btn", getThoseGifs);

// This allows the user to click gifs and change the state between still and animated
$(document).on("click", ".gif", changeGifState);

///// FUNCTION CALLS /////

renderButtons();
