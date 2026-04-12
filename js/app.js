const holidaysDatabase = {
  // 2026 National Holidays
  "2026-01-26": { name: "Republic Day", type: "National Holiday", symbol: "🇮🇳" },
  "2026-08-15": { name: "Independence Day", type: "National Holiday", symbol: "🇮🇳" },
  "2026-10-02": { name: "Gandhi Jayanti", type: "National Holiday", symbol: "🇮🇳" },
  // 2026 Hindu Festivals
  "2026-03-03": { name: "Holi", type: "Hindu Festival", symbol: "🕉️" },
  "2026-11-08": { name: "Diwali", type: "Hindu Festival", symbol: "🕉️" },
  "2026-02-14": { name: "Maha Shivaratri", type: "Hindu Festival", symbol: "🕉️" },
  "2026-08-28": { name: "Janmashtami", type: "Hindu Festival", symbol: "🕉️" },
  "2026-10-19": { name: "Dussehra", type: "Hindu Festival", symbol: "🕉️" },
  // 2026 Christian
  "2026-12-25": { name: "Christmas", type: "Christian Festival", symbol: "✝️" },
  "2026-04-03": { name: "Good Friday", type: "Christian Festival", symbol: "✝️" },
  "2026-04-05": { name: "Easter", type: "Christian Festival", symbol: "✝️" },
  // 2026 Islamic
  "2026-03-20": { name: "Eid ul-Fitr", type: "Islamic Festival", symbol: "☪️" },
  "2026-05-27": { name: "Eid ul-Adha", type: "Islamic Festival", symbol: "☪️" },
  "2026-06-26": { name: "Muharram", type: "Islamic Festival", symbol: "☪️" },
  // Others
  "2026-05-01": { name: "May Day", type: "National Holiday", symbol: "🇮🇳" },
  "2026-11-24": { name: "Guru Nanak Jayanti", type: "Sikh Festival", symbol: "☬" },
  "2026-05-31": { name: "Buddha Purnima", type: "Buddhist Festival", symbol: "☸" },
  "2026-03-31": { name: "Mahavir Jayanti", type: "Jain Festival", symbol: "☬" },
};

const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addForm = document.getElementById("addForm");
const taskList = document.getElementById("taskList");
const stats = document.getElementById("stats");

const dateFilterChip = document.getElementById("dateFilterChip");
const dateFilterText = document.getElementById("dateFilterText");
const dateFilterClear = document.getElementById("dateFilterClear");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Calendar state
let currentMonthDate = new Date();
let selectedDateFilter = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateFilterChip() {
  if (selectedDateFilter) {
    dateFilterChip.style.display = "inline-flex";
    dateFilterChip.style.alignItems = "center";
    dateFilterText.textContent = `Due: ${selectedDateFilter}`;
  } else {
    dateFilterChip.style.display = "none";
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  let visibleTasks = tasks;
  
  if (selectedDateFilter) {
    visibleTasks = tasks.filter(t => t.date === selectedDateFilter);
  }

  visibleTasks.forEach((task) => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement("li");
    li.className = "task";

    if (task.completed) {
      li.classList.add("completed");
    }

    const dateBadge = task.date ? `<span class="task-date-badge"><span class="material-symbols-rounded" style="font-size:14px">event</span> Deadline: ${task.date}</span>` : "";
    
    let priorityBadge = "";
    if (task.priority && task.priority !== "none") {
      const pColor = task.priority === "high" ? "var(--danger)" : task.priority === "medium" ? "var(--warning)" : "var(--success)";
      priorityBadge = `<span style="font-size:10px;text-transform:uppercase;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.1);color:${pColor};margin-left:8px;">${task.priority}</span>`;
    }

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} title="Mark as complete">
        <span class="task-text" style="display:flex;align-items:center;">${task.text} ${priorityBadge}</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        ${dateBadge}
        <button class="btn small danger icon-btn" title="Delete task"><span class="material-symbols-rounded" style="font-size:18px;">delete</span></button>
      </div>
    `;

    const checkbox = li.querySelector("input");

    checkbox.addEventListener("change", () => {
      tasks[realIndex].completed = !tasks[realIndex].completed;
      saveTasks();
      renderTasks();
    });

    li.querySelector("button").addEventListener("click", () => {
      tasks.splice(realIndex, 1);
      saveTasks();
      renderTasks();
      renderCalendar(); // Update dots
    });

    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  stats.textContent = `${completed}/${total} completed`;
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const monthLabel = document.getElementById("calMonthLabel");

  if (!grid || !monthLabel) return;
  grid.innerHTML = "";

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const headerDiv = document.createElement("div");
    headerDiv.textContent = day;
    headerDiv.style.fontWeight = "600";
    headerDiv.style.textAlign = "center";
    headerDiv.style.paddingBottom = "8px";
    headerDiv.style.color = "var(--text-muted)";
    headerDiv.style.fontSize = "12px";
    headerDiv.style.textTransform = "uppercase";
    headerDiv.style.letterSpacing = "0.5px";
    grid.appendChild(headerDiv);
  });

  // Empty days padding
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    grid.appendChild(emptyDiv);
  }

  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = i;

    // Dot if tasks exist on this date
    const tasksOnDate = tasks.filter(t => t.date === dateStr);
    if (tasksOnDate.length > 0) {
      dayDiv.classList.add("has-tasks");
      const dot = document.createElement("div");
      dot.className = "task-dot";
      dayDiv.appendChild(dot);
    }

    const holiday = holidaysDatabase[dateStr];
    if(holiday) {
      dayDiv.classList.add("has-holiday");
      dayDiv.title = `${holiday.name} - ${holiday.type}`;
      
      const symbolSpan = document.createElement("div");
      symbolSpan.className = "holiday-symbol";
      symbolSpan.textContent = holiday.symbol;
      
      const nameSpan = document.createElement("div");
      nameSpan.className = "holiday-name";
      nameSpan.textContent = holiday.name;
      
      dayDiv.appendChild(symbolSpan);
      dayDiv.appendChild(nameSpan);
    }

    if (selectedDateFilter === dateStr) {
      dayDiv.classList.add("active");
    }

    dayDiv.addEventListener("click", () => {
      if(holiday) {
        showToast(`${holiday.symbol} ${holiday.name} (${holiday.type})`);
      }
      selectedDateFilter = selectedDateFilter === dateStr ? null : dateStr;
      renderCalendar();
      renderTasks();
      updateFilterChip();
    });

    grid.appendChild(dayDiv);
  }
}

// Calendar Navigation
document.getElementById("calPrev")?.addEventListener("click", () => {
  currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("calNext")?.addEventListener("click", () => {
  currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById("calClearFilter")?.addEventListener("click", () => {
  selectedDateFilter = null;
  renderCalendar();
  renderTasks();
  updateFilterChip();
});

dateFilterClear?.addEventListener("click", () => {
  selectedDateFilter = null;
  renderCalendar();
  renderTasks();
  updateFilterChip();
});

// Add Task
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const dateVal = dueDateInput?.value || null;
  const priorityVal = priorityInput?.value || "none";

  if (!text) return;

  tasks.push({
    text,
    date: dateVal,
    priority: priorityVal,
    completed: false
  });

  taskInput.value = "";
  if(dueDateInput) dueDateInput.value = "";
  if(priorityInput) priorityInput.value = "none";

  saveTasks();
  renderTasks();
  renderCalendar();

  showToast("Task added");
});

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if(!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}


// Initialization run
renderTasks();
renderCalendar();
updateFilterChip();