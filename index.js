const getTasks = async () => {
    const response = await fetch('http://localhost:3000/tasks');
    const data = await response.json();
    data.forEach((value, key) => {
        localStorage.setItem(value.id, JSON.stringify(value));
    });
}

const createTaskLi = (element) => {
    const li = document.createElement('li');
    li.setAttribute('id', `task-${element.id}`);
    li.innerHTML = `<p id="taskTitle-${element.id}">${element.title}</p>
    <input type="checkbox" id="completed-${element.id}" onclick="changeStatus(${element.id})" ${element.completed ? 'checked' : ''}>
    <button class="delete" id="delete-${element.id}" onclick="deleteTask(${element.id})">Delete</button>
    <button class="edit" id="edit-${element.id}" onclick="changeSaveButton(${element.id})">Edit</button>`;
    return li;
}

const changeSaveButton = (id) => {
    const editForm = document.getElementById('task-edit-form');
    editForm.classList.add('show'); // Mostrar el formulario
    
    const inputTitle = document.getElementById('task-edit');
    const task = JSON.parse(localStorage.getItem(id));
    inputTitle.value = task.title;
    
    const inputCompleted = document.getElementById('task-completed-edit');
    inputCompleted.checked = task.completed;
    
    editForm.setAttribute('onsubmit', `editTask(event, ${id})`);
    
    // Hacer scroll suave al formulario
    editForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

const editTask = async (event, id) => {
    event.preventDefault();

    const title = document.getElementById('task-edit').value;
    const completed = document.getElementById('task-completed-edit').checked;
    
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, completed })
    })
        .then(response => response.json())
        .then((data) => {
            localStorage.setItem(data.id, JSON.stringify(data));
            const taskTitle = document.getElementById(`taskTitle-${data.id}`);
            taskTitle.innerHTML = data.title;
            const completeButton = document.getElementById(`completed-${data.id}`);
            completeButton.checked = data.completed;
            const toShow = document.getElementById('taskShow').value;
            if (toShow != 'all' && String(data.completed) != toShow) {
                const tasklist = document.getElementById('task-list');
                const li = document.getElementById(`task-${id}`);
                tasklist.removeChild(li);
            }
        })
        const editForm = document.getElementById('task-edit-form');
        editForm.classList.remove('show'); // Mostrar el formulario
}


const showTasks = async () => {
    await getTasks();
    const tasklist = document.getElementById('task-list');
    tasklist.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const element = JSON.parse(localStorage.getItem(key));
            const toShow = document.getElementById('taskShow').value;
            console.log(element.completed, toShow);
            
            if (toShow == "all" || String(element.completed) == toShow) {
                const li = createTaskLi(element);
                tasklist.appendChild(li);
            }
        }catch{
            console.log("");
            
        }
    }
}

const addTask = async (event) => {
    event.preventDefault();
    const title = document.getElementById('task-input').value;
    const completed = document.getElementById('task-completed').checked;
    const form = document.getElementById('task-form');
    const toShow = document.getElementById('taskShow').value;
    form.reset();
    document.getElementById('taskShow').value = toShow;
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, completed })
    })
        .then(response => response.json())
        .then(element => {
            localStorage.setItem(element.id, JSON.stringify(element));
            if (toShow == "all" || String(element.completed) == toShow) {
                const tasklist = document.getElementById('task-list');
                const li = createTaskLi(element);
                tasklist.appendChild(li);
            }
        })
}

const changeStatus = async (id) => {
    const element = JSON.parse(localStorage.getItem(id));
    element.completed = !element.completed;
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(element)
    })
        .then(response => response.json())
        .then((data) => {
            localStorage.setItem(data.id, JSON.stringify(data));
            const completeButton = document.getElementById(`completed-${id}`);
            completeButton.checked = data.completed;
            const toShow = document.getElementById('taskShow').value;
            if (toShow != 'all'){
                const tasklist = document.getElementById('task-list');
                const li = document.getElementById(`task-${id}`);
                tasklist.removeChild(li);
            }
        })
}

const deleteTask = async (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            localStorage.removeItem(id);
            const tasklist = document.getElementById('task-list');
            const li = document.getElementById(`task-${id}`);
            tasklist.removeChild(li);
        })
}

showTasks();
