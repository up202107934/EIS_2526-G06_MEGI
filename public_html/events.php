<!DOCTYPE html>
<!--
Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/html.html to edit this template
-->

<html lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Events | MyCollections</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
 
 
  <link rel="stylesheet" href="css/events.css" />
  <script defer src="js/events.js"></script>
</head>
<body>

 
<header class="navbar">
  <!-- Esquerda -->
  <div class="navbar-left">
    <div class="navbar-logo"><a href="home.php">MyCollections</a></div>
  </div>


  <nav class="navbar-center" aria-label="Primary">
    <a id="nav-events" href="events.php">Events</a>
    <a id="nav-mycollections" href="user.php#myCollectionsSection">My Collections</a>
    <a id="nav-team" href="Team.php">Team</a>
  </nav>

 
  <div class="navbar-right">
    <div class="navbar-search">
      <input id="q" type="search" placeholder="Search events..." />
      <button id="btn-search" class="search-btn" aria-label="Search">🔎</button>
    </div>

    <div class="navbar-avatar-wrapper">
  <img class="navbar-avatar" src="img/user.jpg" alt="User" id="profileBtn">
  
  <div class="profile-dropdown" id="profileDropdown">
    <a href="user.php">👤 Ver Perfil</a>
    <a href="home.php">🚪 Log Out</a>
  </div>
</div>


    <button id="themeToggle" class="theme-toggle">🌙</button>
  </div>
</header>


  <main>
    <h1 class="events-title">EVENTS</h1>

   
<section class="events-toolbar pro">
  <div class="toolbar-left">
    <div class="view-toggle" role="group" aria-label="View toggle">
      <button id="btn-grid" class="chip chip-toggle" aria-pressed="true" title="Grid view">
        <span class="icon-grid" aria-hidden="true"></span>
        <span>Grid</span>
      </button>
      <button id="btn-list" class="chip chip-toggle" aria-pressed="false" title="List view">
        <span class="icon-list" aria-hidden="true"></span>
        <span>List</span>
      </button>
    </div>
  </div>

  <div class="toolbar-center">
    <label class="field">
      <span>Sort</span>
      <select id="sort">
        <option value="date_asc">Date (↑)</option>
        <option value="date_desc">Date (↓)</option>
        <option value="name_asc">Name (A→Z)</option>
        <option value="name_desc">Name (Z→A)</option>
      </select>
    </label>

    <label class="field">
      <span>Status</span>
      <select id="status">
        <option value="">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
      </select>
    </label>
  </div>

  <div class="toolbar-right">
    <button id="btn-new" class="btn primary">+ New Event</button>
  </div>
</section>

   
    <section id="events" class="collections-container"></section>
  </main>

  <!-- detalhes do evento -->
  <div id="eventDetail" class="ev-modal" aria-hidden="true">
    <div class="ev-card" role="dialog" aria-modal="true" aria-labelledby="ev-name">
      <button class="ev-close" id="ev-close" aria-label="Close">✕</button>

      <h3 id="ev-name" class="ev-title">Event name</h3>
      <p id="ev-date" class="ev-subtitle">04/05/2025, 18:00</p>

      <p id="ev-desc" class="ev-desc">Short description of the event goes here.</p>
      <!-- Coleções do evento -->
      <div class="ev-collections">
        <div class="ev-col-head">
          <h4 class="ev-col-title">Collections in the event</h4>
          <span id="ev-col-count" class="ev-badge">0</span>
        </div>

        <div id="ev-col-list" class="ev-col-list" aria-live="polite"></div>
      </div>
      
      <div class="ev-actions">
        <button id="d-review" class="btn outline">Rate</button>
        <button id="d-join" class="btn">Participate</button>
      </div>
    </div> 
  </div>   

  <!-- avaliação do evento -->
