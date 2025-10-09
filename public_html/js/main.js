<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Page | My Collections</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <section class="user-section">
    <h1 class="user-title">User Profile</h1>

    <div class="user-container">
      <!-- Foto do utilizador -->
      <div class="user-photo">
        <img src="img/user.jpg" alt="User Photo">
      </div>

      <!-- Informações -->
      <div class="user-info">
        <h2>Joana Ferreira</h2>
        <p>Email: <a href="mailto:up202106097@up.pt">up202106097@up.pt</a></p>
        <p>Member since: January 2025</p>
        <p>Total Collections: 5</p>
        <p>Total Items: 37</p>

        <!-- Botão Edit Profile -->
        <a href="#" class="btn edit-user" id="openModalBtn">Edit Profile</a>

        <!-- Modal -->
        <div id="editModal" class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Profile</h2>
            <form id="edit-user-form">
              <label for="username">Name</label>
              <input type="text" id="username" name="username" required>

              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>

              <label for="password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="password" name="password" required>
                <button type="button" class="toggle-password">Show</button>
              </div>

              <button type="submit" class="btn">Save Changes</button>
            </form>
          </div>
        </div>

      </div>
    </div>

    <h2 class="user-collections-title">My Collections</h2>

    <div class="user-collections">
      <div class="collection-card">
        <img src="img/collection1.jpg" alt="Star Wars Miniatures">
        <h3>Star Wars Miniatures</h3>
        <p>Items: 8</p>
        <a href="collection.html" class="btn">View Collection</a>
      </div>

      <div class="collection-card">
        <img src="img/collection2.jpg" alt="Comic Books">
        <h3>Comic Books</h3>
        <p>Items: 10</p>
        <a href="collection.html" class="btn">View Collection</a>
      </div>

      <div class="collection-card">
        <img src="img/collection3.jpg" alt="Coins">
        <h3>Coins</h3>
        <p>Items: 6</p>
        <a href="collection.html" class="btn">View Collection</a>
      </div>

    </div>
  </section>

  <script>
    // Seleção de elementos
    const modal = document.getElementById('editModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('edit-user-form');
    const nameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');

    const userNameEl = document.querySelector('.user-info h2');
    const userEmailEl = document.querySelector('.user-info p a');

    // Função para abrir e fechar modal
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      modal.style.display = 'block';
      // Preenche inputs com os valores atuais
      nameInput.value = localStorage.getItem('userName') || 'Joana Ferreira';
      emailInput.value = localStorage.getItem('userEmail') || 'up202106097@up.pt';
      passwordInput.value = localStorage.getItem('userPassword') || '123456';
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

    // Toggle password
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    // Salvar alterações
    form.addEventListener('submit', e => {
      e.preventDefault();

      const newName = nameInput.value.trim();
      const newEmail = emailInput.value.trim();
      const newPassword = passwordInput.value;

      // Guardar no localStorage
      localStorage.setItem('userName', newName);
      localStorage.setItem('userEmail', newEmail);
      localStorage.setItem('userPassword', newPassword);

      // Atualizar na página
      userNameEl.textContent = newName;
      userEmailEl.textContent = newEmail;
      userEmailEl.href = 'mailto:' + newEmail;

      modal.style.display = 'none';
      alert('Profile updated successfully!');
    });

    // Carregar info do localStorage ao abrir a página
    window.addEventListener('load', () => {
      const savedName = localStorage.getItem('userName');
      const savedEmail = localStorage.getItem('userEmail');
      if(savedName) userNameEl.textContent = savedName;
      if(savedEmail){
        userEmailEl.textContent = savedEmail;
        userEmailEl.href = 'mailto:' + savedEmail;
      }
    });
  </script>

</body>
</html>

// Seleção de elementos
const editPhotoBtn = document.getElementById('editPhotoBtn');
const photoModal = document.getElementById('photoModal');
const closePhotoModal = document.getElementById('closePhotoModal');
const profileFileInput = document.getElementById('profileFileInput');
const profileImage = document.getElementById('profileImage');

// Abrir modal
editPhotoBtn.addEventListener('click', () => {
  photoModal.style.display = 'block';
});

// Fechar modal
closePhotoModal.addEventListener('click', () => {
  photoModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if(e.target === photoModal){
    photoModal.style.display = 'none';
  }
});

// Atualizar imagem de perfil
profileFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(event){
      profileImage.src = event.target.result;
      localStorage.setItem('profileImage', event.target.result); // guarda a imagem
    }
    reader.readAsDataURL(file);
    photoModal.style.display = 'none';
  }
});

// Carregar imagem salva
window.addEventListener('load', () => {
  const savedImage = localStorage.getItem('profileImage');
  if(savedImage){
    profileImage.src = savedImage;
  }
});
