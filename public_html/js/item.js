// js/item.js

(() => {
  const $ = (id) => document.getElementById(id);
  const bodyLock = (on) => document.body.style.overflow = on ? 'hidden' : '';

  const editModal = $('editModal');
  const deleteModal = $('deleteModal');

  const open = (m) => {
    if(!m) return;
    m.classList.add('show');
    m.setAttribute('aria-hidden', 'false');
    bodyLock(true);
  };

  const close = (m) => {
    if(!m) return;
    m.classList.remove('show');
    m.setAttribute('aria-hidden', 'true');
    bodyLock(false);
  };

  // Botões de Abrir
  $('btn-edit')?.addEventListener('click', () => open(editModal));
  $('btn-delete')?.addEventListener('click', () => open(deleteModal));

  // Botões de Fechar
  $('edit-close')?.addEventListener('click', () => close(editModal));
  $('edit-cancel')?.addEventListener('click', () => close(editModal));
  $('delete-close')?.addEventListener('click', () => close(deleteModal));
  $('delete-cancel')?.addEventListener('click', () => close(deleteModal));

  // Fechar ao clicar fora
  [editModal, deleteModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) close(modal);
    });
  });

  // Fechar com ESC
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (editModal?.classList.contains('show')) close(editModal);
    if (deleteModal?.classList.contains('show')) close(deleteModal);
  });

  // Save Placeholder
  $('edit-save')?.addEventListener('click', () => {
    // Placeholder: aqui ligas o backend depois
    close(editModal);
  });

  // Delete Confirm
  $('delete-confirm')?.addEventListener('click', () => {
    window.location.href = 'collection.php'; // Ajustei para .php
  });
})();


// ==========================================
// LIKE BUTTON LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");
  const itemNameElem = document.getElementById("itemName");

  if (!likeBtn || !likeCount || !itemNameElem) return;

  const itemId = itemNameElem.textContent.trim();

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