var config = {
  apiKey: "AIzaSyDTAsxLUqJlhWu-SWkG-Ilsd8-BZFstq-g",
  authDomain: "didit-32ed0.firebaseapp.com",
  databaseURL: "https://didit-32ed0.firebaseio.com",
  projectId: "didit-32ed0",
  storageBucket: "didit-32ed0.appspot.com",
  messagingSenderId: "78574523160"
};
firebase.initializeApp(config);

var database = firebase.database();

function renderTodos(list, addresses) {
    $("#toDoList").empty();
    for (var i = 0; i < list.length; i++) {
      var toDoItem = $("<li>");
      toDoItem.text(list[i]);
      var toDoClose = $("<button>");
      toDoClose.attr("data-to-do", i);
      toDoClose.addClass("btn btn-danger complete");
      toDoClose.text("X");
      toDoClose.attr("data-address", addresses[i])
      toDoItem = toDoItem.append(toDoClose);
      $("#toDoList").append(toDoItem);
    }
  }

  $("#addToDo").on("click", function(event) {
    event.preventDefault();
    var address = "" 
    if (!($("#addressInput").val().trim().length < 1)) {
      address = $("#addressInput").val().trim();
    } else {
      address = "video";
    }
    console.log(address);
    addresses.push(address);
    var toDoTask = $("#toDoInput").val().trim();
    list.push(toDoTask);
    renderTodos(list, addresses);
    localStorage.setItem("todolist", JSON.stringify(list));
    localStorage.setItem("addressList", JSON.stringify(addresses));
    $("#toDoInput").val("");
    $("#addressInput").val("");
  });

  $(document).on("click", ".complete", function() {
    var toDoNumber = $(this).attr("data-to-do");
    list.splice(toDoNumber, 1);
    addresses.splice(toDoNumber,1);
    renderTodos(list,addresses);
    localStorage.setItem("todolist", JSON.stringify(list));
    localStorage.setItem("addressList", JSON.stringify(addresses));
  });

  var list = JSON.parse(localStorage.getItem("todolist"));
  if (!Array.isArray(list)) {
    list = [];
  }

  var addresses = JSON.parse(localStorage.getItem("addressList"));
  if(!Array.isArray(addresses)) {
    addresses = [];
  }


  
  renderTodos(list, addresses);

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
var start = "4004 Carmel Springs Way";
 
var end = '8990 Miramar Rd #140, San Diego, CA 92126'

      function initMap() {
      var markerArray = [];
      // Instantiate a directions service.
      var directionsService = new google.maps.DirectionsService;

      // Create a map and center it on Manhattan.
      var map = new google.maps.Map(document.getElementById('itemDisplay'), {
        zoom: 20,
        center: {lat: 32.7157, lng: 117.1611}
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
    }

    function calculateAndDisplayRoute(directionsDisplay, directionsService,
        markerArray, stepDisplay, map) {
      // First, remove any existing markers from the map.
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }

      // Retrieve the start and end locations and create a DirectionsRequest using
      // DRIVING directions.
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

  //Firebase Code Start
    $("#updateHome").on("click", function(event) {
      event.preventDefault();
      start = $("#homeInput").val();
       database.ref().set(
       {
         Home : start
       });
       $("#homeInput").val("");

      $("#addressDisplay").text(start);
    })

    database.ref().on("value" , function() {
      initMap();
    })

    if($("#0").attr("data-to-do") === "video"){
      $("#directionDisplay").empty();
      var form = $("<form>");
    var button = $("<button>");
    button.text("Search").attr("id" ,"Search").attr("type" , "button");
    form.append("<input type=text id = video>");
    form.append(button);
    $("#directionDisplay").append(form);
    }

    else
    {
      $("#directionDisplay").empty();
      end = $($("#0").attr("data-address"));
      initMap();
    }

  //Firebase Code End

