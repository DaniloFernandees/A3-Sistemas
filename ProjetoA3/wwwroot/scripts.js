$(document).ready(function() {
    const formTarefa = $('#formTarefa');
    const listaTarefas = $('#listaTarefas');


    $.ajax({
        url: '/api/tarefas',
        method: 'GET',
        success: function(tarefas) {
            tarefas.forEach(function(tarefa) {
                const divTarefa = `
                    <div class="tarefa">
                        <p>${tarefa.id}<strong>${tarefa.Title}</strong>${tarefa.Description} - ${tarefa.isComplete ? 'Concluída' : 'Pendente'}</p>
                    </div>
                `;
                listaTarefas.append(divTarefa);
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    });
    
    formTarefa.on('submit', function(event) {
        event.preventDefault();

        const nome = $('#nome').val();
        const concluida = $('#concluida').is(':checked');
        const descricao = $('#descricao').val();

        $.ajax({
            url: '/api/tarefas',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                Title: nome,
                Description: descricao,
                isComplete: concluida
            }),
            success: function(tarefa) {
                const novaTarefa = `
                    <div class="tarefa">
                        <p><strong>${tarefa.nome}</strong> - ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
                    </div>
                `;
                listaTarefas.append(novaTarefa);

                $('#nome').val('');
                $('#concluida').prop('checked', false);
            },
            error: function(xhr, status, error) {
                console.error('Erro ao adicionar tarefa:', error);
            }
        });
    });
});