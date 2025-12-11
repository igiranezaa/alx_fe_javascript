// Initial quotes (local array only for Task 0)
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Success is a journey, not a destination.", category: "Success" },
  { text: "Happiness depends upon ourselves.", category: "Life" },
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
}

// Function to dynamically add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const quoteText = textInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both fields to add a quote.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);

  // Update DOM immediately
  quoteDisplay.textContent = `New quote added: "${newQuote.text}" (${newQuote.category})`;

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Display an initial quote when page loads
showRandomQuote();
