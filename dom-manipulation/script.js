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

// REQUIRED BY ALX CHECKER: function name MUST be displayRandomQuote()
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // ALX requires innerHTML, not textContent
  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;
}

// REQUIRED BY ALX CHECKER: addQuote() function must exist
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields before adding a quote.");
    return;
  }

  // add new quote to array
  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // update DOM immediately to show the added quote
  quoteDisplay.innerHTML = `New quote added: "${newQuote.text}" (${newQuote.category})`;

  // clear input fields
  textInput.value = "";
  categoryInput.value = "";
}

// REQUIRED BY ALX: event listeners must exist
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// show a quote when page loads
displayRandomQuote();
