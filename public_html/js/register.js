/* js/register.js - COMPLETO */

document.addEventListener('DOMContentLoaded', () => {

  // ==================================================
  // 1. LÓGICA DO OLHO (MOSTRAR/ESCONDER PASSWORD)
  // ==================================================
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      // Vai buscar o ID do input alvo (ex: "password" ou "confirm-password")
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      
      if (input) {
        const isPassword = input.type === 'password';
        // Troca o tipo do input
        input.type = isPassword ? 'text' : 'password';
        // Troca o ícone
        btn.textContent = isPassword ? '🙈' : '👁️';
      }
    });
  });

  // ==================================================
  // 2. FORÇA DA PASSWORD (BARRA COLORIDA)
  // ==================================================
  const password = document.getElementById('password');
  const strengthBar = document.getElementById('strength-bar');

  if (password && strengthBar) {
      password.addEventListener('input', () => {
        const val = password.value;
        let strength = 0;

        if (val.length >= 8) strength += 1;
        if (/[A-Z]/.test(val)) strength += 1;
        if (/[0-9]/.test(val)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) strength += 1;

        // Atualiza a barra visualmente
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
        // Guarda o valor num atributo para usarmos no submit
        password.dataset.strength = strength;
      });
  }

  // ==================================================
  // 3. ENVIO DO FORMULÁRIO (REGISTO)
  // ==================================================
  const form = document.getElementById('register-form');

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Buscar elementos
      const nameInput = document.getElementById('name');
      const dobInput = document.getElementById('date_of_birth');
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('confirm-password');
      const fileInput = document.getElementById('profile_img');

      // 3.1 - Validar Passwords Iguais
      if (confirmInput.value !== passwordInput.value) {
        alert("Passwords do not match!");
        return;
      }

      // 3.2 - Validar Força (Opcional, se quiseres forçar)
      // const strength = Number(passwordInput.dataset.strength || 0);
      // if (strength < 2) { alert("Password too weak!"); return; }

      // 3.3 - Criar FormData com TODOS os campos
      const formData = new FormData();
      formData.append("name", nameInput.value.trim());
      formData.append("date_of_birth", dobInput.value);
      formData.append("username", usernameInput.value.trim());
      formData.append("email", emailInput.value.trim());
      formData.append("password", passwordInput.value);

      // Adicionar imagem APENAS se o user escolheu uma
      if (fileInput && fileInput.files[0]) {
        formData.append("profile_img", fileInput.files[0]);
      }

      try {
        // Enviar para o servidor
        const res = await fetch("controllers/auth.php?register=1", {
          method: "POST",
          body: formData
        });

        // Tentar ler a resposta como JSON
        const data = await res.json(); // <-- Se der erro aqui, é porque o PHP enviou HTML de erro

        if (!data.ok) {
          alert("Registration failed: " + (data.error || "Unknown error"));
          return;
        }

        alert("Account created successfully! 🚀");
        window.location.href = "login.php";

      } catch (err) {
        console.error("Erro no registo:", err);
        alert("Server error. Check console for details.");
      }
    });
  }

});