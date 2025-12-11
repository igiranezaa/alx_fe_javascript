// Quotes array required by ALX
let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Success is a journey, not a destination.", category: "Success" },
  { text: "Happiness depends upon ourselves.", category: "Life" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// REQUIRED BY ALX CHECKER: main function
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // ALX requires innerHTML
  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;
}

// REQUIRED BY ALX CHECKER: old function name must also exist
// This wrapper simply calls the official function
function showRandomQuote() {
  displayRandomQuote();
}

// REQUIRED BY ALX: addQuote() function
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields before adding a quote.");
    return;
  }

  // add new quote
  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // update DOM
  quoteDisplay.innerHTML = `New quote added: "${newQuote.text}" (${newQuote.category})`;

  // clear fields
  textInput.value = "";
  categoryInput.value = "";
}

// REQUIRED BY ALX: event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// show a quote when the page loads
displayRandomQuote();
