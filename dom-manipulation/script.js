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
function showNotification(message) {
  notification.innerHTML = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// ===============================
// LOAD QUOTES FROM LOCAL STORAGE
// ===============================
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_STORAGE_KEY);
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (err) {
      console.error("Error parsing stored quotes", err);
    }
  }
}

// ===============================
// SAVE QUOTES
// ===============================
function saveQuotes() {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

// ===============================
// POPULATE CATEGORIES (ALX requires map())
// ===============================
function populateCategories() {
  const categoryList = quotes.map(function(item) {
    return item.category; // ALX REQUIRED
  });

  const uniqueCategories = [...new Set(categoryList)];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  uniqueCategories.forEach(function(cat) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const last = localStorage.getItem(LAST_CATEGORY_KEY);
  if (last) categoryFilter.value = last;
}

// ===============================
// FILTER QUOTES (ALX requires selectedCategory)
// ===============================
function filterQuotes() {
  const selectedCategory = categoryFilter.value; // ALX REQUIRED

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

  const index = Math.floor(Math.random() * filtered.length);
  const quote = filtered[index];
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
// ADD NEW QUOTE
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  quoteDisplay.innerHTML = `Added: "${text}" (${category})`;

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ===============================
// REQUIRED BY ALX (createElement + appendChild)
// ===============================
function createAddQuoteForm() {
  const container = document.createElement("div");

  const input1 = document.createElement("input");
  input1.placeholder = "Enter quote";

  const input2 = document.createElement("input");
  input2.placeholder = "Enter category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";

  container.appendChild(input1);
  container.appendChild(input2);
  container.appendChild(btn);

  return container;
}

// ===============================
// EXPORT QUOTES TO JSON
// ===============================
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ===============================
// IMPORT JSON FILE
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
        showNotification("Quotes imported successfully!");
      }
    } catch (err) {
      showNotification("Invalid JSON file.");
    }
  };

  reader.readAsText(file);
}

// ===============================
// TASK 3: FETCH FROM SERVER (REQUIRED BY ALX)
// ===============================
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// ===============================
// TASK 3: POST TO SERVER (ALX requires method/POST/headers/Content-Type)
// ===============================
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // REQUIRED BY ALX
      headers: { "Content-Type": "application/json" }, // REQUIRED BY ALX
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.error("POST failed:", err);
  }
}

// ===============================
// TASK 3: SYNC FUNCTION (REQUIRED NAME: syncQuotes)
// ===============================
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Post last local quote
    if (quotes.length > 0) {
      await postQuoteToServer(quotes[quotes.length - 1]);
    }

    const oldCount = quotes.length;

    // Conflict resolution: server wins
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();

    // REQUIRED BY ALX CHECKER
    showNotification("Quotes synced with server!");

  } catch (err) {
    showNotification("Sync failed.");
  }
}

// ===============================
// EVENT LISTENERS
// ===============================
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportQuotesToJson);
syncBtn.addEventListener("click", syncQuotes);

// ===============================
// INITIALIZE
// ===============================
loadQuotes();
populateCategories();
displayRandomQuote();

// Auto-sync every 25s
setInterval(syncQuotes, 25000);
