const today = document.getElementById('today');
const itemInput = document.getElementById('input__add');
const addBtn = document.getElementById('button__add');
const taskbox = document.querySelector('.task-box');
const totalNum = document.getElementById('total-num');
const remainingNum = document.getElementById('remaining-num');
const doneNum = document.getElementById('done-num');
const storage = window.localStorage;
const todoArr = [];

window.onload = () =>{
   today.appendChild(document.createTextNode(new Date().toDateString()));
   renderTodoOnLoad();
   counter();
}

function renderTodoOnLoad(){
   const temp = [];
   temp.push(JSON.parse(storage.getItem('TODO')));
   try {
      temp.forEach(item => {
         item.forEach(i => {
            const li = document.createElement('li');
            const taskbox = document.querySelector('.task-box');
            li.classList.add('task');
            li.innerHTML = `<label class="task_label" for="1">
               <input id="${i.id}" type="checkbox" onclick="toggleTodo(this)">
               <p>${i.name}</p>
               </label>
               <div class="task__delete">
               <i id="delete" class="fa-solid fa-trash" onclick="deleteTodo(this)"></i>
               </div>`;

            if(i.complete === true){
               li.children[0].children[0].setAttribute('checked','');
               li.style.textDecoration = 'line-through';
            }else{
               li.children[0].children[0].setAttribute('unchecked','');
               li.style.textDecoration = 'none';
            }
            taskbox.appendChild(li);
         })
      });
   } catch (error) {
      alert('No item on storage to display, please add item');
   }
}

function addTodoToStorage(todoArr){
   storage.setItem('TODO', JSON.stringify(todoArr));
   itemInput.value="";
}

function addTodo(todoItem) {
   if(todoItem != ""){
      let itemObj = {
         id: Date.now(),
         name: todoItem,
         dateCreated: new Date().toDateString(),
         timeCreated: new Date().toTimeString(),
         complete: false,
      }
      if(storage.key(0) === 'TODO'){
         const temp = JSON.parse(storage.getItem('TODO'));
         storage.removeItem('TODO');
         temp.push(itemObj);
         addTodoToStorage(temp);
      }else{
         todoArr.push(itemObj);
         addTodoToStorage(todoArr);
      }
      renderTodo(todoArr);
   }else{
      alert('Please type new item');
   }
}

function renderTodo(){
   const li = document.createElement('li');
   const temp = JSON.parse(storage.getItem('TODO'));
   temp.forEach(item => {
      li.classList.add('task');
      li.innerHTML = `<label class="task_label" for="1">
         <input id="${item.id}" type="checkbox" onclick="toggleTodo(this)" unchecked>
         <p>${item.name}</p>
         </label>
         <div class="task__delete">
         <i id="delete" class="fa-solid fa-trash" onclick="deleteTodo(this)"></i>
         </div>`;
      taskbox.appendChild(li);
   });
   counter();
}

function toggleTodo(event){
   const temp = JSON.parse(storage.getItem('TODO'));
   
   for(let i = 0; i < temp.length; i++){
      const tempID = temp[i].id.toString();
      
      if(tempID === event.id){
         if(event.checked){
            temp[i].complete = !temp[i].complete;
            storage.removeItem('TODO');
            addTodoToStorage(temp);
            doneNum.innerHTML++;
            remainingNum.innerHTML--;
            event.nextElementSibling.style.textDecoration='line-through';
            event.removeAttribute("unchecked");
            event.setAttribute("checked","");
         }else{
            temp[i].complete = false;
            storage.removeItem('TODO');
            addTodoToStorage(temp);
            doneNum.innerHTML--;
            remainingNum.innerHTML++;
            event.nextElementSibling.style.textDecoration='none';
            event.removeAttribute("checked");
            event.setAttribute("unchecked","");
         }
      }

   }
}

function counter(){
   const temp = JSON.parse(storage.getItem('TODO'));
   let doneCounter = 0;

   for(let i = 0; i< temp.length; i++){
      if(temp[i].complete === true){
         doneCounter++;
      }   
   }
   doneNum.innerHTML = doneCounter;
   remainingNum.innerHTML = temp.length - doneCounter;
   totalNum.innerHTML = temp.length;
}

function deleteTodo(event){
   const temp = JSON.parse(storage.getItem('TODO'));

   const eventID = event.parentNode.previousElementSibling.children[0].id;
   for(let i = 0; i < temp.length; i++){
      const tempID = temp[i].id.toString();

      if(tempID == eventID){
         const result = temp.filter(item => item.id != tempID);
         taskbox.removeChild(event.parentNode.parentElement);
         storage.removeItem('TODO');
         addTodoToStorage(result);
         counter();
      }
   }
}

addBtn.addEventListener('click', ()=>{
   addTodo(itemInput.value);
   
});


