let data = JSON.parse(localStorage.getItem("financeData")) || {
  totalBalance: 0,
  allocations: []
};

const maxCategories = 10;

function save() {
  localStorage.setItem("financeData", JSON.stringify(data));
}

function formatINR(num) {
  return Number(num).toLocaleString("en-IN");
}

function render() {
  document.getElementById("totalBalance").value = data.totalBalance;

  const container = document.getElementById("categories");
  container.innerHTML = "";

  data.allocations.forEach((cat, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <input value="${cat.name}" oninput="updateName(${index}, this.value)" />
      <input type="number" value="${cat.amount}" oninput="updateAmount(${index}, this.value)" />
      <button onclick="deleteCategory(${index})">X</button>
    `;

    container.appendChild(div);
  });

  calculate();
}

function calculate() {
  const total = Number(data.totalBalance);
  const allocated = data.allocations.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  const remaining = total - allocated;

  document.getElementById("remaining").innerText =
    "Remaining: ₹ " + formatINR(remaining);

  if (allocated > total) {
    document.getElementById("warning").innerText =
      "Allocations exceed total balance!";
  } else {
    document.getElementById("warning").innerText = "";
  }
}

function updateTotal(value) {
  const clean = value.toString().replace(/,/g, "");
  data.totalBalance = Number(clean);
  save();
  calculate();
}

function updateName(index, value) {
  data.allocations[index].name = value;
  save();
}

function updateAmount(index, value) {
  const clean = value.toString().replace(/,/g, "");
  const newAmount = Number(clean);

  // simulate updated allocations
  const tempAllocations = [...data.allocations];
  tempAllocations[index].amount = newAmount;

  const totalAllocated = tempAllocations.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  if (totalAllocated > data.totalBalance) {
    document.getElementById("warning").innerText =
      "Allocations exceed total balance!";
    return; // 🚫 block invalid update
  }

  data.allocations[index].amount = newAmount;
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

function manualSave() {
  save();
  alert("Data saved!");
}

// Event listener
document
  .getElementById("totalBalance")
  .addEventListener("input", (e) => updateTotal(e.target.value));

render();


// ✅ PWA INSTALL LOGIC
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;
  console.log("User choice:", outcome);

  deferredPrompt = null;
});