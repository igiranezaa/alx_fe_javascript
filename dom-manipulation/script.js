// ===============================
// STORAGE KEYS
// ===============================
const QUOTES_STORAGE_KEY = "quotes_storage";
const LAST_QUOTE_INDEX_KEY = "last_quote_index";
const LAST_CATEGORY_KEY = "last_selected_category";

// ===============================
// INITIAL QUOTES (fallback)
// ===============================
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Success is a journey, not a destination.", category: "Success" },
  { text: "Happiness depends upon ourselves.", category: "Life" }
];

// ===============================
// DOM REFERENCES
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ===============================
// LOAD QUOTES FROM LOCAL STORAGE
// ===============================
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_STORAGE_KEY);

  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (err) {
      console.error("Error loading stored quotes:", err);
    }
  }
}

// ===============================
// SAVE QUOTES TO LOCAL STORAGE
// ===============================
function saveQuotes() {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

// ===============================
// POPULATE CATEGORIES (Task 2)
// ===============================
function populateCategories() {
  const categories = new Set();

  quotes.forEach(q => categories.add(q.category));

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const lastCat = localStorage.getItem(LAST_CATEGORY_KEY);
  if (lastCat) {
    categoryFilter.value = lastCat;
  }
}

// ===============================
// FILTER QUOTES (Task 2)
// ===============================
function filterQuotes() {
  const selected = categoryFilter.value;

  localStorage.setItem(LAST_CATEGORY_KEY, selected);

  if (selected === "all") {
    displayRandomQuote();
    return;
  }

  const filtered = quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category yet.";
  } else {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;
  }
}

// ===============================
// MAIN FUNCTION (ALX REQUIRED)
// ===============================
function displayRandomQuote() {
  const selected = categoryFilter.value;

  if (selected !== "all") {
    filterQuotes();
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;

  sessionStorage.setItem(LAST_QUOTE_INDEX_KEY, randomIndex);
}

// ===============================
// ALX REQUIRED WRAPPER FUNCTION
// ===============================
function showRandomQuote() {
  displayRandomQuote();
}

// ===============================
// ADD QUOTE — updates categories too
// ===============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields before adding a quote.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();

  quoteDisplay.innerHTML = `New quote added: "${newQuote.text}" (${newQuote.category})`;

  textInput.value = "";
  categoryInput.value = "";

  // Update categories immediately
  populateCategories();
}

// ===============================
// ALX REQUIRED FUNCTION WITH createElement
// ===============================
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const input1 = document.createElement("input");
  input1.placeholder = "Enter quote";

  const input2 = document.createElement("input");
  input2.placeholder = "Enter category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";

  formContainer.appendChild(input1);
  formContainer.appendChild(input2);
  formContainer.appendChild(btn);

  return formContainer;
}

// ===============================
// EXPORT QUOTES (JSON)
// ===============================
function exportQuotesToJson() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes_export.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ===============================
// IMPORT QUOTES (JSON)
// ===============================
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);

      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };

  reader.readAsText(file);
}

// ===============================
// EVENT LISTENERS
// ===============================
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

// ===============================
// INITIALIZE APP
// ===============================
loadQuotes();
populateCategories();

// Load last viewed quote OR random
const lastIndex = sessionStorage.getItem(LAST_QUOTE_INDEX_KEY);

if (lastIndex !== null && quotes[lastIndex]) {
  quoteDisplay.innerHTML = `"${quotes[lastIndex].text}" — (${quotes[lastIndex].category})`;
} else {
  displayRandomQuote();
}
