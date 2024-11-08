// script.js

// Funções para manipular o modal de exclusão
function confirmarExclusao(taskId) {
    document.getElementById('confirmDelete').setAttribute('data-task-id', taskId);
    document.getElementById('deleteModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// Função para excluir uma tarefa
function excluirTarefa() {
    const taskId = document.getElementById('confirmDelete').getAttribute('data-task-id');
    fetch(`tasks/${taskId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                carregarTarefas();
                fecharModal();
                alert("Tarefa excluída com sucesso!");
            } else {
                console.error('Erro ao excluir tarefa:', response.status);
                alert('Erro ao excluir tarefa. Por favor, tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar dados do formulário:', error);
            alert('Erro ao enviar dados do formulário. Por favor, tente novamente mais tarde.');
        });
}

// Função para editar uma tarefa
function editarTarefa(taskId) {
    fetch(`tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            window.location.href = `index2.html?id=${task.id}&description=${task.description}§or=${task.sector}&user=${task.user}&priority=${task.priority}&status=${task.status}`;
        })
        .catch(error => {
            console.error('Erro ao editar tarefa:', error);
            alert('Erro ao editar tarefa. Por favor, tente novamente mais tarde.');
        });
}

// Função para alterar o status de uma tarefa
function alterarStatus(taskId, newStatus) {
    fetch(`tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => {
            if (response.ok) {
                carregarTarefas();
            } else {
                console.error('Erro ao atualizar status da tarefa:', response.status);
                alert('Erro ao atualizar status da tarefa. Por favor, tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar dados do formulário:', error);
            alert('Erro ao enviar dados do formulário. Por favor, tente novamente mais tarde.');
        });
}

// Função para atualizar o status de uma tarefa
function atualizarStatus(taskId) {
    const newStatus = document.getElementById(`status-${taskId}`).value;
    alterarStatus(taskId, newStatus);
}

// Função para carregar as tarefas da API
function carregarTarefas() {
    fetch('tasks.json') // Substitua por sua API real se houver
        .then(response => response.json())
        .then(tasks => {
            document.getElementById('todo').innerHTML = '';
            document.getElementById('in-progress').innerHTML = '';
            document.getElementById('done').innerHTML = '';

            tasks.forEach(task => {
                const taskCard = document.createElement('div');
                taskCard.classList.add('task-card');
                taskCard.innerHTML = `
                    <h3><strong>Descrição:</strong> ${task.description}</h3>
                    <p><strong>Setor:</strong> ${task.sector}</p>
                    <p><strong>Prioridade:</strong> ${task.priority}</p>
                    <p><strong>Responsável:</strong> ${task.user}</p>
                    <div class="task-actions">
                        <button class="edit-btn" onclick="editarTarefa(${task.id})">Editar</button>
                        <button class="delete-btn" onclick="confirmarExclusao(${task.id})">Excluir</button>
                        <select id="status-${task.id}" onchange="atualizarStatus(${task.id})">
                            <option value="a_fazer" ${task.status === 'a_fazer' ? 'selected' : ''}>A Fazer</option>
                            <option value="fazendo" ${task.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
                            <option value="pronto" ${task.status === 'pronto' ? 'selected' : ''}>Pronto</option>
                        </select>
                        <button class="update-status-btn" onclick="atualizarStatus(${task.id})">Alterar Status</button>
                    </div>
                `;

                switch (task.status) {
                    case 'a_fazer':
                        document.getElementById('todo').appendChild(taskCard);
                        break;
                    case 'fazendo':
                        document.getElementById('in-progress').appendChild(taskCard);
                        break;
                    case 'pronto':
                        document.getElementById('done').appendChild(taskCard);
                        break;
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar tarefas:', error);
            alert('Erro ao carregar tarefas. Por favor, tente novamente mais tarde.');
        });
}

// Carrega as tarefas ao carregar a página
window.addEventListener('load', carregarTarefas);

// Função para carregar dados de usuários no formulário de cadastro de tarefas
function carregarUsuarios() {
    // Pega o select do usuário no formulário
    const userSelect = document.getElementById('user');

    // Faz uma requisição para obter a lista de usuários
    fetch('users.json') // Substitua por sua API real se houver
        .then(response => response.json())
        .then(users => {
            // Limpa as opções existentes
            userSelect.innerHTML = '<option value="">Selecione um usuário</option>';

            // Adiciona cada usuário ao select
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id; // Assumindo que cada usuário tem um ID único
                option.text = user.name;
                userSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            // Exibe uma mensagem de erro para o usuário
            alert('Erro ao carregar usuários. Por favor, tente novamente mais tarde.');
        });
}

// Carrega os usuários ao carregar a página
window.addEventListener('load', carregarUsuarios);

// Função para validar o formulário de cadastro de usuário
function validarFormularioUsuario() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');

    // Validação do nome
    if (nameInput.value.trim() === "") {
        nameError.textContent = "O nome é obrigatório.";
        nameError.style.display = "block";
        return false;
    } else {
        nameError.style.display = "none";
    }

    // Validação do email
    if (emailInput.value.trim() === "") {
        emailError.textContent = "O email é obrigatório.";
        emailError.style.display = "block";
        return false;
    } else {
        emailError.style.display = "none";
    }

    return true;
}

// Função para enviar o formulário de cadastro de usuário
function enviarFormularioUsuario(event) {
    event.preventDefault();

    // Valida o formulário
    if (!validarFormularioUsuario()) {
        return;
    }

    // Obtém os dados do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Faz uma requisição para enviar os dados para a API
    fetch('users.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email })
    })
        .then(response => {
            if (response.ok) {
                // Limpa o formulário
                document.getElementById('userForm').reset();

                // Exibe uma mensagem de sucesso
                alert("Usuário cadastrado com sucesso!");
            } else {
                console.error('Erro ao cadastrar usuário:', response.status);
                // Exibe uma mensagem de erro para o usuário
                alert('Erro ao cadastrar usuário. Por favor, tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar dados do formulário:', error);
            // Exibe uma mensagem de erro para o usuário
            alert('Erro ao enviar dados do formulário. Por favor, tente novamente mais tarde.');
        });
}

// Adiciona um evento de envio ao formulário de cadastro de usuário
const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', enviarFormularioUsuario);

// Função para validar o formulário de cadastro de tarefas
function validarFormularioTarefa() {
    const descriptionInput = document.getElementById('description');
    const sectorInput = document.getElementById('sector');
    const userSelect = document.getElementById('user');
    const descriptionError = document.getElementById('descriptionError');
    const sectorError = document.getElementById('sectorError');
    const userError = document.getElementById('userError');

    // Validação da descrição
    if (descriptionInput.value.trim() === "") {
        descriptionError.style.display = "block";
        return false;
    } else {
        descriptionError.style.display = "none";
    }

    // Validação do setor
    if (sectorInput.value.trim() === "") {
        sectorError.style.display = "block";
        return false;
    } else {
        sectorError.style.display = "none";
    }

    // Validação do usuário
    if (userSelect.value === "") {
        userError.style.display = "block";
        return false;
    } else {
        userError.style.display = "none";
    }

    return true;
}

// Função para enviar o formulário de cadastro de tarefas
function enviarFormularioTarefa(event) {
    event.preventDefault();

    // Valida o formulário
    if (!validarFormularioTarefa()) {
        return;
    }

    // Obtém os dados do formulário
    const description = document.getElementById('description').value;
    const sector = document.getElementById('sector').value;
    const user = document.getElementById('user').value;
    const priority = document.getElementById('priority').value;

    // Faz uma requisição para enviar os dados para a API
    fetch('tasks.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: description, sector: sector, user: user, priority: priority })
    })
        .then(response => {
            if (response.ok) {
                // Limpa o formulário
                document.getElementById('taskForm').reset();

                // Exibe uma mensagem de sucesso
                alert("Tarefa cadastrada com sucesso!");
            } else {
                console.error('Erro ao cadastrar tarefa:', response.status);
                // Exibe uma mensagem de erro para o usuário
                alert('Erro ao cadastrar tarefa. Por favor, tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar dados do formulário:', error);
            // Exibe uma mensagem de erro para o usuário
            alert('Erro ao enviar dados do formulário. Por favor, tente novamente mais tarde.');
        });
}

// Adiciona um evento de envio ao formulário de cadastro de tarefas
const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', enviarFormularioTarefa);