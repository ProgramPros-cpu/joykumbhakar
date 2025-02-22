// ------------------------
// Sidebar and Navigation
// ------------------------

// Toggle the sidebar
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show the selected tab and hide all others
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });
    const selected = document.getElementById(tabName);
    if (selected) {
        selected.style.display = 'block';
    }
}

// ------------------------
// Code Editor Functions
// ------------------------

// Insert basic HTML structure into the code editor
function insertHtml() {
    const editor = document.getElementById('codeEditor');
    editor.value = "<!DOCTYPE html>\n<html lang='en'>\n<head>\n\t<meta charset='UTF-8'>\n\t<meta name='viewport' content='width=device-width, initial-scale=1.0'>\n\t<title>Document</title>\n</head>\n<body>\n\n</body>\n</html>";
}

// Auto-insert HTML skeleton when "!" is at the end and Enter is pressed
document.getElementById('codeEditor').addEventListener('keydown', function(event) {
    const editor = event.target;
    const code = editor.value;
    if (code.endsWith('!') && event.key === 'Enter') {
        event.preventDefault();
        editor.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title</title>
</head>
<body>
    
</body>
</html>`;
    }
});

// Save code from the editor as an HTML file
document.getElementById('saveBtn').addEventListener('click', function() {
    const code = document.getElementById('codeEditor').value;
    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    link.click();
});

// Run code from the editor and display the output in both an output box and an iframe (if available)
document.getElementById('runBtn').addEventListener('click', function() {
    const code = document.getElementById('codeEditor').value;
    const outputBox = document.getElementById('outputBox');
    if (outputBox) {
        outputBox.innerHTML = code;
    }
    const iframe = document.getElementById('output');
    if (iframe) {
        iframe.srcdoc = code;
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

// Append a digit or character to the digital calculator display (input with id "display")
function appendValue(value) {
    const display = document.getElementById('display');
    display.value += value;
}

// Append an operator to the digital calculator display
function appendOperator(operator) {
    const display = document.getElementById('display');
    display.value += operator;
}

// Clear the digital calculator display
function clearDisplay() {
    const display = document.getElementById('display');
    display.value = '';
}

// Remove the last character (backspace) from the digital calculator display
function backspace() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

// Update the history dropdown with a new calculation entry
function updateHistory(expression, result) {
    const historySelect = document.getElementById('history');
    const option = document.createElement('option');
    option.value = expression;  // Store the original expression as the value
    option.text = `${expression} = ${result}`;
    historySelect.add(option);
}

// Evaluate the expression in the digital calculator display with % support
function calculateResult() {
    const display = document.getElementById('display');
    const expression = display.value; // Save the original expression
    try {
        // Replace occurrences like "50%" with "(50/100)"
        let processedExpression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
        const result = eval(processedExpression);
        display.value = result;
        // Update history with the original expression and its result
        updateHistory(expression, result);
    } catch (error) {
        display.value = 'Error';
    }
}

// Add event listener for history dropdown changes
document.getElementById('history').addEventListener('change', function() {
    const display = document.getElementById('display');
    display.value = this.value;
});

// ------------------------
// Contact Form - EmailJS Integration
// ------------------------

// When the user submits the contact form, send an email via EmailJS
function sendEmail(event) {
    event.preventDefault(); // Prevent default form submission

    // Send the form data using EmailJS
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', event.target)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert('Your message has been sent!');
    }, function(error) {
        console.error('FAILED...', error);
        alert('Error sending message.');
    });
}

// ------------------------
// Sound and Interaction
// ------------------------

// Play a click sound (ensure an element with id "click-sound" exists)
function playSound() {
    const clickSound = document.getElementById('click-sound');
    if (clickSound) {
        clickSound.play().catch(error => {
            console.error("Error playing sound:", error);
        });
    }
}

// ------------------------
// Dark Mode Functionality
// ------------------------

// Toggle dark mode on/off based on a checkbox (element with id "themeToggle")
function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

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

// Apply saved theme preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        if (themeToggle) themeToggle.checked = true;
    } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
});

// ------------------------
// Clock Functionality
// ------------------------

// Update and display the clock (element with id "clock" should exist)
function updateClock() {
    const now = new Date();
    // Convert UTC to IST (UTC +5:30)
    const ISTOffset = 5.5 * 60 * 60 * 1000;
    const ISTTime = new Date(now.getTime() + ISTOffset);

    const hours = String(ISTTime.getUTCHours()).padStart(2, '0');
    const minutes = String(ISTTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(ISTTime.getUTCSeconds()).padStart(2, '0');

    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
setInterval(updateClock, 1000);
updateClock();
