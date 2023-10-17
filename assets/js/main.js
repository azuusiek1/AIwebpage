const LOCALSTORAGE_TODO = "todoList";
let tasks = JSON.parse(localStorage.getItem(LOCALSTORAGE_TODO) || "[]");
let searchValue = "";

const draw = () => {
  const taskList = document.querySelector("#tasks");
  taskList.innerHTML = "";

  tasks.forEach((item, index) => {
    if (searchValue && !item.name.toLowerCase().includes(searchValue.toLowerCase())) return;

    let itemName = (searchValue && !item.editing)
      ? item.name.replace(new RegExp(`(${searchValue})`, 'ig'), "<mark>$1</mark>")
      : item.name;

    const editGroup = item.editing
      ? `
          <input type="checkbox" ${item.checked ? "checked" : ""} onchange="onCheck(this);"/>
          <div class="editGroup">
              <input type="text" class="taskName" value="${itemName}">
              <input type="date" class="taskTime" value="${item.date}">
              <button onClick="saveEditedTask(this);">Save</button>
          </div>`
      : `
          <input type="checkbox" ${item.checked ? "checked" : ""} onchange="onCheck(this);"/>
          <div class="editGroup" onClick="editTask(this);">
              <span class="taskName">${itemName}</span>
              <span class="taskTime">[${item.date}]</span>
          </div>`;

    taskList.innerHTML += `<div class="checkGroup" id="task_${index}">
                                ${editGroup}
                                <button onClick="removeTask(this);">Remove</button>
                            </div>`;
  });
};

const updateTasks = () => {
  localStorage.setItem(LOCALSTORAGE_TODO, JSON.stringify(tasks));
};

const verifyCorrect = (taskName, taskTime) => {
  if (taskName.length <= 3) {
    alert("Długość znaków nazwy zadania powinna przekroczyć 3.");
    return false;
  }

  if (!taskTime || Date.parse(taskTime) <= Date.now()) {
    alert("Wprowadź przyszłą datę.");
    return false;
  }

  return true;
};

const addTask = () => {
  const taskName = document.querySelector("#taskName").value;
  const taskTime = document.querySelector("#taskTime").value;
    console.log("test");
  if (verifyCorrect(taskName, taskTime)) {
    tasks.push({ checked: false, name: taskName, date: taskTime, editing: false });
    updateTasks();
    draw();
  }
};

const getTaskIdByElement = elem => parseInt(elem.parentElement.id.replace("task_", ""));

const removeTask = elem => {
  tasks.splice(getTaskIdByElement(elem), 1);
  updateTasks();
  draw();
};

const onCheck = elem => {
  tasks[getTaskIdByElement(elem)].checked = elem.checked;
  updateTasks();
};

const editTask = elem => {
  tasks.forEach(task => task.editing = false);
  tasks[getTaskIdByElement(elem)].editing = true;
  updateTasks();
  draw();
};

const saveEditedTask = elem => {
  const parentElement = elem.parentElement;
  const taskName = parentElement.querySelector(".taskName").value;
  const taskTime = parentElement.querySelector(".taskTime").value;

  if (verifyCorrect(taskName, taskTime)) {
    const task = tasks[getTaskIdByElement(parentElement)];
    task.name = taskName;
    task.date = taskTime;
    task.editing = false;
    updateTasks();
    draw();
  }
};

draw();
document.querySelector("#searchText").addEventListener("input", e => { searchValue = e.target.value; draw(); });
document.querySelector("#addTask").addEventListener("click", addTask);