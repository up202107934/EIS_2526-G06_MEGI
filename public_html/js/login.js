/* 
 */
document.addEventListener("DOMContentLoaded", () => {
  // --------- mostrar/esconder password ---------
  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.querySelector("#password");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password"
          ? "text"
          : "password";
      passwordInput.setAttribute("type", type);
      togglePassword.textContent = type === "password" ? "👁" : "🙈";
    });
  }

  // --------- LOGIN real (chama controllers/auth.php?login=1) ---------
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Preenche o username/email e a password.");
      return;
    }

    try {
      const res = await fetch("controllers/auth.php?login=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!data.ok) {
        alert("Credenciais inválidas.");
        return;
      }

      // Login OK → vai para a home
      window.location.href = "home.php";
    } catch (err) {
      console.error(err);
      alert("Erro ao comunicar com o servidor.");
    }
  });
});
