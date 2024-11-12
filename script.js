const date = document.querySelector("#date");
const list = document.querySelector("#list");
const input = document.querySelector("#input");
const enterButton = document.querySelector("#enter");
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through'
let id = 0
const LIST=[]


const actualDate = new Date();
const formattedDate = actualDate.toISOString().split('T')[0];
date.innerHTML = "Today's date: " + formattedDate;

function addTask(task, id, done, deleted){
    if(!deleted){
    const isDone = done ? check : uncheck;
    const line = done ? lineThrough : '';

    const item = `
                   <li id="item">
                        <i class="far ${isDone}" data="done" id="${id}"></i>
                        <p class="text ${line}">${task}</p>
                        <i class="fas fa-trash de" data="deleted" id="${id}"></i>
                    </li>
    
                 `

        list.insertAdjacentHTML("beforeend", item);
    }
}






function doneTask(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);
}

function deletedTask(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
}


enterButton.addEventListener('click', () => {
    const task = input.value;
    if(task){
        addTask(task, id, false, false);
    }
    input.value='';
    id++;
}
)

document.addEventListener('keyup', function(event){
    if(event.key == 'Enter'){
        const task = input.value;
        if(task){
            addTask(task, id, false, false);
        }
        input.value = '';
        id++;
    }
})

list.addEventListener('click', function(event){
    const element = event.target;
    const elementData = element.attributes.data.value

    if(elementData == 'done'){
        doneTask(element);
    }else if(elementData == 'deleted'){
        deletedTask(element);
    }


})

document.addEventListener('DOMContentLoaded', () => {
    // Función para obtener las tareas de hoy
    getTasksForToday();
});


function fetchTasks() {
    fetch('http://localhost:3307/tasks',{
        method: 'GET',
        mode: 'cors'
    })
      .then(response => response.json())  // Convertir la respuesta a JSON
      .then(tasks => {
        console.log(tasks);  // Verificar en consola que estamos recibiendo las tareas
  
        // Seleccionamos el contenedor de tareas
        const taskList = document.getElementById('list');
        
        // Limpiar cualquier tarea previamente renderizada
        taskList.innerHTML = '';
  
        // Recorrer todas las tareas y agregar elementos a la lista
        tasks.forEach(task => {
        const taskDone = task.completed ? 'fa-check-circle' : 'fa-circle';  // íconos según el estado de la tarea
        const taskLine = task.completed ?  lineThrough : '';  // Agregar clase 'completed' si la tarea está completada

        const li = document.createElement('li');
        li.classList.add('task-item');
        li.id = 'item';

        li.innerHTML = `
        <i class="far ${taskDone}" data="done" id="${task.id}"></i>
        <p class="text ${taskLine}">${task.task}</p>
        <i class="fas fa-trash de" data="deleted" id="${task.id}"></i>
      `;

        // Agregar el item a la lista en el HTML
        taskList.appendChild(li);

       
      });
    })
    .catch(error => {
      console.error('Error al obtener las tareas:', error);
    });


  }
  
  document.addEventListener('DOMContentLoaded', fetchTasks);