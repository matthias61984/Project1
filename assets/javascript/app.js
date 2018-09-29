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

  $("#addToDo").on("click", function(event) {
    event.preventDefault();
    var toDoTask = $("#toDoInput").val().trim();
    list.push(toDoTask);
    renderTodos(list);
    localStorage.setItem("todolist", JSON.stringify(list));
    $("#toDoInput").val("");
  });

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
 var tag = $("<script>");

 tag.attr("src" , "https://www.youtube.com/iframe_api");
 //var firstScriptTag = document.getElementsByTagName('script')[0];
 //firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 $("head").append(tag);

var vidID = "";

  $(document).on("click", "#Search" , function(event) {
    event.preventDefault();
    
     var search = $("#video").val();
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

 
  
    var form = $("<form>");
    var button = $("<button>");
    button.text("Search").attr("id" ,"Search").attr("type" , "button");
    form.append("<input type=text id = video>");
    form.append(button);
    $("#directionDisplay").append(form);
    console.log(form);


 //End of Youtoube API