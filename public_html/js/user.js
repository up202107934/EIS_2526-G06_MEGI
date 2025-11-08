/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const form = document.getElementById('userForm');
const statusMsg = document.getElementById('statusMsg');
const photoModal = document.getElementById('photoModal');
const editPhotoBtn = document.getElementById('editPhotoBtn');
const closeModal = document.getElementById('closeModal');
const photoInput = document.getElementById('photoInput');
const profileImage = document.getElementById('profileImage');
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();
  const first = document.getElementById('firstName').value.trim();
  const last = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!first || !last || !email){
    alert("Please fill all required fields!");
    return;
  }
  displayName.textContent = first + " " + last;
  displayEmail.textContent = email;
  statusMsg.style.display = "inline";
  setTimeout(() => statusMsg.style.display = "none", 2000);
});

// Modal logic
editPhotoBtn.addEventListener('click', () => photoModal.style.display = 'flex');
closeModal.addEventListener('click', () => photoModal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === photoModal) photoModal.style.display = 'none'; });

// Change photo
photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ev => {
      profileImage.src = ev.target.result;
      localStorage.setItem('profileImage', ev.target.result);
    }
    reader.readAsDataURL(file);
    photoModal.style.display = 'none';
  }
});

// Load saved photo
const savedPhoto = localStorage.getItem('profileImage');
if(savedPhoto) profileImage.src = savedPhoto;
