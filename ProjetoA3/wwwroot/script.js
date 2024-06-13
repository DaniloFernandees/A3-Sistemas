$(document).ready(function() {
    loadTasks();

    $('#taskForm').on('submit', function(event) {
        event.preventDefault();
        const task = {
            title: $('#title').val(),
            description: $('#description').val(),
            isCompleted: false
        };

        const taskId = $('#taskId').val();
        if (taskId) {
            task.id = taskId;
            updateTask(task);
        } else {
            createTask(task);
        }
    });

    function loadTasks() {
        $.getJSON('https://localhost:7047/api/tasks', function(tasks) {
            $('#taskList').empty();
            tasks.forEach(function(task) {
                $('#taskList').append(`
                    <li>
                        <span>${task.id}</span>
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <button onclick="editTask(${task.id})">Edit</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    </li>
                `);
            });
        });
    }

    function createTask(task) {
        $.ajax({
            url: 'https://localhost:7047/api/tasks',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(task),
            success: function() {
                loadTasks();
                $('#taskForm')[0].reset();
            },
            error: function(xhr, status, error) {
                console.error('Error creating task:', status, error);
            }
        });
    }

    function updateTask(task) {
        $.ajax({
            url: `https://localhost:7047/api/tasks/${task.id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(task),
            success: function() {
                loadTasks();
                $('#taskForm')[0].reset();
            }
        });
    }

    window.editTask = function(id) {
        $.getJSON(`https://localhost:7047/api/tasks/${id}`, function(task) {
            $('#taskId').val(task.id);
            $('#title').val(task.title);
            $('#description').val(task.description);
        });
    }

    window.deleteTask = function(id) {
        $.ajax({
            url: `https://localhost:7047/api/tasks/${id}`,
            type: 'DELETE',
            success: function() {
                loadTasks();
            }
        });
    }
});
