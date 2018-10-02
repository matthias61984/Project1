// Build to do list
function renderTodos(list) {
    $("#toDoList").empty();
    for (var i = 0; i < list.length; i++) {
      var toDoItem = $("<li>");
      toDoItem.text(list[i]);
      var toDoClose = $("<button>");
      toDoClose.attr("data-to-do", i);
      toDoClose.addClass("btn btn-danger complete");
      toDoClose.text("X");
      toDoItem = toDoItem.append(toDoClose);
      $("#toDoList").append(toDoItem);
    }
  }
// Add item to do todo list using local storage
  $("#addToDo").on("click", function(event) {
    event.preventDefault();
    var toDoTask = $("#toDoInput").val().trim();
    list.push(toDoTask);
    renderTodos(list);
    localStorage.setItem("todolist", JSON.stringify(list));
    $("#toDoInput").val("");
  });

// On click, remove item from todo list and from localstorage
  $(document).on("click", ".complete", function() {
    var toDoNumber = $(this).attr("data-to-do");
    list.splice(toDoNumber, 1);
    renderTodos(list);
    localStorage.setItem("todolist", JSON.stringify(list));
  });

  var list = JSON.parse(localStorage.getItem("todolist"));
  if (!Array.isArray(list)) {
    list = [];
  }

  renderTodos(list);

 //Youtube API Calls

 //Adds the youtoube API script tag
 var tag = $("<script>");
 tag.attr("src" , "https://www.youtube.com/iframe_api");
 $("head").append(tag);

  // makes a video ID variable
  var vidID = "";

  //click function for the button with the Search ID
  $(document).on("click", "#Search" , function(event) {
    event.preventDefault();
    
     var search = $("#video").val();

  //Searches for a video with the similar name as to what is entered and returns and plays the first one
   $.ajax({
 url: "https://www.googleapis.com/youtube/v3/search?q=" + search + "&maxResults=1&part=snippet&key=AIzaSyBuZheeR3N1k1UietgzIOlPCFi53bd8Xcw",
 method: "GET",
 dataType : "jsonp"
}).then(function(response) {
$("#itemDisplay").empty();
 vidID = response.items[0].id.videoId;
 var video = $("<iframe>");
 video.attr("height" , "100%").attr("width" , "100%");
 video.attr("src" ," http://www.youtube.com/embed/" + vidID +"?enablejsapi=1");
 $("#itemDisplay").append(video);
});

});

 
  
    //makes a form so i could test the search function of the video player
    var form = $("<form>");
    var button = $("<button>");
    button.addClass("btn btn-primary");
    button.text("Search").attr("id" ,"Search").attr("type" , "button");
    form.append("<input type=text id = video>");
    form.append(button);
    $("#directionDisplay").append(form);
    console.log(form);


 //End of Youtoube API

 /////              <-- google maps API call portion -->               /////


      // hardcoded starting address (eventually this address will be replaced by users input)
      var str = '3734 Merrimac Ave San Diego CA 92117'
      var homeLat = "";
      var homeLong = "";

    // ajax call to return the lat and long of the code above
      $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+str.replace(/ /g , "+")+"&key=AIzaSyBuZheeR3N1k1UietgzIOlPCFi53bd8Xcw",
        method: "GET"
      }).then (function (response){
        homeLat = result.geometry.location.lat
        homeLong = result.geometry.location.lng
        console.log(response);
      })



      // hard coded beginning and ending of the route 
var start = '3734 Merrimac Ave, San Diego, CA 92117'
var end = '8990 Miramar Rd #140, San Diego, CA 92126'

      function initMap() {
      var markerArray = [];
      // Instantiate a directions service.
      var directionsService = new google.maps.DirectionsService;

      // Create a map and center it on Manhattan.
      var map = new google.maps.Map(document.getElementById('itemDisplay'), {
        zoom: 20,
        center: {lat: homeLat, lng: homeLong}
      });

      // Create a renderer for directions and bind it to the map.
      var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

      // Instantiate an info window to hold step text.
      var stepDisplay = new google.maps.InfoWindow;

      // Display the route between the initial start and end selections.
      calculateAndDisplayRoute(
          directionsDisplay, directionsService, markerArray, stepDisplay, map);
      // Listen to change events from the start and end lists.
      var onChangeHandler = function() {
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
      };
      // document.getElementById('start').addEventListener('change', onChangeHandler);
      // document.getElementById('end').addEventListener('change', onChangeHandler);
    }

    function calculateAndDisplayRoute(directionsDisplay, directionsService,
        markerArray, stepDisplay, map) {
      // First, remove any existing markers from the map.
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }

      // Retrieve the start and end locations and create a DirectionsRequest using
      // WALKING directions.
      directionsService.route({
        origin: start, //document.getElementById('start').value,
        destination: end, //document.getElementById('end').value,
        travelMode: 'DRIVING'
      }, function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === 'OK') {
          // document.getElementById('warnings-panel').innerHTML =
          //     '<b>' + response.routes[0].warnings + '</b>';
          directionsDisplay.setDirections(response);
          showSteps(response, markerArray, stepDisplay, map);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }

    function showSteps(directionResult, markerArray, stepDisplay, map) {
      // For each step, place a marker, and add the text to the marker's infowindow.
      // Also attach the marker to an array so we can keep track of it and remove it
      // when calculating new routes.
      var myRoute = directionResult.routes[0].legs[0];
      for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
            stepDisplay, marker, myRoute.steps[i].instructions, map);
        var directionText = myRoute.steps[i].instructions;
        var directionDiv = $("<div>");
        var stepNumber = i + 1 + ".";
        directionDiv.html(stepNumber + directionText);
        $("#directionDisplay").append(directionDiv);
      }
    }

    function attachInstructionText(stepDisplay, marker, text, map) {
      google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
      });
    }