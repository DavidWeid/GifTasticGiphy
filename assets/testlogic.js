// Giphy API key: g1Can9EJuWv920hp8qsAkS5yv0CX99se

///// VARIABLES /////

// Array to hold the topics (button choices)
var topics = ["Pokemon", "Naruto", "One Piece", "Spirited Away", "Evangelion"];
var animeName = "";

// This variable holds the offset value for getThoseGifs (only for search query, not random query)
var offSetBy = 0;

// This variable holds the currently inactive button
var currInactive = null;

///// Functions /////

// This renders the buttons from the default topics array and then any new buttons added by the user's form input
function renderButtons() {
  $("#buttons-view").empty();

  // data-name for the ajax call and id for the button active/inactive state
  for (var i = 0; i < topics.length; i++) {
    var newButton = $("<button>")
      .addClass(
        "btn mx-1 my-1 text-lavender-muted bg-lavender-muted btn-hover ajax-btn"
      )
      .text(topics[i])
      .attr("data-name", topics[i])
      .attr("id", topics[i]);
    $("#buttons-view").append(newButton);
  }
}

// This function generates 12 random gifs on each button click (lacks much meta data on gifs)
function getRandomGifs() {
  var animeName = $(this).attr("data-name");

  console.log(animeName);

  var queryURL =
    "https://api.giphy.com/v1/gifs/random?tag=" +
    animeName +
    "&api_key=g1Can9EJuWv920hp8qsAkS5yv0CX99se&rating=r";

  for (var k = 0; k < 12; k++) {
    $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
      var results = response.data;

      console.log(results);
      console.log(results.images.original.url);
      console.log(results.id);

      var col4Div = $("<div>").addClass("col-md-4");
      var cardDiv = $("<div>").addClass("card mb-4 shadow-sm");
      var imgDiv = $("<img>")
        .attr("src", results.images.original_still.url)
        .attr("alt", "it's a gif")
        .addClass("card-img-top gif")
        .attr("data-still", results.images.original_still.url)
        .attr("data-animate", results.images.original.url)
        .attr("data-state", "still");
      var cardBody = $("<div>").addClass("card-body");
      var link = $("<a>")
        .attr("href", results.url)
        .attr("target", "_blank")
        .addClass("giphy-link");

      var linkImg = $("<img>")
        .addClass("link-image")
        .attr("src", "assets/images/link.png")
        .attr("style", "width: 20px; height: 20px;")
        .attr("data-toggle", "tooltip")
        .attr("title", "GIPHY");

      var favToggle = $("<button>")
        .addClass("btn")
        .attr("data-toggle", "button")
        .attr("aria-pressed", "false")
        .attr("autocomplete", "off")
        .text("A");

      var p = $("<p>")
        .addClass("card-text text-center")
        .html(results.title);

      $(link).append(linkImg);
      $(cardBody).append(p, link, favToggle);
      $(cardDiv).append(imgDiv, cardBody);
      $(col4Div).append(cardDiv);

      $("#cards-view").append(col4Div);
    });
  }
}

