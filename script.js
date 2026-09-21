const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const emptyMessage = document.getElementById("empty-message");
const statusMessage = document.getElementById("status-message");

const STORAGE_KEY = "todayTodoListV2";
let todos = readSavedTodos();

function readSavedTodos() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    const savedTodos = savedText ? JSON.parse(savedText) : [];
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    showStatus("현재 브라우저에서는 자동 저장을 사용할 수 없습니다.");
  }
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function updateCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `남은 할 일 ${remaining}개 / 전체 ${todos.length}개`;
}

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";
  if (todo.completed) item.classList.add("completed");

  const checkBox = document.createElement("span");
  checkBox.className = "check-box";
  checkBox.textContent = todo.completed ? "✓" : "";
  checkBox.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "complete-button";
  completeButton.textContent = todo.completed ? "완료 취소" : "완료";
  completeButton.addEventListener("click", () => toggleTodo(todo.id));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  item.append(checkBox, text, completeButton, deleteButton);
  return item;
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    todoList.appendChild(createTodoItem(todo));
  });

  emptyMessage.hidden = todos.length !== 0;
  updateCount();
}

function addTodo(text) {
  todos.unshift({
    id: makeId(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
  showStatus("할 일을 추가했습니다.");
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  saveTodos();
  renderTodos();
  showStatus("완료 상태를 변경했습니다.");
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
  showStatus("할 일을 삭제했습니다.");
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    showStatus("할 일을 먼저 입력해 주세요.");
    todoInput.focus();
    return;
  }

  addTodo(text);
  todoForm.reset();
  todoInput.focus();
});

renderTodos();
