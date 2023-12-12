function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === '1' && password === '1') {
        document.getElementById('loginResult').innerText = 'Login bem-sucedido!';
        document.getElementById('loginResult').style.color = 'green';
        window.location.href = 'uPrincipal.html';
    } else {

        document.getElementById('loginResult').innerText = 'Login inválido. Tente novamente.';
        document.getElementById('loginResult').style.color = 'red';
    }
}

function redirecionarParaAdicionarTarefa() {
    window.location.href = 'uNovaTarefa.html';
}

function sair() {
    window.location.href = 'UPrincipal.html';
}

function logoff () {
    window.location.href = 'index.html';
}


function excluirTarefa() {
    const listaDeTarefas = document.getElementById('listaDeTarefas');

    const tarefasSelecionadas = document.querySelectorAll('.tarefa input[type="checkbox"]:checked');
    if (tarefasSelecionadas.length === 0) {
        alert('Selecione pelo menos uma tarefa para excluir.');
        return;
    }

    if (confirm('Tem certeza de que deseja excluir as tarefas selecionadas?')) {

        tarefasSelecionadas.forEach(checkbox => {
            const tarefaElement = checkbox.closest('.tarefa');
            listaDeTarefas.removeChild(tarefaElement);
        });

        atualizarArmazenamentoLocal();
    }
}

function atualizarArmazenamentoLocal() {
    const listaDeTarefas = document.getElementById('listaDeTarefas');
    const tarefas = Array.from(listaDeTarefas.children).map(tarefaElement => {
        const titulo = tarefaElement.querySelector('strong').innerText;
        const descricao = tarefaElement.querySelector('p:nth-child(2)').innerText;
        const dataVencimento = tarefaElement.querySelector('p:nth-child(3)').innerText.replace('Data de Vencimento: ', '');

        return { titulo, descricao, dataVencimento };
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function toggleSelecaoTarefa(tarefaElement) {
    tarefaElement.classList.toggle('tarefa-selecionada');
}

function criarTarefa(titulo, descricao, dataVencimento) {
    const tarefa = document.createElement('div');
    tarefa.classList.add('tarefa');
    tarefa.innerHTML = `
        <strong>${titulo}</strong>
        <p>${descricao}</p>
        <p><strong>Data de Vencimento:</strong> ${dataVencimento}</p>
    `;
    tarefa.addEventListener('click', () => toggleSelecaoTarefa(tarefa));

    return tarefa;
}

function adicionarTarefa() {
    const titulo = document.getElementById('tituloTarefa').value;
    const descricao = document.getElementById('descricaoTarefa').value;
    const dataVencimento = document.getElementById('dataVencimentoTarefa').value;

    if (titulo && descricao && dataVencimento) {
        const novaTarefa = {
            titulo: titulo,
            descricao: descricao,
            dataVencimento: dataVencimento
        };

        salvarTarefaLocalmente(novaTarefa);

        clearForm();

        carregarTarefas();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function salvarTarefaLocalmente(tarefa) {
    const tarefasExistem = localStorage.getItem('tarefas');
    const tarefas = tarefasExistem ? JSON.parse(tarefasExistem) : [];

    tarefas.push(tarefa);

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    alert('Tarefa adicionada com sucesso!');
    window.location.href = 'uPrincipal.html';
}

function carregarTarefas() {
    const listaDeTarefas = document.getElementById('listaDeTarefas');

    listaDeTarefas.innerHTML = '';

    const tarefasExistem = localStorage.getItem('tarefas');
    const tarefas = tarefasExistem ? JSON.parse(tarefasExistem) : [];

    // Ordenar as tarefas por data de vencimento
    tarefas.sort((a, b) => {
        const dataA = new Date(a.dataVencimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();
        const dataB = new Date(b.dataVencimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).getTime();

        return dataA - dataB;
    });

    tarefas.forEach(tarefa => {
        const tarefaElement = criarTarefaElemento(tarefa);
        listaDeTarefas.appendChild(tarefaElement);
    });
}



function criarTarefaElemento(tarefa) {
    const tarefaElement = document.createElement('div');
    tarefaElement.classList.add('tarefa');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => toggleSelecaoTarefa(tarefaElement));

    tarefaElement.appendChild(checkbox);

    const conteudoTarefa = document.createElement('div');
    conteudoTarefa.innerHTML = `
        <p><strong>Título: </strong>${tarefa.titulo}</p>
        <p>${tarefa.descricao}</p>
        <p><strong>Data de Vencimento:</strong> ${tarefa.dataVencimento}</p>
    `;

    tarefaElement.appendChild(conteudoTarefa);

    return tarefaElement;
}

window.onload = function() {
    carregarTarefas();
};

document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#dataVencimentoTarefa", {
        dateFormat: "d/m/Y",
        defaultDate: "today",
    });
});