// This function gets 12 gifs using the search query: 12 gifs change based on the offset number (gives more meta data)
// Gifs are displayed in a card-component: gif-image at the top of the card and gif-information at the bottom of the card
// Three gifs are shown per line
// Gifs are given attributes used to control the still / animated state
function getThoseGifs() {
  // Clear the "12 more" button if it exists when a topic button is clicked (vs the "12 more" button being clicked)
  $(".more-button").empty();

  console.log(animeName);

  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    animeName +
    "&api_key=g1Can9EJuWv920hp8qsAkS5yv0CX99se&limit=12&offset=" +
    offSetBy;

  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var results = response.data;

    console.log(results);

    console.log(results[1].images.original.url);

    console.log(results[1].images.fixed_height.url);

    for (var j = 0; j < results.length; j++) {
      var col4Div = $("<div>").addClass("col-md-4");
      var cardDiv = $("<div>").addClass("card mb-4 shadow-sm");
      var imgDiv = $("<img>")
        .attr("src", results[j].images.original_still.url)
        .attr("alt", "it's a gif")
        .addClass("card-img-top gif")
        .attr("data-still", results[j].images.original_still.url)
        .attr("data-animate", results[j].images.original.url)
        .attr("data-state", "still");
      var cardBody = $("<div>").addClass("card-body");
      var link = $("<a>")
        .attr("href", results[j].url)
        .attr("target", "_blank")
        .addClass("giphy-link");

      var linkImg = $("<img>")
        .addClass("link-image")
        .attr("src", "assets/images/link.png")
        .attr("style", "width: 20px; height: 20px;")
        .attr("data-toggle", "tooltip")
        .attr("title", "GIPHY");

      var favToggle = $("<button>")
        .addClass("btn bg-lavender-muted float-right")
        .attr("data-toggle", "button")
        .attr("aria-pressed", "false")
        .attr("autocomplete", "off")
        .attr("data-gifId", results[j].id);

      var p = $("<p>")
        .addClass("card-text text-center")
        .html("Rating: " + "<h2>" + results[j].rating.toUpperCase() + "</h2>");

      $(link).append(linkImg);
      $(cardBody).append(p, link, favToggle);
      $(cardDiv).append(imgDiv, cardBody);
      $(col4Div).append(cardDiv);

      $("#cards-view").append(col4Div);
    }

    // This section adds a "12 more" button with the class click-for-more
    // moreButtonDiv is centered and in its own row
    var moreButtonDiv = $("<div>").addClass(
      "row more-button mx-auto text-center"
    );
    var moreGifsButton = $("<button>")
      .addClass(
        "btn mx-1 my-1 text-lavender-muted bg-lavender-muted btn-hover click-for-more"
      )
      .text("12 more")
      .attr("data-name", animeName);
    moreButtonDiv.append(moreGifsButton);
    $("#cards-view").append(moreButtonDiv);
  });
}

// Function sets the current button inactive / reactivates last button
function btnState() {
  // For the second and beyond topic-button clicked
  // Activate the previous button, set the current button to disabled
  if (currInactive !== null) {
    var lastButton = document.getElementById(currInactive);
    console.log(lastButton);
    $(lastButton).attr("disabled", false);
    currInactive = $(this).attr("id");
    $(this).attr("disabled", true);

    // For the very first topic-button clicked
    // Disable the first button and set it to currInactive (currInactive goes from null to the id of the clicked button)
  } else if (currInactive === null) {
    currInactive = $(this).attr("id");
    console.log(currInactive);
    $(this).attr("disabled", true);
  }
}

// Function gets the name of the button clicked and routes to the ajax call
function setTheStage() {
  animeName = $(this).attr("data-name");
  console.log(animeName);
  getThoseGifs();
  console.log(offSetBy);
  // $(lastButton).attr("disabled", true);
}

// Function to change offset number (used with getThoseGifs)
function changeOffSet() {
  offSetBy += 12;
  console.log(offSetBy);
  animeName = $(this).attr("data-name");
  console.log(animeName);
  $(".more-button").empty();
  getThoseGifs();
}

// Function allows user to click gifs to play / pause them
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

  // $("#topic-input").empty();
  $("#topic-input").val("");
});

// This allows the user to click a button to start the ajax call
// Run either getThoseGifs (search query) or getRandomGifs (random query)
$(document).on("click", ".ajax-btn", setTheStage);
$(document).on("click", ".ajax-btn", btnState);
// $(document).on("click", ".ajax-btn", getRandomGifs);

// This allows the user to click gifs and change the state between still and animated
$(document).on("click", ".gif", changeGifState);

// This allows the user to look for the next 12 gifs using the search call (not the random call)
$(document).on("click", ".click-for-more", changeOffSet);

///// FUNCTION CALLS /////

renderButtons();
