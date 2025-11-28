/* user.js LIMPO (sem modal antigo, sem localStorage de coleções) */

const form        = document.getElementById('userForm');
const statusMsg   = document.getElementById('statusMsg');
const photoModal  = document.getElementById('photoModal');
const editPhotoBtn = document.getElementById('editPhotoBtn');
const closeModalX = document.getElementById('closeModal');
const photoInput  = document.getElementById('photoInput');
const profileImage = document.getElementById('profileImage');
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');

/* Guardar dados do perfil */
form?.addEventListener('submit', e => {
  e.preventDefault();
  const first = document.getElementById('firstName').value.trim();
  const last  = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!first || !last || !email) return alert("Please fill all required fields!");

  displayName.textContent = `${first} ${last}`;
  displayEmail.textContent = email;

  statusMsg.style.display = "inline";
  setTimeout(() => statusMsg.style.display = "none", 2000);
});

/* Modal de foto */
editPhotoBtn?.addEventListener('click', () => photoModal.style.display = 'flex');
closeModalX?.addEventListener('click', () => photoModal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === photoModal) photoModal.style.display = 'none'; });

photoInput?.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    profileImage.src = ev.target.result;
    localStorage.setItem('profileImage', ev.target.result);
  };
  reader.readAsDataURL(file);
  photoModal.style.display = 'none';
});

const savedPhoto = localStorage.getItem('profileImage');
if (savedPhoto) profileImage.src = savedPhoto;

/* Dark Mode */
(function initDarkMode() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
})();
