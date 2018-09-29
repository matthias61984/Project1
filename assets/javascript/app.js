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