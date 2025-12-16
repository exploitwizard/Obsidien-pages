// Backend API URL - Change this to your deployed backend URL
const API_URL = 'http://localhost:5000/api'; // Local during development
// For production, use: 'https://your-backend.herokuapp.com/api' or similar

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const successPage = document.getElementById('successPage');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Toggle between forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    clearMessages();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    clearMessages();
});

// Clear all messages
function clearMessages() {
    document.getElementById('message').textContent = '';
    document.getElementById('registerMessage').textContent = '';
}

// Show message
function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.color = isError ? '#ff6b6b' : '#51cf66';
    element.style.padding = '10px';
    element.style.borderRadius = '5px';
    element.style.marginBottom = '15px';
    element.style.backgroundColor = isError ? 'rgba(255, 107, 107, 0.1)' : 'rgba(81, 207, 102, 0.1)';
}

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Show success page
            showSuccessPage(data.user);
        } else {
            showMessage('message', data.error || 'Login failed', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('message', 'Connection error. Please try again.', true);
    }
});

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('registerMessage', 'Passwords do not match!', true);
        return;
    }
    
    if (password.length < 6) {
        showMessage('registerMessage', 'Password must be at least 6 characters', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok || response.status === 201) {
            showMessage('registerMessage', 'Registration successful! Please login.', false);
            
            // Auto-switch to login form after 2 seconds
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                clearMessages();
                // Pre-fill login form
                document.getElementById('loginUsername').value = username;
            }, 2000);
        } else {
            showMessage('registerMessage', data.error || 'Registration failed', true);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('registerMessage', 'Connection error. Please try again.', true);
    }
});

// Show success page
function showSuccessPage(user) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    successPage.style.display = 'block';
    
    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.username}!`;
    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('displayEmail').textContent = user.email;
}

// Handle Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    successPage.style.display = 'none';
    loginForm.style.display = 'block';
    clearFormFields();
});

// Clear form fields
function clearFormFields() {
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showSuccessPage(user);
    }
});