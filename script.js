// Toggle the sidebar
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show the selected tab
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
}

// Insert HTML structure into the code editor when '1' is typed
function insertHtml() {
    const editor = document.getElementById('codeEditor');
    editor.value = "<!DOCTYPE html>\n<html lang='en'>\n<head>\n\t<meta charset='UTF-8'>\n\t<meta name='viewport' content='width=device-width, initial-scale=1.0'>\n\t<title>Document</title>\n</head>\n<body>\n\n</body>\n</html>";
}

// EMI Calculator
function calculateEMI() {
    const loanAmount = document.getElementById('loanAmount').value;
    const interestRate = document.getElementById('interestRate').value;
    const loanTenure = document.getElementById('loanTenure').value;

    const principal = parseFloat(loanAmount);
    const interest = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTenure) * 12;

    const emi = (principal * interest * Math.pow(1 + interest, months)) / (Math.pow(1 + interest, months) - 1);
    document.getElementById('emiResult').innerText = `Your EMI is ₹${emi.toFixed(2)}`;
}

// Normal Calculator
function performCalculation() {
    const input = document.getElementById('normalInput').value;
    const result = eval(input); // Basic calculator using eval() (for demonstration only)
    document.getElementById('normalResult').innerText = `Result: ${result}`;
}

// Special Price Calculator
function calculateSpecialPrice() {
    const pricePerKg = document.getElementById('weightPrice').value;
    const weightInGrams = document.getElementById('weight').value;
    const price = (parseFloat(pricePerKg) * parseFloat(weightInGrams)) / 1000;
    document.getElementById('specialPriceResult').innerText = `Price for ${weightInGrams} grams: ₹${price.toFixed(2)}`;
}

// Send Contact Form Email
function sendEmail(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Here you can integrate an email API like EmailJS, SMTP, etc.
    fetch('https://your-email-sending-service.com/send', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        alert('Your message has been sent!');
    }).catch(error => {
        alert('Error sending message.');
    });
}
// Commercial Calculator Functions

// Profit Margin Calculation
function calculateProfitMargin() {
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const profitMargin = ((sellingPrice - costPrice) / sellingPrice) * 100;
    document.getElementById('commercialResult').innerText = `Profit Margin: ${profitMargin.toFixed(2)}%`;
}

// Discount Calculation
function calculateDiscount() {
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const discount = ((sellingPrice - costPrice) / sellingPrice) * 100;
    document.getElementById('commercialResult').innerText = `Discount: ${discount.toFixed(2)}%`;
}

// Markup Calculation
function calculateMarkup() {
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const percentage = parseFloat(document.getElementById('percentage').value);
    const markupPrice = costPrice * (1 + (percentage / 100));
    document.getElementById('commercialResult').innerText = `Markup Price: ₹${markupPrice.toFixed(2)}`;
}
// Append value to calculator input
function appendToInput(value) {
    const input = document.getElementById('calculatorInput');
    input.value += value;
}

// Clear the calculator input
function clearInput() {
    const input = document.getElementById('calculatorInput');
    input.value = '';
}

// Calculate the result
function calculateResult() {
    const input = document.getElementById('calculatorInput');
    try {
        input.value = eval(input.value); // Calculate the result using eval
    } catch (error) {
        input.value = 'Error'; // Handle invalid inputs gracefully
    }
}
// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    // Toggle the dark mode class on the body
    if (themeToggle.checked) {
        body.classList.add('dark');
        body.classList.remove('light');
        localStorage.setItem('theme', 'dark'); // Save the preference
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light'); // Save the preference
    }
}

// On page load, apply the saved theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        document.getElementById('themeToggle').checked = true;
    } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
});
// Listen for input and replace with HTML5 structure when "!" and Enter are typed
document.getElementById('codeEditor').addEventListener('input', function(event) {
    let editor = event.target;
    let code = editor.value;
    
    // Check if user typed an opening tag and insert the closing tag
    const lastWord = code.split(/\s/).pop(); // Get the last word typed by the user
    
    // Regular expression to match opening HTML tags
    const tagMatch = lastWord.match(/^<([a-zA-Z]+)$/);
    
    if (tagMatch) {
        // If it's an opening tag like <tag>
        const tag = tagMatch[1]; // Get the tag name
        if (code.endsWith('>')) {
            // Automatically add the closing tag
            editor.value = code + `</${tag}>`;
        }
    }
});

// Listen for input and replace with HTML5 structure when "!" and Enter are typed
document.getElementById('codeEditor').addEventListener('keydown', function(event) {
    let editor = event.target;
    let code = editor.value;

    // Check if user typed '!' and pressed Enter
    if (code.endsWith('!') && event.key === 'Enter') {
        event.preventDefault(); // Prevent default Enter behavior (new line)
        editor.value = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title</title>
</head>
<body>
    
</body>
</html>
        `;
    }
});

// Save code as .html
document.getElementById('saveBtn').addEventListener('click', function() {
    const code = document.getElementById('codeEditor').value;
    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    link.click();
});

// Run code in iframe
document.getElementById('runBtn').addEventListener('click', function() {
    const code = document.getElementById('codeEditor').value;
    const iframe = document.getElementById('output');
    
    // Open the code in the iframe
    iframe.srcdoc = code; // Set the content of the iframe
});
// Run code in output box
document.getElementById('runBtn').addEventListener('click', function() {
    const code = document.getElementById('codeEditor').value;
    const outputBox = document.getElementById('outputBox');

    // Set the code content inside the output box
    outputBox.innerHTML = code;  // Render HTML inside the output box
});
// working clock
function updateClock() {
    const now = new Date();
    // Convert UTC to IST (UTC + 5:30)
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    const ISTTime = new Date(now.getTime() + ISTOffset);

    const hours = String(ISTTime.getUTCHours()).padStart(2, '0');
    const minutes = String(ISTTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(ISTTime.getUTCSeconds()).padStart(2, '0');

    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
  }

  // Update the clock every second
  setInterval(updateClock, 1000);
  updateClock(); // Initial call to display the clock immediately




  
