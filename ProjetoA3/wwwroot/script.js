let taskId = null;
$(document).ready(function () {
    loadTasks();

    $("#taskForm").on("submit", function (event) {
        event.preventDefault();
        const task = {
            title: $("#title").val(),
            description: $("#description").val(),
            responsible: $("#responsible").val(),
            isCompleted: $("#isCompleted").is(":checked") || false
        };

        const deadDate = $("#deadDate").val();
        if (deadDate) {
            task.deadDate = deadDate;
        }

        if (taskId) {
            task.id = taskId;
            updateTask(task);
        } else {
            createTask(task);
        }
        closeModal();
    });

    function formatDate(dateString) {
        return moment(dateString).format("DD/MM/YYYY");
    }

    function loadTasks() {
        $.getJSON("https://localhost:7047/api/tasks", function (tasks) {
            $("#taskList").empty();
            $("#taskListConc").empty();

            tasks.forEach(function (task) {
                const formattedCreationDate = formatDate(task.creationDate);
                const formattedDeadDate = task.deadDate ? formatDate(task.deadDate) : "";

                if (task.isCompleted) {
                    $("#taskListConc").append(`
                        <div class="card">
                            <span>#${task.id}</span>
                            <div class="card-header">
                                <div class="badge">
                                    <p>${task.responsible}</p>
                                </div>
                                <div class="card-options">                                
                                    <button class="option-return" onclick="markCompleted(${task.id}, false)"><ion-icon name="reload-outline"></ion-icon></button>
                                </div>
                            </div>
                            <h5>${task.title}</h5>
                            <p>${task.description}</p>
                            <div class="date-create"><ion-icon name="document"></ion-icon> ${formattedCreationDate}</div>
                            ${task.deadDate ? `                                
                                <div class="date-dead"><ion-icon name="alarm"></ion-icon> `+ formattedDeadDate + `</div>  
                            `: ``}
                        </div>
                        `);
                } else {
                    $("#taskList").append(`
                        <div class="card">
                            <span>#${task.id}</span>
                            <div class="card-header">
                                <div class="badge">
                                    <p>${task.responsible}</p>
                                </div>
                                <div class="card-options">                                
                                    <button class="option-completed" onclick="markCompleted(${task.id}, true)"><ion-icon name="checkmark-outline"></ion-icon></button>
                                    <button class="option-edit" onclick="editTask(${task.id})"><ion-icon name="create"></ion-icon></button>
                                    <button class="option-delete" onclick="deleteTask(${task.id})"><ion-icon name="trash"></ion-icon></button>
                                </div>
                            </div>
                            <h5>${task.title}</h5>
                            <p>${task.description}</p>
                            <div class="date-create"><ion-icon name="document"></ion-icon> ${formattedCreationDate}</div>
                            ${task.deadDate ? `                                
                                <div class="date-dead"><ion-icon name="alarm"></ion-icon> `+ formattedDeadDate + `</div>  
                            `: ``}
                        </div>
                    `);
                }
            });

        }).fail(function (jqxhr, textStatus, error) {
            const err = textStatus + ", " + error;
            console.error("Request Failed: " + err);
            toastr.error("Falha ao carregar tarefas: " + err, "Erro");
        });
    }

    function createTask(task) {
        task.creationDate = new Date();

        $.ajax({
            url: "https://localhost:7047/api/tasks",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                loadTasks();
                $("#taskForm")[0].reset();
                $("#isCompletedContainer").empty();
                toastr.success("Tarefa criada com sucesso!", "Sucesso");
            },
            error: function (xhr, status, error) {
                console.error("Erro ao criar tarefa:", status, error);
                toastr.error("Erro ao criar tarefa: " + error, "Erro");
            }
        });
    }

    function updateTask(task) {
        $.ajax({
            url: `https://localhost:7047/api/tasks/${task.id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(task),
            success: function () {
                loadTasks();
                $("#taskForm")[0].reset();
                $("#isCompletedContainer").empty();
                toastr.success("Tarefa atualizada com sucesso!", "Sucesso");
            },
            error: function (xhr, status, error) {
                console.error("Erro ao atualizar tarefa:", status, error);
                toastr.error("Erro ao atualizar tarefa: " + error, "Erro");
            }
        });
    }
    window.markCompleted = function (id, isCompleted) {
        console.log(isCompleted)
        $.ajax({
            url: `https://localhost:7047/api/tasks/complete/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(isCompleted),
            success: function () {
                loadTasks();
                toastr.success(`Tarefa ${isCompleted ? 'concluída' : 'retornada'} com sucesso!`, "Sucesso");
            },
            error: function (xhr, status, error) {
                console.error(`Erro ao ${isCompleted ? 'concluir' : 'retornar'} tarefa:`, status, error);
                toastr.error(`Erro ao ${isCompleted ? 'concluir' : 'retornar'} tarefa:` + error, "Erro");
            }
        });
    }
    window.editTask = function (id) {
        $.getJSON(`https://localhost:7047/api/tasks/${id}`, function (task) {
            taskId = task.id;
            $("#title").val(task.title);
            $("#description").val(task.description);
            $("#responsible").val(task.responsible);

            if (task.deadDate) {
                const formattedDate = new Date(task.deadDate).toISOString().split("T")[0];
                $("#deadDate").val(formattedDate);
            }

            $("#isCompletedContainer").html(`
                <label for="isCompleted">Concluída:</label>
                <input type="checkbox" id="isCompleted" ${task.isCompleted ? "checked" : ""}>
            `);
            openModal("edit");
        }).fail(function (jqxhr, textStatus, error) {
            const err = textStatus + ", " + error;
            console.error("Falha ao carregar tarefa para edição: " + err);
            toastr.error("Falha ao carregar tarefa para edição: " + err, "Erro");
        });
    }

    window.deleteTask = function (id) {
        Swal.fire({
            title: "Você tem certeza que deseja apagar essa tarefa?",
            text: "Não poderá ser desfeito",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, apagar!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `https://localhost:7047/api/tasks/${id}`,
                    type: "DELETE",
                    success: function () {
                        loadTasks();

                        toastr.success("Tarefa apagada com sucesso!", "Sucesso");
                    },
                    error: function (xhr, status, error) {
                        console.error("Erro ao apagar tarefa:", status, error);
                        toastr.error("Erro ao apagar tarefa: " + error, "Erro");
                    }
                });
            }
        });
    };


    function openModal(mode = "new") {
        $("#taskModal").show().css("display", "flex");
        if (mode == "new") {
            taskId = null;
            $("#modal-header-title").text("Nova Tarefa");
            $("#taskForm")[0].reset();
            $("#isCompletedContainer").empty();
        }
        else {
            $("#modal-header-title").text("Editar Tarefa");
        }
    }

    function closeModal() {
        $("#taskModal").hide();
    }

    $("#open-modal").click(function () {
        openModal();
    });

    $("#cancel-modal , .pelicula-modal").click(function () {
        closeModal();
    });

});
