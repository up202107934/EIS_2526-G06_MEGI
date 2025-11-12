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

