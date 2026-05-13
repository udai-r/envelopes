let data = JSON.parse(localStorage.getItem("financeData")) || {
  totalBalance: 0,
  allocations: []
};

const maxCategories = 10;

function save() {
  localStorage.setItem("financeData", JSON.stringify(data));
}

function render() {
  document.getElementById("totalBalance").value = data.totalBalance;

  const container = document.getElementById("categories");
  container.innerHTML = "";

  data.allocations.forEach((cat, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <input value="${cat.name}" onchange="updateName(${index}, this.value)" />
      <input type="number" value="${cat.amount}" onchange="updateAmount(${index}, this.value)" />
      <button onclick="deleteCategory(${index})">X</button>
    `;

    container.appendChild(div);
  });

  calculate();
}

function calculate() {
  const total = Number(data.totalBalance);
  const allocated = data.allocations.reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const remaining = total - allocated;

  document.getElementById("remaining").innerText =
    "Remaining: " + remaining;

  if (allocated > total) {
    document.getElementById("warning").innerText =
      "Allocations exceed total balance!";
  } else {
    document.getElementById("warning").innerText = "";
  }
}

function updateTotal(value) {
  data.totalBalance = Number(value);
  save();
  calculate();
}

function updateName(index, value) {
  data.allocations[index].name = value;
  save();
}

function updateAmount(index, value) {
  data.allocations[index].amount = Number(value);
  save();
  calculate();
}

function addCategory() {
  if (data.allocations.length >= maxCategories) return;

  data.allocations.push({ name: "New", amount: 0 });
  save();
  render();
}

function deleteCategory(index) {
  data.allocations.splice(index, 1);
  save();
  render();
}

function resetAll() {
  localStorage.removeItem("financeData");
  data = { totalBalance: 0, allocations: [] };
  render();
}

document.getElementById("totalBalance")
  .addEventListener("input", (e) => updateTotal(e.target.value));

render();