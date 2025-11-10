const taskInput = document.getElementById('taskInput');
const dataEhoraInput = document.getElementById('dataEhoraInput');
const taskList = document.getElementById('taskList');

window.onload = loadTasks;

function addTask() {
  const text = taskInput.value.trim();
  const dataEhora = dataEhoraInput.value;

  if (!text || !dataEhora) {
    alert('Preencha a descrição e o prazo da tarefa!');
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    dataEhora: dataEhora,
    situacao: false
  };

  createTaskElement(task);
  saveTask(task);

  taskInput.value = '';
  dataEhoraInput.value = '';
  taskInput.focus();
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
  li.dataset.id = task.id;

  const dataEhoraDate = new Date(task.dataEhora.replace('T', ' ') + ':00');
  const horaNow = new Date();
  const atrasado = !task.situacao && dataEhoraDate < horaNow;
  const formatodataEhora = dataEhoraDate.toLocaleString('pt-BR');

  li.innerHTML = `
    <div class="d-flex align-items-center flex-grow-1">
      <input type="checkbox" class="form-check-input me-2" ${task.situacao ? 'checked' : ''} onchange="toggleTask(${task.id})">
      <span class="task-text ${task.situacao ? 'checked' : ''}">${task.text}</span>
    </div>
    <div class="text-end">
      <span class="dataEhora">Prazo: ${formatodataEhora}</span>
      ${atrasado ? '<span class="late">(Atrasado)</span>' : ''}
      <button class="btn btn-sm btn-danger ms-2" onclick="removeTask(${task.id})">Excluir</button>
    </div>
  `;

  taskList.appendChild(li);
}

function toggleTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updated = tasks.map(t => {
    if (t.id === id) t.situacao = !t.situacao;
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(updated));
  refreshList();
}

function removeTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updated = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(updated));
  refreshList();
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function refreshList() {
  taskList.innerHTML = '';
  loadTasks();
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(createTaskElement);
}
