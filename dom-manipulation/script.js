// ===============================
// STORAGE KEYS
// ===============================
const QUOTES_STORAGE_KEY = "quotes_storage";
const LAST_QUOTE_INDEX_KEY = "last_quote_index";

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
// MAIN FUNCTION (ALX REQUIRED)
// ===============================
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;

  // Save last viewed quote in session storage
  sessionStorage.setItem(LAST_QUOTE_INDEX_KEY, randomIndex);
}

// ===============================
// ALX REQUIRED WRAPPER FUNCTION
// ===============================
function showRandomQuote() {
  displayRandomQuote();
}

// ===============================
// ADD QUOTE
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
}

// ===============================
// ALX REQUIRED FUNCTION USING createElement & appendChild
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
// EXPORT QUOTES TO JSON
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
// IMPORT QUOTES FROM JSON FILE
// ===============================
function importFromJsonFile(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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

// If sessionStorage has last viewed quote, show it
const lastIndex = sessionStorage.getItem(LAST_QUOTE_INDEX_KEY);
if (lastIndex !== null && quotes[lastIndex]) {
  quoteDisplay.innerHTML = `"${quotes[lastIndex].text}" — (${quotes[lastIndex].category})`;
} else {
  displayRandomQuote();
}
