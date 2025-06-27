// Set Budget and Show It
let budget = 0;
function setBudget() {
  const budgetInput = document.getElementById("budget");
  const budgetValue = parseFloat(budgetInput.value);

  if (isNaN(budgetValue) || budgetValue <= 0) {
    alert("Please enter a valid budget greater than 0.");
    return;
  }
  budget = budgetValue;
  // Show it on the page
  const display = document.getElementById("budget-display");
  display.textContent = `Budget: ₹${budget}`;
  // Clear the input field after setting
  budgetInput.value = "";
}
//  Add Expense Input Handler (basic skeleton)
let expenses = []; // global array to store expense data

function addExpense() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please enter valid expense details.");
    return;
  }

  const expense = {
    description: desc,
    amount: amount,
    category: category,
  };

  expenses.push(expense); // add to global array
  updateExpenseList();     // show on screen

  // Clear inputs
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function updateExpenseList() {
  const list = document.getElementById("expense-list");
  list.innerHTML = ""; // clear previous list

  expenses.forEach((exp, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${exp.description}</strong><br>
      ₹${exp.amount} <span class="category">[${exp.category}]</span>
    `;
    list.appendChild(item);
  });
}
