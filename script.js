// Set Budget and Show It
let expenses = [];
let budget = 0;
// Load saved data on page load
window.onload = () => {
  const savedUser = localStorage.getItem("username");
  if (savedUser) showApp(savedUser);
  else {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("main-app").style.display = "none";
  }

  const savedBudget = localStorage.getItem("budget");
  if (savedBudget) {
    budget = parseFloat(savedBudget);
    document.getElementById("budget-display").textContent = `Budget: ₹${budget}`;
  }

  const savedExpenses = localStorage.getItem("expenses");
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }

  // ✅ Apply saved dark mode
  applySavedTheme();

  updateExpenseList();
  updateSummary();
  updateChart();
  updateMonthlySummary();
};


function setBudget() {
  const budgetInput = document.getElementById("budget");
  const budgetValue = parseFloat(budgetInput.value);

  if (isNaN(budgetValue) || budgetValue <= 0) {
    alert("Please enter a valid budget greater than 0.");
    return;
  }

  budget = budgetValue;
  localStorage.setItem("budget", budget); // 🔐 Save to localStorage
  // Show it on the page
  document.getElementById("budget-display").textContent = `Budget: ₹${budget}`;
  updateSummary();
  // Clear the input field after setting
  budgetInput.value = "";
}

//  Add Expense Input Handler (basic skeleton)
// global array to store expense data
function addExpense() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please enter valid expense details.");
    return;
  }

  const expense = { description: desc, amount, category };
  expenses.push(expense); // add to global array
  localStorage.setItem("expenses", JSON.stringify(expenses)); // 🔐 Save to localStorage
  updateExpenseList(); // show on screen
  updateSummary();
  updateChart(); // right after updateSummary();
  updateCategoryBars(); // ✅ update category progress bars

  // Clear inputs
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function updateExpenseList(filterCategory = "All") {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const filteredExpenses = filterCategory === "All"
    ? expenses
    : expenses.filter(exp => exp.category === filterCategory);

  filteredExpenses.forEach((exp, index) => {
    const item = document.createElement("li");

    item.innerHTML = `
      <div class="expense-item">
        <div>
          <strong>${exp.description}</strong><br>
          ₹${exp.amount} <span class="category">[${exp.category}]</span>
        </div>
        <button class="delete-btn" onclick="deleteExpense(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    list.appendChild(item);
  });
}


function deleteExpense(index) {
  expenses.splice(index, 1); // remove item from array
  localStorage.setItem("expenses", JSON.stringify(expenses)); // update localStorage
  updateExpenseList();
  updateSummary();
}

function filterExpenses() {
  const selectedCategory = document.getElementById("filter").value;
  updateExpenseList(selectedCategory);
}


function updateSummary() {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  document.getElementById("total-spent").textContent = totalSpent;
  const remaining = budget - totalSpent;
  document.getElementById("remaining").textContent = remaining >= 0 ? remaining : 0;
  updateCategoryBars();
}

function resetTracker() {
  const confirmReset = confirm("Are you sure you want to clear all data?");
  if (!confirmReset) return;

  localStorage.clear();
  expenses = [];
  budget = 0;

  // Clear UI
  document.getElementById("budget-display").textContent = "Budget: ₹0";
  document.getElementById("expense-list").innerHTML = "";
  document.getElementById("total-spent").textContent = "0";
  document.getElementById("remaining").textContent = "0";
  document.getElementById("category-bars").innerHTML = ""; // ✅ clear category bars
  updateChart();
}

let chart = null;

function updateChart() {
  const categoryTotals = {};

  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);
  const colors = ['#3498db', '#e67e22', '#9b59b6', '#2ecc71', '#e74c3c'];
  const ctx = document.getElementById('expense-chart').getContext('2d');

  // If chart already exists, destroy and recreate it
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses by Category',
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function exportToCSV() {
  if (expenses.length === 0) {
    alert("No expenses to export!");
    return;
  }

  let csvContent = "Description,Amount,Category\n";

  expenses.forEach(exp => {
    csvContent += `"${exp.description}",${exp.amount},"${exp.category}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "expenses.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function startApp() {
  const name = document.getElementById("username").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  localStorage.setItem("username", name);
  showApp(name);
}

function showApp(userName) {
  const name = userName || localStorage.getItem("username");
  if (!name) return;                          // safety check

  // format today’s date, e.g. “22 June 2025”
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  document.getElementById("greeting").textContent = `Welcome, ${name} — ${today}`;
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
}

function logout() {
  // Optional: clear stored user data (if using localStorage/sessionStorage)
  localStorage.clear();

  // Reset UI and go back to login screen
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('username').value = '';
}

// DARK MODE: Persist and Toggle
function applySavedTheme() {
  const darkModeSetting = localStorage.getItem("darkMode");
  const isDark = darkModeSetting === "enabled";
  document.body.classList.toggle("dark", isDark);
  document.getElementById("darkModeToggle").checked = isDark;
}

function toggleDarkMode() {
  const isDark = document.getElementById("darkModeToggle").checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}


function updateMonthlySummary() {
  if (!expenses || expenses.length === 0) {
    document.getElementById('summary-total').textContent = 0;
    document.getElementById('most-category').textContent = '-';
    document.getElementById('least-category').textContent = '-';
    return;
  }

  let categoryTotals = {};
  let total = 0;

  expenses.forEach(exp => {
    const cat = exp.category;
    const amt = parseFloat(exp.amount);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    total += amt;
  });

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  document.getElementById('summary-total').textContent = total;
  document.getElementById('most-category').textContent = `${sorted[0][0]} (₹${sorted[0][1]})`;
  document.getElementById('least-category').textContent = `${sorted[sorted.length - 1][0]} (₹${sorted[sorted.length - 1][1]})`;
}

function updateCategoryBars() {
  const categoryTotals = {};
  let totalSpent = 0;

  expenses.forEach(exp => {
    const category = exp.category;
    const amount = parseFloat(exp.amount);
    totalSpent += amount;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  const barContainer = document.getElementById("category-bars");
  barContainer.innerHTML = '';

  for (const cat in categoryTotals) {
    const percent = ((categoryTotals[cat] / totalSpent) * 100).toFixed(1);

    const bar = `
      <div class="category-bar">
      <span>${cat}: ₹${categoryTotals[cat]} (${percent}%)</span>
      <div class="progress">
        <div class="fill" style="width: ${percent}%;"></div>
      </div>
      </div>
    `;
    barContainer.innerHTML += bar;
  }
}
