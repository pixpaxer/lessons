/*--------------- Выполняем рендер когда страница загрузится ------------------ */
var textarea = document.querySelector('textarea');
let editID;

document.addEventListener("DOMContentLoaded", function() {
    renderTask()
    /*--------------- Добавление возможности отправки формы по кнопке Enter ------------------ */

    addKeyListen("newTask", addTask) // Форма добавления задачи
    addKeyListen("editForm", editTask) // Форма редактирования задачи

});


/* Функция для добавления отправки форм по кнопке Enter. В качестве парамента получает IDэлемента и название функции которую нужно будет выполнить */
function addKeyListen(elemID, functionName){
    elem = document.getElementById(elemID);
    elem.addEventListener("keypress", function(elem) {
    if (elem.keyCode == 13){
        functionName()
    }
    })
}

/*--------------- Рендер тасков при загрузке страницы, а также удалении/добавлении таска ------------------ */
function renderTask(){
    let taskList = getTasks();
    taskPlace = document.querySelector('.taskList');

    if(taskList.length > 0){
        taskPlace.innerHTML = "";
        taskList.forEach(task => {
            taskPlace.insertAdjacentHTML('beforeend', 
                `
                <div class = 'task ${task.completed  ? "done" : ""}', id="${task.id}"> 
                    <input name = 'Check' type ="checkbox" ${task.completed ? "checked=checked" : ""} onclick = "taskDone(this)">
                    <span> ${task.text} </span>
                    <span class = taskButtons>
                        <ion-icon name="create" class = edit onclick="openTaskEdit(this)"></ion-icon>
                        <ion-icon name="trash" class = trash onclick="deleteTask(this)"></ion-icon>
                    </span>
                </div> 
                `
            )
        })
        
    }else{
        taskPlace.innerHTML = "<h3> Новых задач пока нет </h3>"
    }
    deleteAllButtonStatus()
}

/*--------------- Получаем список тасков с localStorage ------------------ */
function getTasks(){
    const taskList = localStorage.getItem('tasks');
    if(taskList) {
        return JSON.parse(taskList)
    }
    return [];
}

/*--------------- Удалить 1 таск по кнопке корзины в элементе ------------------ */
function deleteTask(elem){
    let id = Number(elem.parentNode.parentNode.id);
    let tasks = getTasks();
    tasks = tasks.filter(task => Number(task.id) !== id)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    deleteAnimation(document.getElementById(id));

}

function deleteAnimation(element){
    element.classList.add('fade-out');
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
        element.remove();
        renderTask();
    }, 250);
}

/*--------------- Удалить все таски которые отмечены решенными ------------------ */

function deleteAllChecked(){
    let allCheckeElement = document.querySelectorAll('input[name="Check"]:checked');
    if(allCheckeElement.length > 0 && confirm("Вы  точно хотите удалить все выделенные задачи? После удаления восстановить их уже не получится")){
        let tasks = getTasks();
        for (let element of allCheckeElement) {
            tasks = tasks.filter(task => Number(task.id) !== Number(element.parentNode.id))
            deleteAnimation(document.getElementById(element.parentNode.id));
        }
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
}

/*--------------- Получить последний ID элемента + 1 ------------------ */
function getLastId(){
    try{
        const item = document.getElementsByClassName("task");
        const lastchild = item[item.length-1];
        return Number(lastchild.id) + 1;
    }
    catch{
        return 1
    }
}


/*--------------- Добавление нового таска ------------------ */
function addTask(){
    let taskText = document.getElementById('newTask');
    if (taskText.value.trim().length > 0){
        const newTask = {id: getLastId(), text: taskText.value, completed: false}
        let tasks = getTasks();
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks))
        renderTask();
        taskText.value = '';
        }
}

/*--------------- Отметка тасков решенными/нерешенными ------------------ */
function taskDone(elem){
    let id = Number(elem.parentNode.id);
    let tasks = getTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
        tasks[index].completed = tasks[index].completed ? false : true;
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTask()
    }else{
        alert('Ошибка удаления')
    }
      
}

/*--------------- Редактирование тасков ------------------ */

function editTask(){ 
    
    if(textarea.value.trim().length > 0 && confirm("Сохранить изменения?")){
        let tasks = getTasks();
        const index = tasks.findIndex(task => task.id === editID);
        
    
        if (index !== -1) {
            tasks[index].text = textarea.value;
        
            localStorage.setItem('tasks', JSON.stringify(tasks));
            closeTaskEdit();
            renderTask();
        }
    }else{
        console.log('no save')
    }
}

/*--------------- Открыть блок редактирования ------------------ */
function openTaskEdit(elem){
    let conteiner = document.getElementsByClassName('editConteiner')[0];

    conteiner.style.display = 'block';
    textarea.focus();
    textarea.value = elem.parentNode.previousSibling.previousSibling.textContent;
    editID = Number(elem.parentNode.parentNode.id);
    autoResize()
    
}

/*--------------- Закрыть блок редактирования ------------------ */
function closeTaskEdit(){
    let conteiner = document.getElementsByClassName('editConteiner')[0];
    conteiner.style.display = 'none';
}

/*--------------- Активация/деактивация кнопки удаления нескольких тасков ------------------ */
function deleteAllButtonStatus(){
    let allCheckeElement = document.querySelectorAll('input[name="Check"]:checked');
    var deleteAllChecked = document.querySelector('.deleteTask')
    if(allCheckeElement.length > 0){
        deleteAllChecked.classList.remove('deactive');
    }else{
        deleteAllChecked.classList.add('deactive');
    }
}

/*--------------- Ресайз блока редактирования ------------------ */
function autoResize() {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

try{
    textarea.addEventListener('input', autoResize);
}catch{
    textarea.attachEvent('oninput', autoResize);
}