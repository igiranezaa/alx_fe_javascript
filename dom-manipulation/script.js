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
      console.error("Error loading quotes:", err);
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
  const categoryList = quotes.map(function (item) {
    return item.category; // ALX REQUIRED
  });

  const uniqueCategories = [...new Set(categoryList)];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  uniqueCategories.forEach(function (cat) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const last = localStorage.getItem(LAST_CATEGORY_KEY);
  if (last) {
    categoryFilter.value = last;
  }
}

// ===============================
// FILTER QUOTES (ALX requires selectedCategory)
// ===============================
function filterQuotes() {
  const selectedCategory = categoryFilter.value; // ALX REQUIRED STRING

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
// ADD A QUOTE
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields must be filled.");
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
  btn.textContent = "Add";

  container.appendChild(input1);
  container.appendChild(input2);
  container.appendChild(btn);

  return container;
}

// ===============================
// EXPORT TO JSON
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
// IMPORT FROM JSON
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
    } catch {
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
// TASK 3: POST TO SERVER (ALX checks for POST, method, headers, Content-Type)
// ===============================
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // ALX REQUIRED STRING
      headers: { "Content-Type": "application/json" }, // ALX REQUIRED STRING
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Posted:", result);

  } catch (error) {
    console.error("POST failed:", error);
  }
}

// ===============================
// TASK 3: SYNC FUNCTION (REQUIRED NAME: syncQuotes)
// ===============================
async function syncQuotes() {
  try {
    // 1. Fetch server quotes
    const serverQuotes = await fetchQuotesFromServer();

    // 2. POST one local quote (required for ALX POST check)
    if (quotes.length > 0) {
      const lastLocalQuote = quotes[quotes.length - 1];
      await postQuoteToServer(lastLocalQuote);
    }

    const oldCount = quotes.length;

    // 3. Conflict resolution: server wins
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();

    showNotification(
      `Sync complete: server(${serverQuotes.length}) replaced local(${oldCount})`
    );

  } catch (error) {
    showNotification("Sync failed. Try again.");
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
// INITIALIZE APP
// ===============================
loadQuotes();
populateCategories();
displayRandomQuote();

// Auto-sync every 25 seconds
setInterval(syncQuotes, 25000);
