$(document).ready(function () {
    loadTasks();

    $('#taskForm').on('submit', function (event) {
        event.preventDefault();
        const task = {
            title: $('#title').val(),
            description: $('#description').val(),
            responsible: $('#responsible').val(),
            isCompleted: $('#isCompleted').is(':checked') || false
        };

        const deadDate = $('#deadDate').val();
        if (deadDate) {
            task.deadDate = deadDate;
        }

        const taskId = $('#taskId').val();
        if (taskId) {
            task.id = taskId;
            updateTask(task);
        } else {
            createTask(task);
        }
    });

    function formatDate(dateString) {
        return moment(dateString).format('DD/MM/YYYY HH:MM');
    }

    function loadTasks() {
        $.getJSON('https://localhost:7047/api/tasks', function (tasks) {
            $('#taskList').empty();

            tasks.forEach(function (task) {
                const formattedCreationDate = formatDate(task.creationDate);
                const formattedDeadDate = task.deadDate ? formatDate(task.deadDate) : '';

                if (task.isCompleted) {
                    $('#taskListConc').append(`
                    <li>
                        <span>${task.id}</span>
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p>${task.responsible}</p>
                        <p>${formattedCreationDate}</p>
                        <p>${formattedDeadDate}</p>
                    </li>
                    `);
                } else {
                    $('#taskList').append(`
                    <li>
                        <span>${task.id}</span>
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <p>${task.responsible}</p>
                        <p>${formattedCreationDate}</p>
                        <p>${formattedDeadDate}</p>
                        <button onclick="editTask(${task.id})">Editar</button>
                        <button onclick="deleteTask(${task.id})">Apagar</button>
                    </li>
                `);
                }
            });

        });
    }

    function createTask(task) {
        task.creationDate = new Date();

        $.ajax({
            url: 'https://localhost:7047/api/tasks',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(task),
            success: function () {
                loadTasks();
                $('#taskForm')[0].reset();
                $('#isCompletedContainer').empty();
            },
            error: function (xhr, status, error) {
                console.error('Error creating task:', status, error);
            }
        });
    }

    function updateTask(task) {
        console.log(task);
        $.ajax({
            url: `https://localhost:7047/api/tasks/${task.id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(task),
            success: function () {
                loadTasks();
                $('#taskForm')[0].reset();
                $('#isCompletedContainer').empty();
            }
        });
    }

    window.editTask = function (id) {
        $.getJSON(`https://localhost:7047/api/tasks/${id}`, function (task) {
            $('#taskId').val(task.id);
            $('#title').val(task.title);
            $('#description').val(task.description);
            $('#responsible').val(task.responsible);
            $('#deadDate').val(task.deadDate);

            $('#isCompletedContainer').html(`
                <label for="isCompleted">Completed:</label>
                <input type="checkbox" id="isCompleted" ${task.isCompleted ? 'checked' : ''}>
            `);
        });
    }

    window.deleteTask = function (id) {
        $.ajax({
            url: `https://localhost:7047/api/tasks/${id}`,
            type: 'DELETE',
            success: function () {
                loadTasks();
            }
        });
    }
});
