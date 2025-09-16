const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMSG]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
handleCheckBoxChange(); // initialize properly

// Update slider and display
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

// Set password strength indicator color
function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

// Generate random integer in [min, max)
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generators
function generateRandomNumber() {
  return String(getRndInteger(0, 10)); // "0"–"9"
}

function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123)); // a–z
}

function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 91)); // A–Z
}

function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// Check password strength
function calcStrength() {
  const hasUpper = uppercaseCheck.checked;
  const hasLower = lowercaseCheck.checked;
  const hasNum = numberCheck.checked;
  const hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // strong
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0"); // medium
  } else {
    setIndicator("#f00"); // weak
  }
}

// Copy password to clipboard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => copyMsg.classList.remove("active"), 2000);
}

// Shuffle password characters (Fisher–Yates)
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array.join("");
}

// Handle checkbox changes
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// Listeners
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = parseInt(e.target.value, 10);
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  const funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUppercase);
  if (lowercaseCheck.checked) funcArr.push(generateLowercase);
  if (numberCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbols);

  // Guarantee one of each selected type
  funcArr.forEach((fn) => (password += fn()));

  // Fill remaining characters
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    const randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // Shuffle and show
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});