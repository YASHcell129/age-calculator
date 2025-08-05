// DOM Elements
const ageForm = document.getElementById('ageForm');
const daySelect = document.getElementById('day');
const monthSelect = document.getElementById('month');
const yearInput = document.getElementById('year');
const resultSection = document.getElementById('result');
const errorDiv = document.getElementById('error');

// Result display elements
const yearsSpan = document.getElementById('years');
const monthsSpan = document.getElementById('months');
const daysSpan = document.getElementById('days');
const totalDaysSpan = document.getElementById('totalDays');
const totalHoursSpan = document.getElementById('totalHours');
const totalMinutesSpan = document.getElementById('totalMinutes');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    populateDays();
    setupEventListeners();
});

// Populate days dropdown (1-31)
function populateDays() {
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }
}

// Setup event listeners
function setupEventListeners() {
    ageForm.addEventListener('submit', handleFormSubmit);
    monthSelect.addEventListener('change', updateDaysForMonth);
    yearInput.addEventListener('input', updateDaysForMonth);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    clearMessages();

    try {
        const birthDate = getBirthDate();
        if (!birthDate) return;

        if (!validateDate(birthDate)) return;

        const age = calculateAge(birthDate);
        displayResults(age);

    } catch (error) {
        showError('An error occurred while calculating your age. Please try again.');
        console.error('Age calculation error:', error);
    }
}

// Get birth date from form inputs
function getBirthDate() {
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value);

    if (!day || month === '' || !year) {
        showError('Please fill in all fields.');
        return null;
    }

    return new Date(year, month, day);
}

// Validate the birth date
function validateDate(birthDate) {
    const today = new Date();

    // Check if date is in the future
    if (birthDate > today) {
        showError('Birth date cannot be in the future.');
        return false;
    }

    // Check if date is too far in the past (more than 150 years)
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 150);
    if (birthDate < maxAge) {
        showError('Please enter a valid birth date.');
        return false;
    }

    // Check if the date is valid (handles cases like Feb 30, etc.)
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value);

    if (birthDate.getDate() !== day ||
        birthDate.getMonth() !== month ||
        birthDate.getFullYear() !== year) {
        showError('Please enter a valid date.');
        return false;
    }

    return true;
}

// Calculate age in years, months, and days
function calculateAge(birthDate) {
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate total days, hours, and minutes
    const timeDiff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));

    return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes
    };
}

// Display the calculated age results
function displayResults(age) {
    yearsSpan.textContent = age.years;
    monthsSpan.textContent = age.months;
    daysSpan.textContent = age.days;
    totalDaysSpan.textContent = age.totalDays.toLocaleString();
    totalHoursSpan.textContent = age.totalHours.toLocaleString();
    totalMinutesSpan.textContent = age.totalMinutes.toLocaleString();

    resultSection.classList.add('show');
}

// Update days dropdown based on selected month and year
function updateDaysForMonth() {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value) || new Date().getFullYear();

    if (month === '' || isNaN(month)) return;

    const daysInMonth = getDaysInMonth(month, year);
    const currentDay = parseInt(daySelect.value);

    // Clear and repopulate days
    daySelect.innerHTML = '<option value="">Select Day</option>';

    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Restore previous selection if still valid
    if (currentDay && currentDay <= daysInMonth) {
        daySelect.value = currentDay;
    }
}

// Get number of days in a specific month and year
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    resultSection.classList.remove('show');
}

// Clear all messages
function clearMessages() {
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
}