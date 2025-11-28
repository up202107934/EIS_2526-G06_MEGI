/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', () => {

  // password
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '🙈' : '👁️';
    });
  });

  
  const form = document.getElementById('register-form');
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const strengthBar = document.getElementById('strength-bar');

  function showError(input, message) {
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

  // força da password
  password.addEventListener('input', () => {
    const val = password.value;
    let strength = 0;

    if (val.length >= 8) strength += 1;
    if (/[A-Z]/.test(val)) strength += 1;
    if (/[0-9]/.test(val)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) strength += 1;

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

    password.dataset.strength = strength;
  });

  // submeter as informacoes
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usernameVal = username.value.trim();
  const emailVal = email.value.trim();
  const passwordVal = password.value;
  const confirmVal = confirmPassword.value;

  if (confirmVal !== passwordVal) {
    alert("Passwords do not match!");
    return;
  }

  const strength = Number(password.dataset.strength);
  if (strength < 3) {
    alert("Please choose a stronger password.");
    return;
  }

  try {
    const res = await fetch("controllers/auth.php?register=1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameVal,
        email: emailVal,
        password: passwordVal,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("Registration failed: " + (data.error || "Unknown error"));
      return;
    }

    alert("Account created successfully!");
    window.location.href = "login.php";

    } catch (err) {
    console.error(err);
    alert("Server error during registration.");
  }
}); // <-- fecha a callback do submit

}); // <-- fecha o DOMContentLoaded
