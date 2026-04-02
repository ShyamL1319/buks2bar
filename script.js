// Data structure for monthly income and expense
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

let monthlyData = {};

// Initialize data structure with random default values between 50 and 1000
function initializeData() {
    months.forEach((month, index) => {
        const key = monthKeys[index];
        const randomIncome = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
        const randomExpense = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
        monthlyData[key] = {
            income: randomIncome,
            expense: randomExpense
        };
    });
}

// Build the months form UI
function buildMonthsUI() {
    const container = document.getElementById('monthsContainer');
    container.innerHTML = '';

    months.forEach((month, index) => {
        const key = monthKeys[index];
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-row';
        
        monthDiv.innerHTML = `
            <div class="month-title">${month}</div>
            <div class="input-wrapper">
                <div class="input-group">
                    <span class="input-group-text">Income</span>
                    <input type="number" class="form-control income-input" data-month="${key}" 
                        placeholder="0.00" min="0" step="0.01" value="${monthlyData[key].income || ''}">
                </div>
                <div class="input-group">
                    <span class="input-group-text">Expense</span>
                    <input type="number" class="form-control expense-input" data-month="${key}" 
                        placeholder="0.00" min="0" step="0.01" value="${monthlyData[key].expense || ''}">
                </div>
            </div>
        `;
        
        container.appendChild(monthDiv);
    });

    // Add event listeners to inputs
    attachInputListeners();
}

// Attach event listeners to input fields
function attachInputListeners() {
    document.querySelectorAll('.income-input, .expense-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const month = e.target.dataset.month;
            const value = parseFloat(e.target.value) || 0;
            
            if (e.target.classList.contains('income-input')) {
                monthlyData[month].income = value;
            } else {
                monthlyData[month].expense = value;
            }
        });
    });
}

// Show feedback message
function showFeedback(message, type) {
    const feedbackAlert = document.getElementById('feedbackAlert');
    feedbackAlert.className = `alert alert-${type} alert-feedback`;
    feedbackAlert.textContent = message;
    feedbackAlert.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedbackAlert.style.display = 'none';
    }, 3000);
}

// Save data to localStorage
function saveToStorage() {
    try {
        localStorage.setItem('buck2bar_data', JSON.stringify(monthlyData));
        showFeedback('✓ Data saved successfully!', 'success');
    } catch (error) {
        showFeedback('✗ Error saving data. Please try again.', 'danger');
        console.error('Save error:', error);
    }
}

// Load data from localStorage
function loadFromStorage() {
    try {
        const savedData = localStorage.getItem('buck2bar_data');
        if (savedData) {
            monthlyData = JSON.parse(savedData);
            buildMonthsUI();
        } else {
            buildMonthsUI();
        }
    } catch (error) {
        console.error('Load error:', error);
        buildMonthsUI();
    }
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        initializeData();
        buildMonthsUI();
        localStorage.removeItem('buck2bar_data');
        showFeedback('✓ All data cleared!', 'info');
    }
}

// Initialize Chart.js chart
let chart = null;

function initializeChart() {
    const incomeData = monthKeys.map(key => monthlyData[key].income);
    const expenseData = monthKeys.map(key => monthlyData[key].expense);

    const ctx = document.getElementById('incomeExpenseChart');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(102, 126, 234, 1)'
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(220, 53, 69, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        },
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        font: {
                            size: 14,
                            weight: '600'
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Download chart as PNG
function downloadChartAsPNG() {
    if (!chart) {
        showFeedback('Please switch to Chart tab first to generate the chart.', 'warning');
        return;
    }

    try {
        // Get canvas element and convert to PNG
        const canvas = document.getElementById('incomeExpenseChart');
        const image = canvas.toDataURL('image/png');
        
        // Create a download link
        const link = document.createElement('a');
        link.href = image;
        link.download = `buck2bar-chart-${new Date().toISOString().split('T')[0]}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showFeedback('✓ Chart downloaded successfully!', 'success');
    } catch (error) {
        showFeedback('✗ Error downloading chart. Please try again.', 'danger');
        console.error('Download error:', error);
    }
}

// Username validation function
function validateUsername(username) {
    const requirements = {
        length: username.length >= 8,
        uppercase: /[A-Z]/.test(username),
        number: /[0-9]/.test(username),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(username)
    };
    
    return requirements;
}

// Update validation UI
function updateValidationUI(username) {
    const requirements = validateUsername(username);
    const feedback = document.getElementById('validationFeedback');
    const submitBtn = document.getElementById('submitBtn');
    
    // Update requirement indicators
    document.getElementById('req-length').className = requirements.length ? 'validation-requirement met' : 'validation-requirement unmet';
    document.getElementById('req-uppercase').className = requirements.uppercase ? 'validation-requirement met' : 'validation-requirement unmet';
    document.getElementById('req-number').className = requirements.number ? 'validation-requirement met' : 'validation-requirement unmet';
    document.getElementById('req-special').className = requirements.special ? 'validation-requirement met' : 'validation-requirement unmet';
    
    // Check if all requirements are met
    const allMet = Object.values(requirements).every(req => req === true);
    
    if (username.length === 0) {
        feedback.className = 'validation-feedback';
        feedback.textContent = '';
        submitBtn.disabled = true;
    } else if (allMet) {
        feedback.className = 'validation-feedback success';
        feedback.textContent = '✓ Username is valid!';
        submitBtn.disabled = false;
    } else {
        feedback.className = 'validation-feedback error';
        feedback.textContent = '✗ Username does not meet all requirements';
        submitBtn.disabled = true;
    }
}

// Handle username submission
function handleUsernameSubmit() {
    const username = document.getElementById('usernameInput').value;
    const requirements = validateUsername(username);
    const allMet = Object.values(requirements).every(req => req === true);
    
    if (allMet) {
        // Store username and show success message
        localStorage.setItem('buck2bar_username', username);
        showFeedback(`✓ Welcome, ${username}! Your account has been created.`, 'success');
        // Optionally reset the input
        // document.getElementById('usernameInput').value = '';
    } else {
        showFeedback('✗ Please ensure your username meets all requirements.', 'danger');
    }
}

// Export functions and variables for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateUsername,
        initializeData,
        showFeedback,
        months,
        monthKeys,
        monthlyData
    };
}

// Only run DOM-dependent code in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize data on page load
        initializeData();
        loadFromStorage();

        // Save button
        document.getElementById('saveBtn').addEventListener('click', saveToStorage);

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', clearAllData);

        // Download chart button
        document.getElementById('downloadChartBtn').addEventListener('click', downloadChartAsPNG);

        // Chart tab event listener
        document.getElementById('chart-tab').addEventListener('shown.bs.tab', function() {
            initializeChart();
        });

        // Username input validation
        document.getElementById('usernameInput').addEventListener('input', function() {
            updateValidationUI(this.value);
        });

        // Submit button for username
        document.getElementById('submitBtn').addEventListener('click', handleUsernameSubmit);

        // Check if username was previously saved
        const savedUsername = localStorage.getItem('buck2bar_username');
        if (savedUsername) {
            document.getElementById('usernameInput').value = savedUsername;
            updateValidationUI(savedUsername);
        }
    });
}
