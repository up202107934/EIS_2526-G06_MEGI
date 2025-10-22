/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

  document.querySelectorAll('.mini-track').forEach(track => {
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone);
  });

