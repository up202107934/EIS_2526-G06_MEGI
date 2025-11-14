/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

(() => {
  const $ = (id) => document.getElementById(id);

  const bodyLock = (on) => document.body.style.overflow = on ? 'hidden' : '';

  const editModal = $('editModal');
  const deleteModal = $('deleteModal');

  const open = (m) => {
    m.classList.add('show');
    m.setAttribute('aria-hidden', 'false');
    bodyLock(true);
  };

  const close = (m) => {
    m.classList.remove('show');
    m.setAttribute('aria-hidden', 'true');
    bodyLock(false);
  };

  // Open
  $('btn-edit')?.addEventListener('click', () => open(editModal));
  $('btn-delete')?.addEventListener('click', () => open(deleteModal));

  // Close (X, cancel)
  $('edit-close')?.addEventListener('click', () => close(editModal));
  $('edit-cancel')?.addEventListener('click', () => close(editModal));
  $('delete-close')?.addEventListener('click', () => close(deleteModal));
  $('delete-cancel')?.addEventListener('click', () => close(deleteModal));

  // Close clicking outside
  [editModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close(modal);
    });
  });

  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (editModal.classList.contains('show')) close(editModal);
    if (deleteModal.classList.contains('show')) close(deleteModal);
  });

  // Save button
  $('edit-save')?.addEventListener('click', () => {
    // Placeholder: aqui ligas o backend depois
    close(editModal);
  });

  // Delete confirm
  $('delete-confirm')?.addEventListener('click', () => {
    window.location.href = 'collection.html';
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  
  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");

  // Guarda likes por item (cada item pode ter ID diferente)
  const itemId = document.getElementById("itemName").textContent.trim();

  // Carregar do localStorage
  const savedLikes = localStorage.getItem("likes_" + itemId);
  const savedState = localStorage.getItem("liked_" + itemId);

  if (savedLikes !== null) {
    likeCount.textContent = savedLikes;
  }

  if (savedState === "true") {
    likeBtn.classList.add("liked");
    likeBtn.textContent = "❤";
  }

  likeBtn.addEventListener("click", () => {
    let count = parseInt(likeCount.textContent);

    if (likeBtn.classList.contains("liked")) {
      // remover like
      count--;
      likeBtn.classList.remove("liked");
      likeBtn.textContent = "♡";
      localStorage.setItem("liked_" + itemId, false);
    } else {
      // dar like
      count++;
      likeBtn.classList.add("liked");
      likeBtn.textContent = "❤";
      localStorage.setItem("liked_" + itemId, true);
    }

    likeCount.textContent = count;
    localStorage.setItem("likes_" + itemId, count);
  });

});

// === DARK MODE TOGGLE ===
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem("theme");

  // aplicar o tema guardado
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  // alterações de tema
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

// === PROFILE DROPDOWN (caso exista no item) ===
const avatarButton = document.getElementById('avatarButton');
const profileDropdown = document.getElementById('profileDropdown');

if (avatarButton && profileDropdown) {

  avatarButton.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });

  window.addEventListener('click', () => {
    if (profileDropdown.classList.contains('show')) {
      profileDropdown.classList.remove('show');
    }
  });
}


// === DROPDOWN DO PERFIL ===
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  if (!profileBtn || !dropdown) return;

  profileBtn.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});
