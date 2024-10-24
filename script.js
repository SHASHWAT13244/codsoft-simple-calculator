let display = document.getElementById('display');
let historyDisplay = document.getElementById('history');
let errorMessage = document.getElementById('error-message');
let memoryValue = 0;
let advancedVisible = false;
let graphVisible = false;
let unitConverterVisible = false;
let soundEnabled = true;
let musicEnabled = false;

function appendToDisplay(value) {
    if (display.innerText === '0' || display.innerText === 'Error') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
    clearError();
    playSound();
    applyGlow();
}

function clearAll() {
    display.innerText = '0';
    clearHistory();
}

function clearHistory() {
    historyDisplay.innerHTML = '';
}

function calculate() {
    try {
        const result = eval(display.innerText.replace(/×/g, '*').replace(/÷/g, '/'));
        historyDisplay.innerHTML += `<div class="history-item fade-in">${display.innerText} = ${result}</div>`;
        display.innerText = result;
        clearError();
        playSound();
        fadeInHistory();
        applyGlow();
    } catch (error) {
        display.innerText = 'Error';
        errorMessage.innerText = 'Invalid expression';
        playSound();
    }
}

function fadeInHistory() {
    const items = historyDisplay.children;
    if (items.length > 0) {
        items[items.length - 1].classList.add('fade-in');
    }
}

function applyGlow() {
    display.classList.add('glow');
    setTimeout(() => {
        display.classList.remove('glow');
    }, 500);
}

function toggleAdvanced() {
    advancedVisible = !advancedVisible;
    document.getElementById('advanced-functions').style.display = advancedVisible ? 'block' : 'none';
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-status').innerText = soundEnabled ? 'On' : 'Off';
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const music = document.getElementById('backgroundMusic');
    if (musicEnabled) {
        music.play();
        document.getElementById('music-status').innerText = 'On';
    } else {
        music.pause();
        document.getElementById('music-status').innerText = 'Off';
    }
}

function saveHistory() {
    const historyItems = historyDisplay.innerHTML;
    const blob = new Blob([historyItems], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculator_history.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function playSound() {
    if (soundEnabled) {
        document.getElementById('buttonSound').play();
    }
}

function clearError() {
    errorMessage.innerText = '';
}

function convertUnit() {
    const value = parseFloat(document.getElementById('valueToConvert').value);
    const unit = document.getElementById('unitSelect').value;
    let result;

    switch (unit) {
        case 'cmToInch':
            result = value / 2.54;
            break;
        case 'inchToCm':
            result = value * 2.54;
            break;
        case 'celsiusToFahrenheit':
            result = (value * 9 / 5) + 32;
            break;
        case 'fahrenheitToCelsius':
            result = (value - 32) * 5 / 9;
            break;
    }
    document.getElementById('conversionResult').innerText = `Converted Value: ${result}`;
}

function toggleGraph() {
    graphVisible = !graphVisible;
    document.getElementById('graph-container').style.display = graphVisible ? 'block' : 'none';
    if (graphVisible) {
        const ctx = document.getElementById('graph').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0', '1', '2', '3', '4', '5'],
                datasets: [{
                    label: 'Sample Data',
                    data: [0, 10, 5, 2, 20, 30],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function toggleUnitConverter() {
    unitConverterVisible = !unitConverterVisible;
    document.getElementById('unit-converter').style.display = unitConverterVisible ? 'block' : 'none';
}

// Advanced calculations
function calculatePercentage() {
    let value = parseFloat(display.innerText);
    display.innerText = value / 100;
}

function calculateSquareRoot() {
    let value = parseFloat(display.innerText);
    display.innerText = Math.sqrt(value);
}

function memoryAdd() {
    memoryValue += parseFloat(display.innerText);
}

function memorySubtract() {
    memoryValue -= parseFloat(display.innerText);
}

function memoryRecall() {
    display.innerText = memoryValue;
}

function calculateSine() {
    let value = parseFloat(display.innerText);
    display.innerText = Math.sin(value);
}

function calculateCosine() {
    let value = parseFloat(display.innerText);
    display.innerText = Math.cos(value);
}

function calculateTangent() {
    let value = parseFloat(display.innerText);
    display.innerText = Math.tan(value);
}

function calculateLogarithm() {
    let value = parseFloat(display.innerText);
    display.innerText = Math.log(value);
}

function calculateExponent() {
    let value = parseFloat(display.innerText);
    display.innerText = Math.pow(value, 2);
}

// Keyboard input handling
document.addEventListener('keydown', function(event) {
    const key = event.key;

    // Number keys
    if (!isNaN(key)) {
        appendToDisplay(key);
    }

    // Operator keys
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key === '*' ? '×' : key === '/' ? '÷' : key);
    }

    // Equals key
    if (key === 'Enter') {
        calculate();
    }

    // Clear key (C)
    if (key.toUpperCase() === 'C') {
        clearAll();
    }

    // Handle decimal point
    if (key === '.') {
        appendToDisplay(key);
    }

    // Handle Backspace to clear last character
    if (key === 'Backspace') {
        if (display.innerText.length > 1) {
            display.innerText = display.innerText.slice(0, -1);
        } else {
            display.innerText = '0';
        }
    }
});
