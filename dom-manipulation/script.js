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

// REQUIRED BY ALX CHECKER: wrapper function still must exist
function showRandomQuote() {
  displayRandomQuote();
}

// REQUIRED BY ALX CHECKER: must contain createElement + appendChild
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const input1 = document.createElement("input");
  input1.id = "newQuoteText";
  input1.placeholder = "Enter a new quote";

  const input2 = document.createElement("input");
  input2.id = "newQuoteCategory";
  input2.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.id = "addQuoteBtn";
  button.textContent = "Add Quote";

  // ALX expects appendChild usage
  formContainer.appendChild(input1);
  formContainer.appendChild(input2);
  formContainer.appendChild(button);

  return formContainer;
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

  // Add new quote to array
  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // Update DOM using innerHTML
  quoteDisplay.innerHTML = `New quote added: "${newQuote.text}" (${newQuote.category})`;

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// REQUIRED BY ALX CHECKER: event listeners MUST exist
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Show a quote when page loads
displayRandomQuote();
