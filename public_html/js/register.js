/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================== TOGGLE PASSWORD ==================
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '🙈' : '👁️';
    });
  });

  // ================== FORM VALIDATION ==================
  const form = document.getElementById('register-form');
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const strengthBar = document.getElementById('strength-bar');

  function showError(input, message) {
  // procura o <small> dentro do .form-group, não apenas dentro do .password-wrapper
  const small = input.closest('.form-group').querySelector('small');
  small.textContent = message;
  small.style.color = 'red';
  input.style.borderColor = 'red';
}

function showSuccess(input) {
  const small = input.closest('.form-group').querySelector('small');
  small.textContent = '✔';
  small.style.color = 'green';
  input.style.borderColor = 'green';
}


  function checkEmail(input) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(input.value.trim());
  }

  // Validação em tempo real
  username.addEventListener('input', () => {
    if(username.value.trim().length < 4) showError(username, 'Username must be at least 4 characters');
    else showSuccess(username);
  });

  email.addEventListener('input', () => {
    if(!checkEmail(email)) showError(email, 'Invalid email format');
    else showSuccess(email);
  });

  confirmPassword.addEventListener('input', () => {
    if(confirmPassword.value !== password.value) showError(confirmPassword, 'Passwords do not match');
    else showSuccess(confirmPassword);
  });

  // ================== PASSWORD STRENGTH ==================
  password.addEventListener('input', () => {
    const val = password.value;
    let strength = 0;

    if (val.length >= 8) strength += 1;
    if (/[A-Z]/.test(val)) strength += 1;
    if (/[0-9]/.test(val)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) strength += 1;

    // Atualiza barra
    switch (strength) {
      case 0:
      case 1:
        strengthBar.style.width = '25%';
        strengthBar.style.backgroundColor = 'red';
        break;
      case 2:
        strengthBar.style.width = '50%';
        strengthBar.style.backgroundColor = 'orange';
        break;
      case 3:
        strengthBar.style.width = '75%';
        strengthBar.style.backgroundColor = 'yellowgreen';
        break;
      case 4:
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = 'green';
        break;
    }

    // Guarda força para submit
    password.dataset.strength = strength;
  });

  // ================== SUBMIT ==================//
form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const strength = Number(password.dataset.strength) || 0;

  
  if (confirmPassword.value !== password.value) {
    showError(confirmPassword, 'Passwords do not match');
    alert('Passwords do not match. Please check again.');
    return;
  }

  if (strength < 3) {
    alert('Please use a stronger password before continuing.');
    return;
  }

  showSuccess(confirmPassword);
  alert('Account created successfully!');
  window.location.href = "user.html";
}); 
});