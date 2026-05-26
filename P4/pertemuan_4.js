const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const errMsg = document.getElementById("err-msg");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";
let editingId = null;

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  let filtered = todos;
  if (filter === "active") filtered = todos.filter((t) => !t.completed);
  if (filter === "completed") filtered = todos.filter((t) => t.completed);

  if (filtered.length === 0) {
    todoList.innerHTML = `<li class="empty">Tidak ada tugas di sini.</li>`;
    return;
  }

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    const isEditing = editingId === todo.id;

    if (isEditing) {
      li.innerHTML = `
                <button class="btn-check ${todo.completed ? "checked" : ""}" onclick="toggleTodo(${todo.id})">
                    ${todo.completed ? "✓" : ""}
                </button>
                <input type="text" id="edit-input-${todo.id}" value="${todo.text}" />
                <button class="btn-save" onclick="saveEdit(${todo.id})">Simpan</button>
                <button class="btn-cancel" onclick="cancelEdit()">Batal</button>
            `;
    } else {
      li.innerHTML = `
                <button class="btn-check ${todo.completed ? "checked" : ""}" onclick="toggleTodo(${todo.id})">
                    ${todo.completed ? "✓" : ""}
                </button>
                <span class="${todo.completed ? "done" : ""}">${todo.text}</span>
                <button class="btn-edit" onclick="startEdit(${todo.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTodo(${todo.id})">Hapus</button>
            `;
    }

    todoList.appendChild(li);

    if (isEditing) {
      const editInput = document.getElementById(`edit-input-${todo.id}`);
      editInput.focus();
      editInput.select();
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit(todo.id);
        if (e.key === "Escape") cancelEdit();
      });
    }
  });

  saveToLocalStorage();
}

function addTodo() {
  const value = todoInput.value.trim();

  if (value === "") {
    todoInput.classList.add("error");
    errMsg.textContent = "Input tidak boleh kosong!";
    todoInput.focus();
    return;
  }

  todos = [...todos, { id: Date.now(), text: value, completed: false }];
  renderTodos();
  todoInput.value = "";
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

todoInput.addEventListener("input", () => {
  todoInput.classList.remove("error");
  errMsg.textContent = "";
});

window.toggleTodo = (id) => {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  );
  renderTodos();
};

window.deleteTodo = (id) => {
  todos = todos.filter((t) => t.id !== id);
  renderTodos();
};

window.startEdit = (id) => {
  editingId = id;
  renderTodos();
};

window.saveEdit = (id) => {
  const editInput = document.getElementById(`edit-input-${id}`);
  const newText = editInput.value.trim();
  if (newText === "") return;
  todos = todos.map((t) => (t.id === id ? { ...t, text: newText } : t));
  editingId = null;
  renderTodos();
};

window.cancelEdit = () => {
  editingId = null;
  renderTodos();
};

// Fix filter: hapus semua class active dulu, baru kasih ke yang diklik
window.setFilter = (f) => {
  filter = f;
  document.querySelectorAll(".filter-row button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(`filter-${f}`).classList.add("active");
  renderTodos();
};

renderTodos();
