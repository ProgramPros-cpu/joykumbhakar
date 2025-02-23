// ------------------------
// Sidebar and Navigation
// ------------------------

// Toggle the sidebar
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show the selected tab and hide all others
function showTab(tabId) {
    console.log("Attempting to show tab:", tabId); // Debugging

    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // Show the selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        console.log("Tab found:", tabId);
        selectedTab.style.display = 'block';
    } else {
        console.error("Tab not found:", tabId);
    }
}

// ------------------------
// Code Editor Functions
// ------------------------

// Insert basic HTML structure into the code editor
function insertHtml() {
    const editor = document.getElementById('codeEditor');
    editor.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

</body>
</html>`;
}

// Auto-insert HTML skeleton when "!" is typed and Enter is pressed
document.getElementById('codeEditor')?.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && this.value.endsWith('!')) {
        event.preventDefault();
        insertHtml();
    }
});

// Save code from the editor as an HTML file
document.getElementById('saveBtn')?.addEventListener('click', function () {
    const code = document.getElementById('codeEditor').value;
    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    link.click();
});

// Run code from the editor and display the output
document.getElementById('runBtn')?.addEventListener('click', function () {
    const code = document.getElementById('codeEditor').value;
    const outputBox = document.getElementById('outputBox');
    if (outputBox) {
        outputBox.innerHTML = code;
    }
});

// ------------------------
// Calculators
// ------------------------

// EMI Calculator
function calculateEMI() {
    const loanAmount = document.getElementById('loanAmount').value;
    const interestRate = document.getElementById('interestRate').value;
    const loanTenure = document.getElementById('loanTenure').value;

    const principal = parseFloat(loanAmount);
    const interest = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTenure) * 12;

    let emi;
    if (interest === 0) {
        emi = principal / months;
    } else {
        emi = (principal * interest * Math.pow(1 + interest, months)) /
              (Math.pow(1 + interest, months) - 1);
    }
    document.getElementById('emiResult').innerText = `Your EMI is ₹${emi.toFixed(2)}`;
}

// Normal Calculator (using eval for demonstration purposes)
function performCalculation() {
    const input = document.getElementById('normalInput').value;
    try {
        const result = eval(input);
        document.getElementById('normalResult').innerText = `Result: ${result}`;
    } catch (error) {
        document.getElementById('normalResult').innerText = 'Error in calculation';
    }
}

// Special Price Calculator
function calculateSpecialPrice() {
    const pricePerKg = document.getElementById('weightPrice').value;
    const weightInGrams = document.getElementById('weight').value;
    const price = (parseFloat(pricePerKg) * parseFloat(weightInGrams)) / 1000;
    document.getElementById('specialPriceResult').innerText = `Price for ${weightInGrams} grams: ₹${price.toFixed(2)}`;
}

// Commercial Calculator Functions

// Calculate Profit Margin
function calculateProfitMargin() {
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const profitMargin = ((sellingPrice - costPrice) / sellingPrice) * 100;
    document.getElementById('commercialResult').innerText = `Profit Margin: ${profitMargin.toFixed(2)}%`;
}

// Calculate Discount
function calculateDiscount() {
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const discount = ((sellingPrice - costPrice) / sellingPrice) * 100;
    document.getElementById('commercialResult').innerText = `Discount: ${discount.toFixed(2)}%`;
}

// Calculate Markup Price
function calculateMarkup() {
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const percentage = parseFloat(document.getElementById('percentage').value);
    const markupPrice = costPrice * (1 + (percentage / 100));
    document.getElementById('commercialResult').innerText = `Markup Price: ₹${markupPrice.toFixed(2)}`;
}

// ------------------------
// Digital Calculator Functions & History
// ------------------------
// Array to store calculation history
let history = [];

// Append a value to the display
function appendValue(value) {
    const display = document.getElementById('display');
    display.value += value;
}

// Append an operator to the display
function appendOperator(operator) {
    const display = document.getElementById('display');
    display.value += operator;
}

// Clear the display
function clearDisplay() {
    const display = document.getElementById('display');
    display.value = '';
}

// Remove the last character (backspace)
function backspace() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

// Calculate the result and add to history
function calculateResult() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value);
        display.value = result;

        // Add calculation to history
        history.push(`${display.value} = ${result}`);
        updateHistory();
        saveHistory();
    } catch (error) {
        display.value = 'Error';
    }
}

// Update the history dropdown
function updateHistory() {
    const historyDropdown = document.getElementById('history-dropdown');
    historyDropdown.innerHTML = '<option value="">Select a calculation</option>'; // Clear the dropdown

    // Add each history item to the dropdown
    history.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = item;
        historyDropdown.appendChild(option);
    });
}

// Handle dropdown selection
function selectHistoryItem() {
    const historyDropdown = document.getElementById('history-dropdown');
    const selectedIndex = historyDropdown.value;

    if (selectedIndex !== '') {
        const selectedCalculation = history[selectedIndex].split(' = ')[0]; // Get the calculation part
        document.getElementById('display').value = selectedCalculation;
    }
}

// Calculate square root
function calculateSquareRoot() {
    const display = document.getElementById('display');
    try {
        const value = parseFloat(display.value);
        if (value >= 0) {
            display.value = Math.sqrt(value);
            history.push(`√${value} = ${display.value}`);
            updateHistory();
            saveHistory();
        } else {
            display.value = 'Error';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Append percentage
function appendPercentage() {
    const display = document.getElementById('display');
    try {
        const value = parseFloat(display.value);
        display.value = value / 100;
        history.push(`${value}% = ${display.value}`);
        updateHistory();
        saveHistory();
    } catch (error) {
        display.value = 'Error';
    }
}

// Append power (x², x³, xⁿ)
function appendPower(power) {
    const display = document.getElementById('display');
    try {
        const value = parseFloat(display.value);
        if (power === 'n') {
            const exponent = prompt('Enter the exponent (n):');
            if (exponent !== null) {
                display.value = Math.pow(value, parseFloat(exponent));
                history.push(`${value}^${exponent} = ${display.value}`);
                updateHistory();
                saveHistory();
            }
        } else {
            display.value = Math.pow(value, parseFloat(power));
            history.push(`${value}^${power} = ${display.value}`);
            updateHistory();
            saveHistory();
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Clear history
function clearHistory() {
    history = [];
    updateHistory();
    saveHistory();
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Load history from localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistory();
    }
}

// Call loadHistory when the page loads
window.addEventListener('load', loadHistory);

// ------------------------
// Contact Form
// ------------------------

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;

    // Create mailto link
    var mailtoLink = `mailto:programpros7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}
        Email: ${email}
        Phone: ${phone}
        ${message}`
    )}`;

    // Open the email client
    window.location.href = mailtoLink;
});

// ------------------------
// Dark Mode Functionality
// ------------------------

function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        if (themeToggle.checked) {
            body.classList.add('dark');
            body.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light');
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
}

// Apply saved theme preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        if (themeToggle) themeToggle.checked = true;
    } else {
        document.body.classList.add('light');
    }
});

// ------------------------
// Clock Functionality
// ------------------------

function updateClock() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);

    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

setInterval(updateClock, 1000);
updateClock();
