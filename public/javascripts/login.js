const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.sign-in form');
    const registerForm = document.querySelector('.sign-up form');
    const loginLink = document.querySelector('.sign-up .underline');
    const registerLink = document.querySelector('.sign-in .underline');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        console.log('Login attempt with email:', email);
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        console.log('Register attempt with:', { name, email });
    });

    // Add mobile navigation between forms
    loginLink.addEventListener('click', () => {
        container.classList.remove('active');
    });

    registerLink.addEventListener('click', () => {
        container.classList.add('active');
    });
});