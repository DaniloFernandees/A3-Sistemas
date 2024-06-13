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
                        <p><strong>${tarefa.nome}</strong> - ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
                    </div>
                `;
                listaTarefas.append(divTarefa);
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    });
});