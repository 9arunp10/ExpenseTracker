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
