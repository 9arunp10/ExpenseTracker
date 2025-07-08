// Set Budget and Show It
let expenses = [];
let budget = 0;
// Load saved data on page load
window.onload = function () {
  if (localStorage.getItem("budget")) {
    budget = parseFloat(localStorage.getItem("budget"));
    document.getElementById("budget-display").textContent = `Budget: ₹${budget}`;
  }

  if (localStorage.getItem("expenses")) {
    expenses = JSON.parse(localStorage.getItem("expenses"));
    updateExpenseList();
  }

  updateSummary();
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
  // Clear inputs
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function updateExpenseList() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expenses.forEach((exp, index) => {
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


function updateSummary() {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  document.getElementById("total-spent").textContent = totalSpent;
  const remaining = budget - totalSpent;
  document.getElementById("remaining").textContent = remaining >= 0 ? remaining : 0;
}

function resetTracker() {
  const confirmReset = confirm("Are you sure you want to clear all data?");
  if (!confirmReset) return;

  // Clear local storage and variables
  localStorage.clear();
  expenses = [];
  budget = 0;

  // Clear UI
  document.getElementById("budget-display").textContent = "Budget: ₹0";
  document.getElementById("expense-list").innerHTML = "";
  document.getElementById("total-spent").textContent = "0";
  document.getElementById("remaining").textContent = "0";
}