<div id="reviewForm" class="modal" aria-hidden="true">
  <div class="modal-content">
    <span class="close" id="review-close" aria-label="Close">×</span>
    <h2 id="rv-title">Rate event</h2>

    <div class="rv-stars" role="radiogroup" aria-label="Classification from 1 to 5 stars">
      <button type="button" class="star" data-value="1" aria-label="1 star">★</button>
      <button type="button" class="star" data-value="2" aria-label="2 star">★</button>
      <button type="button" class="star" data-value="3" aria-label="3 star">★</button>
      <button type="button" class="star" data-value="4" aria-label="4 star">★</button>
      <button type="button" class="star" data-value="5" aria-label="5 star">★</button>
    </div>

    <textarea id="rv-comment" rows="4" placeholder="Leave your comment (optional)"></textarea>

    <div class="modal-buttons">
      <button id="rv-cancel">Cancel</button>
      <button id="rv-submit" class="btn">Submit rating</button>
    </div>
  </div>
</div>

  
  
  <!-- Itens da coleção no evento -->
  <div id="colItems" class="modal" aria-hidden="true">
    <div class="modal-content">
      <span class="close" id="colItems-close" aria-label="Close">×</span>
      <h2 id="colItems-title">Collection Items</h2>
      <div id="colItems-grid" class="mini-grid"></div>
    </div>
  </div>
   
  
  
  
  <div id="eventForm" class="modal" aria-hidden="true">
    <div class="modal-content">
      <span class="close" id="form-close" aria-label="Close">×</span>
      <h2 id="f-title">New Event</h2>

      <label>Name
        <input id="f-name" required />
      </label>

      <label>Date and Time
        <input id="f-date" type="datetime-local" required />
      </label>

      <label>Description
        <textarea id="f-desc" rows="4" placeholder="Short description"></textarea>
      </label>
      
      <label>Location
        <input id="f-loc" placeholder="City / venue">
      </label>

      
          <h3 class="ev-col-title" style="margin-top:14px;">Collections and Items</h3>
    <p class="muted" style="margin-bottom:8px;">Choose the collections for this event and, for each one, the items. At least one item in total.</p>

   
    <div id="f-col-list" class="pick-grid"></div>

   
    <div id="f-items-wrap" style="margin-top:10px;"></div>


      <div class="modal-buttons">
        <button id="f-cancel">Cancel</button>
        <button id="f-save" class="btn">Save</button>
      </div>
    </div>
  </div>

<div id="joinForm" class="modal" aria-hidden="true">
  <div class="modal-content wide">
    <span class="close" id="join-close" aria-label="Close">×</span>
    <h2 id="join-title">Participate in the event</h2>

  
    <ol class="wizard">
      <li class="done"   id="w-step-1">Collections</li>
      <li class=""       id="w-step-2">Items</li>
      <li class=""       id="w-step-3">Data</li>
    </ol>

    <!-- STEP 1: escolher coleções -->
    <section id="join-step-1" class="join-step">
      <p class="muted">Choose collections to take.</p>
      <div id="user-col-list" class="pick-grid"></div>
      <div class="modal-buttons">
        <button id="join-next-1" class="btn">Continue</button>
      </div>
    </section>

    <!-- STEP 2: escolher itens por coleção -->
    <section id="join-step-2" class="join-step" hidden>
      <div id="items-per-collection"></div>
      <div class="modal-buttons">
        <button id="join-back-2">Back</button>
        <button id="join-next-2" class="btn">Continue</button>
      </div>
    </section>

    <!-- STEP 3: dados pessoais -->
    <section id="join-step-3" class="join-step" hidden>
      <div class="twocol">
        <label>Name
          <input id="jf-name" required>
        </label>
        <label>Date of Birth
          <input id="jf-dob" type="date" required>
        </label>
      </div>
      <div class="twocol">
        <label>E-mail
          <input id="jf-email" type="email" required>
        </label>
        <label>Phone Number
          <input id="jf-phone" type="tel" required>
        </label>
      </div>
      <label>Comment (optional)
        <textarea id="jf-note" rows="3" placeholder="E.g. why do you take that collection…"></textarea>
      </label>

      <div class="modal-buttons">
        <button id="join-back-3">Back</button>
        <button id="join-submit" class="btn">Confirm participation</button>
      </div>
    </section>
  </div>
</div>


<footer class="footer">
  <p>© 2025 MyCollections | All rights reserved.</p>
</footer>
  

</body>
</html>
