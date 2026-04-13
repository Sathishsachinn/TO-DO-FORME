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
let selectedDates = [];
let lastSelectedDate = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateFilterChip() {
  if (selectedDates.length > 0) {
    dateFilterChip.style.display = "inline-flex";
    dateFilterChip.style.alignItems = "center";
    if (selectedDates.length === 1) {
      dateFilterText.textContent = `Due: ${selectedDates[0]}`;
    } else {
      dateFilterText.textContent = `Due: ${selectedDates.length} selected days`;
    }
  } else {
    dateFilterChip.style.display = "none";
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  let visibleTasks = tasks;
  
  if (selectedDates.length > 0) {
    visibleTasks = tasks.filter(t => selectedDates.includes(t.date));
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
        <span class="task-text" style="display:flex;align-items:center;">
          ${task.completed ? '<span class="material-symbols-rounded" style="color:#10b981;font-size:20px;margin-right:8px;filter:drop-shadow(0 0 5px rgba(16,185,129,0.4));">check_circle</span>' : ''}
          ${task.text} ${priorityBadge}
        </span>
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
  const todayDateObj = new Date();

  // Day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const headerDiv = document.createElement("div");
    headerDiv.textContent = day;
    headerDiv.style.fontWeight = "600";
    headerDiv.style.textAlign = "center";
    headerDiv.style.paddingBottom = "8px";
    headerDiv.style.color = day === 'Sun' ? "var(--danger)" : "var(--text-muted)";
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
    if (new Date(year, month, i).getDay() === 0) {
      dayDiv.classList.add("sunday");
    }
    if (year === todayDateObj.getFullYear() && month === todayDateObj.getMonth() && i === todayDateObj.getDate()) {
      dayDiv.classList.add("today");
    }
    dayDiv.textContent = i;

    // Bulb if tasks exist on this date
    const tasksOnDate = tasks.filter(t => t.date === dateStr);
    if (tasksOnDate.length > 0) {
      dayDiv.classList.add("has-tasks");
      const dot = document.createElement("div");
      dot.className = "task-dot";
      dot.innerHTML = `<span class="material-symbols-rounded" style="font-size:14px;">lightbulb</span>`;
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

    if (selectedDates.includes(dateStr)) {
      dayDiv.classList.add("active");
    }

    dayDiv.addEventListener("click", (e) => {
      if(holiday) {
        showToast(`${holiday.symbol} ${holiday.name} (${holiday.type})`);
      }
      
      const tasksOnDate = tasks.filter(t => t.date === dateStr);
      if (tasksOnDate.length > 0) {
        showToast(`📝 ${tasksOnDate.map(t => t.text).join(" • ")}`);
      }

      if (e.shiftKey && lastSelectedDate) {
        const start = new Date(lastSelectedDate);
        const end = new Date(dateStr);
        const rangeStart = start < end ? start : end;
        const rangeEnd = start < end ? end : start;
        
        let curr = new Date(rangeStart);
        while (curr <= rangeEnd) {
          const y = curr.getFullYear();
          const m = String(curr.getMonth() + 1).padStart(2, '0');
          const d = String(curr.getDate()).padStart(2, '0');
          const dStr = `${y}-${m}-${d}`;
          if (!selectedDates.includes(dStr)) {
            selectedDates.push(dStr);
          }
          curr.setDate(curr.getDate() + 1);
        }
      } else {
        const index = selectedDates.indexOf(dateStr);
        if (index > -1) {
          selectedDates.splice(index, 1);
        } else {
          selectedDates.push(dateStr);
        }
      }
      lastSelectedDate = dateStr;
      
      if (selectedDates.length === 1) {
        if(dueDateInput) dueDateInput.value = selectedDates[0];
      } else {
        if(dueDateInput) dueDateInput.value = "";
      }
      if(selectedDates.length > 0 && taskInput) {
        taskInput.focus();
      }

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
  selectedDates = [];
  lastSelectedDate = null;
  renderCalendar();
  renderTasks();
  updateFilterChip();
});

dateFilterClear?.addEventListener("click", () => {
  selectedDates = [];
  lastSelectedDate = null;
  renderCalendar();
  renderTasks();
  updateFilterChip();
});

document.getElementById("applyRangeBtn")?.addEventListener("click", () => {
  const fromEl = document.getElementById("rangeFromInput");
  const toEl = document.getElementById("rangeToInput");
  if (!fromEl || !toEl || !fromEl.value || !toEl.value) {
    showToast("Please select both 'From' and 'To' dates.");
    return;
  }
  
  const start = new Date(fromEl.value);
  const end = new Date(toEl.value);
  const rangeStart = start < end ? start : end;
  const rangeEnd = start < end ? end : start;
  
  let curr = new Date(rangeStart);
  let added = 0;
  while (curr <= rangeEnd) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    const dStr = `${y}-${m}-${d}`;
    if (!selectedDates.includes(dStr)) {
      selectedDates.push(dStr);
      added++;
    }
    curr.setDate(curr.getDate() + 1);
  }
  
  fromEl.value = "";
  toEl.value = "";
  
  showToast(`Selected a range of ${added} days!`);
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

  if (selectedDates.length > 1) {
    selectedDates.forEach(d => {
      tasks.push({ text, date: d, priority: priorityVal, completed: false });
    });
  } else {
    tasks.push({ text, date: dateVal, priority: priorityVal, completed: false });
  }

  taskInput.value = "";
  if(dueDateInput) dueDateInput.value = "";
  if(priorityInput) priorityInput.value = "none";
  selectedDates = [];
  lastSelectedDate = null;

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