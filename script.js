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
function addExpense() {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please enter valid expense details.");
    return;
  }

  console.log("Expense Added:", desc, amount, category);
  
  // Clear fields
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}