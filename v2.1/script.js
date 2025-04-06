const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const lists = {
    todo: document.getElementById("todo-list"),
    progress: document.getElementById("progress-list"),
    deferred: document.getElementById("deferred-list"),
    done: document.getElementById("done-list")
  };

  Object.values(lists).forEach(list => list.innerHTML = "");

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add(task.status);

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Inline edit on double-click
    span.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = span.textContent;
      input.className = "task-text";
      input.onblur = () => {
        tasks[index].text = input.value;
        renderTasks();
      };
      li.replaceChild(input, span);
      input.focus();
    });

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    const editBtn = document.createElement("i");
    editBtn.className = "fas fa-edit";
    editBtn.onclick = () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.onblur = () => {
        tasks[index].text = input.value;
        renderTasks();
      };
      li.replaceChild(input, span);
      input.focus();
    };

    const statusBtn = document.createElement("i");
    statusBtn.className = "fas fa-check-circle";
    statusBtn.onclick = () => toggleStatusMenu(li, index);

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fas fa-trash";
    deleteBtn.onclick = () => deleteTask(index);

    buttons.append(editBtn, statusBtn, deleteBtn);
    li.append(span, buttons);

    // Create the pop-up menu
    const statusMenu = document.createElement("div");
    statusMenu.className = "status-menu";

    ["todo", "progress", "deferred", "done"].forEach(status => {
      if (status !== task.status) {
        const dot = document.createElement("div");
        dot.className = `status-option ${status}`;
        dot.onclick = () => {
          tasks[index].status = status;
          renderTasks();
        };
        statusMenu.appendChild(dot);
      }
    });

    li.appendChild(statusMenu);
    lists[task.status].appendChild(li);
  });

  saveTasks();
}

function toggleStatusMenu(li, index) {
  const menu = li.querySelector(".status-menu");
  document.querySelectorAll(".status-menu").forEach(m => {
    if (m !== menu) m.classList.remove("show");
  });
  menu.classList.toggle("show");
}

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, status: "todo" });
    taskInput.value = "";
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addTask();
  }
});

renderTasks();
