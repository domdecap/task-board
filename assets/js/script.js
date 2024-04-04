// let taskList = []
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));


// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1
    }
    else {
        nextId++
    }
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}



// Todo: create a function to create a task card


function createTaskCard(task) {
    const taskCard = `
      <div id="${task.id}" class="card task-card mb-3" data-id="${task.id}">
        <div class="card-header">
          <h5 class="card-title">${task.title}</h5>
          <button type="button" class="btn-close delete-task" aria-label="Close"></button>
        </div>
        <div class="card-body">
          <p class="card-text">${task.description}</p>
          <p class="card-text">Deadline: ${task.date}</p>
        </div>
      </div>`;
    return taskCard;
}




// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        switch (task.status) {
            case "to-do":
                $("#todo-cards").append(createTaskCard(task))
                break;
            case "in-progress":
                $("#in-progress-cards").append(createTaskCard(task))
                break;
            case "done":
                $("#done-cards").append(createTaskCard(task))
                break;

            default:
                break;
        }
    });
    $('.task-card').draggable({
        helper: "clone",
        stack: ".task-card",
        // revert:"invalid"
    })
    // $('.lane').droppable({
    //     drop: function (event, ui){
    //         $(this)
    //         $(ui.draggable)
    //     }
    // })
}




// Todo: create a function to handle adding a new task
function handleAddTask(event) {


    let task = {
        id: generateTaskId(),
        title: $("#task-title").val(),
        date: $("#datepicker").val(),
        description: $("#task-desc").val(),
        status: "to-do"
    }
    taskList.push(task)
    localStorage.setItem("tasks", JSON.stringify(taskList))
    // $("#todo-cards").append(createTaskCard(task))
    renderTaskList();



}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).closest('.task-card').data('id');
    
    taskList = taskList.filter(task => task.id !== taskId);
    
    localStorage.setItem("tasks", JSON.stringify(taskList));
    
    renderTaskList(); 
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    console.log(taskId)

    const targetLane = $(this).closest('.lane').attr('id');
    console.log(targetLane)

    for (var task of taskList) {
        if (task.id == taskId) {
            task.status = targetLane
        }

        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();

    }
}



function clearForm() {
    $('#task-title').val('');
    $('#task-desc').val('');
    $('#datepicker').val('');
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $("#theSubmit").on("click", function () {
        handleAddTask();
        clearForm();
    });
    renderTaskList();
    // handleDrop();
    $('.lane').droppable({
        accept: ".task-card",
        drop: handleDrop
    });
    $(document).on('click','.delete-task', handleDeleteTask);
});
