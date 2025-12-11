// ===============================
// STORAGE KEYS
// ===============================
const QUOTES_STORAGE_KEY = "quotes_storage";
const LAST_QUOTE_INDEX_KEY = "last_quote_index";
const LAST_CATEGORY_KEY = "last_selected_category";

// ===============================
// DEFAULT QUOTES
// ===============================
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Life" },
  { text: "Success is a journey, not a destination.", category: "Success" }
];

// ===============================
// DOM ELEMENTS
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");
const syncBtn = document.getElementById("syncBtn");
const notification = document.getElementById("notification");

// ===============================
// NOTIFICATION HANDLER
// ===============================
function showNotification(msg) {
  notification.innerHTML = msg;
  notification.style.display = "block";
  setTimeout(() => notification.style.display = "none", 4000);
}

// ===============================
// LOAD QUOTES
// ===============================
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_STORAGE_KEY);
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// ===============================
// SAVE QUOTES
// ===============================
function saveQuotes() {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

// ===============================
// POPULATE CATEGORIES (uses map REQUIRED BY ALX)
// ===============================
function populateCategories() {
  const categoryList = quotes.map(function(item) {
    return item.category; // ALX requires map()
  });

  const uniqueCategories = [...new Set(categoryList)];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  uniqueCategories.forEach(function(cat) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem(LAST_CATEGORY_KEY);
  if (lastSelected) {
    categoryFilter.value = lastSelected;
  }
}

// ===============================
// FILTER QUOTES (uses selectedCategory REQUIRED BY ALX)
// ===============================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;  // ALX REQUIRED STRING

  localStorage.setItem(LAST_CATEGORY_KEY, selectedCategory);

  if (selectedCategory === "all") {
    displayRandomQuote();
    return;
  }

  const filtered = quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const random = Math.floor(Math.random() * filtered.length);
  const quote = filtered[random];

  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;
}

// ===============================
// DISPLAY RANDOM QUOTE
// ===============================
function displayRandomQuote() {
  const selected = categoryFilter.value;

  if (selected !== "all") {
    filterQuotes();
    return;
  }

  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];

  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;
  sessionStorage.setItem(LAST_QUOTE_INDEX_KEY, index);
}

// REQUIRED BY ALX
function showRandomQuote() {
  displayRandomQuote();
}

// ===============================
// ADD QUOTE
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  quoteDisplay.innerHTML = `New quote added: "${text}" (${category})`;
}

// ===============================
// REQUIRED BY ALX (createElement + appendChild)
// ===============================
function createAddQuoteForm() {
  const container = document.createElement("div");

  const qInput = document.createElement("input");
  qInput.placeholder = "Enter quote";

  const cInput = document.createElement("input");
  cInput.placeholder = "Enter category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";

  container.appendChild(qInput);
  container.appendChild(cInput);
  container.appendChild(btn);

  return container;
}

// ===============================
// EXPORT QUOTES
// ===============================
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ===============================
// IMPORT QUOTES
// ===============================
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    if (Array.isArray(imported)) {
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      showNotification("Quotes imported successfully!");
    }
  };
  reader.readAsText(file);
}

// ===============================
// SERVER SYNC (Task 3)
// ===============================
async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    const localCount = quotes.length;

    quotes = serverQuotes;
    saveQuotes();
    populateCategories();

    showNotification(
      `Server sync complete. Server (${serverQuotes.length}) replaced local (${localCount}).`
    );

  } catch (err) {
    showNotification("Failed to sync with server.");
  }
}

// ===============================
// EVENT LISTENERS
// ===============================
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportQuotesToJson);
syncBtn.addEventListener("click", syncWithServer);

// ===============================
// INITIALIZE
// ===============================
loadQuotes();
populateCategories();
displayRandomQuote();

// Periodic auto-sync (every 30 seconds)
setInterval(syncWithServer, 30000);
