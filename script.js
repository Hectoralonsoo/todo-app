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
    const textElement = element.parentNode.querySelector('.text');
    textElement.classList.toggle(lineThrough);
    
}

function deletedTask(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
}


enterButton.addEventListener('click', () => {
    const task = input.value;
    if(task){
        addTask(task, id, false, false);
        saveTaskToDatabase(task);
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
            saveTaskToDatabase(task);
        }
        input.value = '';
        id++;
    }
})



list.addEventListener('click', function(event) {
        const element = event.target;
        const elementData = element.attributes.data.value; 
        const taskId = element.getAttribute('id');  
    
        var isCompleted = true;
      
    
        if (elementData =='done') {
            
          
            if (element.classList.contains('fa-check-circle')) {
                isCompleted = true;  
            } else {
                isCompleted = false;  
            }

            doneTask(element);
           
            updateToggleTaskCompletion(taskId, isCompleted)
            .catch(error => {
               
                console.error('Error al actualizar la tarea:', error);
                doneTask(element);
            })
    
       
            
        } 
     
        else if (elementData === 'deleted') {
            deletedTask(element);
            deleteTaskFromDatabase(taskId);
        }
    });
    






function fetchTasks() {
    const selectedDate = document.getElementById('input-date').value;
    fetch(`http://localhost:3307/tasks?date=${selectedDate}`,{
        method: 'GET',
        mode: 'cors'
    })
      .then(response => response.json()) 
      .then(tasks => {
      
   
        const taskList = document.getElementById('list');
        
     
        taskList.innerHTML = '';
  
       
        tasks.forEach(task => {
        const taskDone = task.completed ? 'fa-check-circle' : 'fa-circle';  
        const taskLine = task.completed ?  lineThrough : '';  

        const li = document.createElement('li');
        li.id = 'item';

        li.innerHTML = `
        <i class="far ${taskDone}" data="done" id="${task.id}"></i>
        <p class="text ${taskLine}">${task.task}</p>
        <i class="fas fa-trash de" data="deleted" id="${task.id}"></i>
      `;

       
        taskList.appendChild(li);

       
      });
    })
    .catch(error => {
      console.error('Error al obtener las tareas:', error);
    });


  }

function updateToggleTaskCompletion(taskId, isCompleted){
    fetch(`http://localhost:3307/tasks?id=${taskId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({completed: isCompleted ? 1 : 0}),
        
    })
    .then(response=>response.json())
    .then(data=>{
        console.log('Estado de la tarea actualizado: ', data);
    
    })
    .catch(error => console.error('Error al actualizar la tarea: ', error));
} 


function saveTaskToDatabase(taskText) {
    fetch('http://localhost:3307/tasks', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            task: taskText,
            completed: 0,
            points: 10
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tarea guardada en la base de datos:', data);
    })
    .catch(error => console.error('Error al guardar la tarea:', error));
}



function deleteTaskFromDatabase(taskId) {
    fetch(`http://localhost:3307/tasks?id=${taskId}`, {
        method: 'DELETE',
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tarea eliminada de la base de datos:', data);
    })
    .catch(error => console.error('Error al eliminar la tarea:', error));
}


document.addEventListener('DOMContentLoaded', fetchTasks);