/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));


const IS_GUEST = document.body && document.body.classList.contains('no-auth');


const state = {
  view: 'grid',
  sort: 'date_asc',
  status: '',
  q: '',
  // Eventos + imagens (coleções do evento)
  events: [
    {
  id: 1,
  name: 'Star Wars Day',
  date: '2025-05-04T18:00',
  description: 'Meetup de colecionadores Star Wars.',
  images: [
    'collection1.jpg','collection2.jpg','collection3.jpg','collection4.jpg','collection5.jpg',
    'starwars-banner.jpg','falcon.jpg','stormtrooper.jpg'
  ],
  collections: [
    {
      name: 'Collection1',
      img: 'collection1.jpg',
      items: [
        { name: 'Millennium Falcon 1979', img: 'falcon.jpg' },
        { name: 'Stormtrooper Mk I',      img: 'stormtrooper.jpg' },
        { name: 'Banner 1997',            img: 'starwars-banner.jpg' }
      ]
    },
    {
      name: 'Collection2',
      img: 'collection2.jpg',
      items: [
        { name: 'Poster X', img: 'collection2.jpg' },
        { name: 'Poster Y', img: 'collection3.jpg' }
      ]
    },
    {
      name: 'Collection3',
      img: 'collection3.jpg',
      items: [
        { name: 'Selos raros A', img: 'collection3.jpg' },
        { name: 'Selos raros B', img: 'collection4.jpg' }
      ]
    }
  ]
},

      
    
    {
      id: 2,
      name: 'Coin Fair Lisboa',
      date: '2025-11-25T10:00',
      description: 'Rare coins and banknotes fair.',
      images: ['coin1.jpg','coin2.jpg','coin3.jpg','coin4.jpg','coin5.jpg']
    },
    {
      id: 3,
      name: 'Retro Expo Porto',
      date: '2025-12-02T15:00',
      description: 'Retro exhibition with miniatures and comics.',
      images: ['stamp1.jpg','stamp2.jpg','stamp3.jpg','stamp4.jpg','train1.jpg','collection2.jpg']
    }
  ],
  joined: new Set(JSON.parse(localStorage.getItem('joinedEvents') || '[]')),
  ratings: JSON.parse(localStorage.getItem('eventRatings') || '{}')

};

// --- Like ---
state.interested = new Set(JSON.parse(localStorage.getItem('interestedEvents') || '[]'));
const interestCounts = JSON.parse(localStorage.getItem('interestCounts') || '{}');

function saveInterest(){
  localStorage.setItem('interestedEvents', JSON.stringify([...state.interested]));
  localStorage.setItem('interestCounts', JSON.stringify(interestCounts));
}

function getInterestCount(id){
  if (interestCounts[id] === null) interestCounts[id] = 0;
  return interestCounts[id];
}

function toggleInterest(id){
  const wasOn = state.interested.has(id);
  if (wasOn){
    state.interested.delete(id);
    interestCounts[id] = Math.max(0, (interestCounts[id]||0) - 1);
  } else {
    state.interested.add(id);
    interestCounts[id] = (interestCounts[id]||0) + 1;
  }
  saveInterest();
  // atualizar o cartão
  const btn = document.querySelector(`.like-btn[data-id="${id}"]`);
  const cnt = document.getElementById(`like-${id}`);
  if (btn) btn.setAttribute('aria-pressed', String(!wasOn));
  if (cnt) cnt.textContent = interestCounts[id] || 0;
}


// Coleções do user
state.userCollections = [
  {
    id: 'c1', name: 'Collection1', img: 'collection1.jpg',
    items: [
      { id: 'c1i1', name: 'Item 1', img: 'collection1.jpg' },
      { id: 'c1i2', name: 'Item 2', img: 'falcon.jpg' }
    ]
  },
  {
    id: 'c2', name: 'Collection2', img: 'collection2.jpg',
    items: [
      { id: 'c2i1', name: 'Poster X', img: 'collection2.jpg' },
      { id: 'c2i2', name: 'Poster Y', img: 'stormtrooper.jpg' },
      { id: 'c2i3', name: 'Poster Z', img: 'starwars-banner.jpg' }
    ]
  },
  {
    id: 'c3', name: 'Collection3', img: 'collection3.jpg',
    items: [
      { id: 'c3i1', name: 'Coins A', img: 'coin1.jpg' },
      { id: 'c3i2', name: 'Coins B', img: 'coin2.jpg' }
    ]
  }
];

// registo das participações
state.participations = []; // {eventId, collections:[{id, items:[ids]}], user:{...}}


function saveJoined(){ localStorage.setItem('joinedEvents', JSON.stringify([...state.joined])); }
function saveRatings(){ localStorage.setItem('eventRatings', JSON.stringify(state.ratings)); }
function isUpcoming(iso){ return new Date(iso) > new Date(); }
function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleString([], { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

const carousels = new Map(); // id -> { timer, idx, imgs }


function render(){
  const wrap = $('#events');

  // limpar timers antigos
  carousels.forEach(c => clearInterval(c.timer));
  carousels.clear();

  // Filtros e ordenação
  let rows = [...state.events];
  if (state.q) rows = rows.filter(e => e.name.toLowerCase().includes(state.q.toLowerCase()));
  if (state.status === 'upcoming') rows = rows.filter(e => isUpcoming(e.date));
  if (state.status === 'past')     rows = rows.filter(e => !isUpcoming(e.date));

  rows.sort((a,b) => {
    switch(state.sort){
      case 'date_desc': return new Date(b.date) - new Date(a.date);
      case 'name_asc':  return a.name.localeCompare(b.name);
      case 'name_desc': return b.name.localeCompare(a.name);
      case 'date_asc':
      default:          return new Date(a.date) - new Date(b.date);
    }
  });

  
 wrap.innerHTML = rows.map(ev => {
  const imgs   = (ev.images && ev.images.length ? ev.images : ['event-placeholder.jpg']);
  const main   = imgs[0];
  const thumbs = imgs.slice(1, 4); // até 3 miniaturas

  return `
  <article class="collection-card event-card" data-id="${ev.id}" tabindex="0" aria-label="${ev.name}">
    <div class="ev-gallery" data-id="${ev.id}">
      <img class="ev-main" src="img/${main}" alt="${ev.name}">
      <div class="ev-strip">
        ${thumbs.map(s => `<img class="ev-thumb" src="img/${s}" alt="">`).join('')}
      </div>
    </div>
    
    <div class="ev-like">
        <button class="like-btn" data-id="${ev.id}" aria-pressed="${state.interested.has(ev.id)}" title="I have interest">♥</button>
        <span class="like-count" id="like-${ev.id}">${getInterestCount(ev.id)}</span>
    </div>

            

    <div class="ev-meta">
      <h2 class="ev-title">${ev.name}</h2>
      <p class="ev-date muted">${fmtDate(ev.date)}</p>
    </div>

    <div class="ev-actions">
      <a href="javascript:void(0)" class="btn btn-details" data-id="${ev.id}">View Details</a>
    </div>
  </article>`;
}).join('');

$$('.like-btn').forEach(b => b.onclick = () => toggleInterest(+b.dataset.id));


 
  rows.forEach(ev => initCarouselFor(ev));

  
  $$('.btn-details').forEach(b => b.addEventListener('click', e => openDetail(+e.currentTarget.dataset.id)));

  
  $$('.event-card').forEach(c => c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openDetail(+c.dataset.id);
  }));
}

/* ===== carrossel do evento ===== */
function initCarouselFor(ev){
  const gallery = document.querySelector(`.ev-gallery[data-id="${ev.id}"]`);
  if (!gallery) return;

  const imgs = (ev.images && ev.images.length ? [...ev.images] : ['event-placeholder.jpg']);

  const mainEl  = gallery.querySelector('.ev-main');
  const stripEl = gallery.querySelector('.ev-strip');

  const car = { idx: 0, imgs, timer: null };

  function paint(){
    const n = car.imgs.length;
    if (!n) return;

    const i = ((car.idx % n) + n) % n;
    mainEl.src = `img/${car.imgs[i]}`;

    const thumbs = [];
    for (let k = 1; k <= 3 && k < n; k++){
      thumbs.push(car.imgs[(i + k) % n]);
    }
    stripEl.innerHTML = thumbs.map(s => `<img class="ev-thumb" src="img/${s}" alt="">`).join('');
  }

  function start(){
    if (car.timer || car.imgs.length <= 1) return; 
    car.timer = setInterval(() => {
      car.idx = (car.idx + 1) % car.imgs.length;
      paint();
    }, 3000);
  }

  function stop(){
    if (car.timer){
      clearInterval(car.timer);
      car.timer = null;
    }
  }

  
  paint();
  start();

  
  gallery.addEventListener('mouseenter', stop);
  gallery.addEventListener('mouseleave', start);

 
  stripEl.addEventListener('click', (e) => {
    if (e.target.matches('.ev-thumb')){
      const src = e.target.getAttribute('src').replace(/^img\//,'');
      const pos = car.imgs.indexOf(src);
      if (pos >= 0){ car.idx = pos; paint(); }
    }
  });

  // guarda
  carousels.set(ev.id, car);
}




function filenameToLabel(s){
  // "coin1.jpg" -> "coin1"
  const base = s.split('/').pop();
  return base.replace(/\.[a-z0-9]+$/i,'').replace(/[-_]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
}


function openDetail(id){
  const ev = state.events.find(x => x.id === id);

  // Campos preenchidos
  $('#ev-name').textContent = ev.name;
  $('#ev-date').textContent = fmtDate(ev.date);
  $('#ev-desc').textContent = ev.description || '—';

  // Coleções
  const cols = Array.isArray(ev.collections) && ev.collections.length
    ? ev.collections.map(c => ({ name: c.name || filenameToLabel(c.img || ''), img: c.img }))
    : (Array.isArray(ev.images) ? ev.images.slice(0,6).map(img => ({ name: filenameToLabel(img), img })) : []);

  $('#ev-col-count').textContent = `${cols.length} ${cols.length===1 ? 'collection' : 'collections'}`;
  $('#ev-col-list').innerHTML = cols.length
  ? cols.map((c, i) => `
      <article class="ev-col-item" data-col-idx="${i}" title="See items in this collection">
        <img src="img/${c.img}" alt="${c.name}">
        <span class="ev-col-name">${c.name}</span>
        <div class="hover-add" aria-hidden="true">
          <div class="plus">+</div>
        </div>
      </article>
    `).join('')
  : `<p class="muted">No associated collections yet.</p>`;

    // ver itens dessa coleção no evento
    $('#ev-col-list').onclick = (e) => {
      const tile = e.target.closest('.ev-col-item');
      if (!tile) return;
      const idx = +tile.dataset.colIdx;
      const col = cols[idx] || null;
      if (!col) return;
      openCollectionItems(ev, col); // função abaixo
    };
    
    
// Botão Avaliar
const reviewBtn = $('#d-review');

if (IS_GUEST) {
  // Versão sem login
  reviewBtn.style.display = 'inline-block';
  reviewBtn.onclick = () => {
    alert('You must be logged in to leave a review.');
  };
} else if (isUpcoming(ev.date)) {
  // Com login, mas evento futuro: não pode avaliar
  reviewBtn.style.display = 'none';
  reviewBtn.onclick = null;
} else {
  // Com login, evento passado: avaliação normal
  reviewBtn.style.display = 'inline-block';
  reviewBtn.onclick = () => openReview(ev);
}

 
 

const plusBtn = $('#d-plus');
if (plusBtn) plusBtn.onclick = () => openForm(ev);

// Botão Participar
const joinBtn = $('#d-join');

if (IS_GUEST) {
  // Versão sem login: só mostra aviso
  joinBtn.disabled = false;
  joinBtn.textContent = 'Participate';
  joinBtn.title = 'You must be logged in to participate in this event.';
  joinBtn.classList.remove('disabled');
  joinBtn.onclick = () => {
    alert('You must be logged in to participate in this event.');
  };
} else if (isUpcoming(ev.date)) {
  // Com login, evento futuro: pode participar
  joinBtn.disabled = false;
  joinBtn.textContent = 'Participate';
  joinBtn.title = '';
  joinBtn.classList.remove('disabled');
  joinBtn.onclick = () => openJoin(ev);
} else {
  // Com login, evento passado: participação encerrada
  joinBtn.onclick = null;
  joinBtn.disabled = true;
  joinBtn.textContent = 'Participation closed';
  joinBtn.title = 'It is no longer possible to participate in this event.';
  joinBtn.classList.add('disabled');
}

  const modal = $('#eventDetail');
  modal.classList.add('show');

  
  $('#ev-close').onclick = closeDetail;
  modal.addEventListener('click', (e) => { if (e.target.id === 'eventDetail') closeDetail(); }, { once:true });
  window.addEventListener('keydown', escCloseOnce);
}

function escCloseOnce(e){
  if (e.key === 'Escape') { closeDetail(); window.removeEventListener('keydown', escCloseOnce); }
}
function closeDetail(){
  $('#eventDetail').classList.remove('show');
}

function openReview(ev){
  const modal = $('#reviewForm');
  const title = $('#rv-title');
  const ta    = $('#rv-comment');
  const stars = Array.from(document.querySelectorAll('#reviewForm .star'));

  title.textContent = `Avaliar: ${ev.name}`;

  
  const saved = state.ratings[ev.id] || null;
  let current = saved?.stars || 0;
  ta.value = saved?.comment || '';

  const paint = (n) => {
    stars.forEach(b => b.classList.toggle('active', +b.dataset.value <= n));
  };
  paint(current);

  stars.forEach(b=>{
    b.onmouseenter = () => paint(+b.dataset.value);
    b.onmouseleave = () => paint(current);
    b.onclick      = () => { current = +b.dataset.value; paint(current); };
  });

  
  $('#rv-submit').onclick = () => {
    if (current === 0){ alert('Escolhe de 1 a 5 estrelas.'); return; }
    state.ratings[ev.id] = {
      stars: current,
      comment: ta.value.trim(),
      when: new Date().toISOString()
    };
    saveRatings();
    closeReview();
    alert('✅ Evaluation submited. Thank you!');
  };

  const closeReview = () => { modal.classList.remove('show'); };
  $('#rv-cancel').onclick = closeReview;
  $('#review-close').onclick = closeReview;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='reviewForm') closeReview(); }, { once:true });
  function esc(e){ if(e.key==='Escape'){ closeReview(); window.removeEventListener('keydown', esc); } }
  window.addEventListener('keydown', esc);

 
  modal.classList.add('show');
}


function openCollectionItems(ev, col){
  const modal = $('#colItems');
  $('#colItems-title').textContent = `${col.name} — itens no evento`;

  const items = Array.isArray(col.items) ? col.items : [];
  const grid  = $('#colItems-grid');

  if (!items.length){
    grid.innerHTML = `<p class="muted">There are still no items listed for this collection in this event.</p>`;
  } else {
    grid.innerHTML = items.map(it => `
      <div class="mini-card">
        <img src="img/${it.img}" alt="${it.name}">
        <span>${it.name}</span>
      </div>
    `).join('');
  }

  // abrir
  modal.classList.add('show');

 
  const close = () => modal.classList.remove('show');
  $('#colItems-close').onclick = close;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='colItems') close(); }, { once:true });
  function esc(e){ if(e.key==='Escape'){ close(); window.removeEventListener('keydown', esc); } }
  window.addEventListener('keydown', esc);
}



function openForm(ev = null){
  // cabeçalho + campos
  $('#f-title').textContent = ev ? 'Edit Event' : 'New Event';
  $('#f-name').value = ev?.name || '';
  $('#f-date').value = ev?.date?.slice(0,16) || '';
  $('#f-desc').value = ev?.description || '';
  $('#f-loc').value  = ev?.location || '';

  (function safeCleanup(){
    const oldCol  = document.getElementById('col-search-wrap');
    const oldItem = document.getElementById('item-search-wrap');
    if (oldCol && oldCol.parentNode)  oldCol.parentNode.removeChild(oldCol);
    if (oldItem && oldItem.parentNode) oldItem.parentNode.removeChild(oldItem);
    const colList = document.getElementById('f-col-list');
    const itemsW  = document.getElementById('f-items-wrap');
    if (colList) colList.textContent = '';
    if (itemsW)  itemsW.textContent  = '';
    const modalEl = document.querySelector('#eventForm .modal-content');
    if (modalEl) modalEl.scrollTop = 0;
  })();


  const getSelectedCollections = setupEventFormCollections(ev);

  const modal = $('#eventForm');
  modal.classList.add('show');

  
  $('#f-save').onclick = () => {
    const name = $('#f-name').value.trim();
    const date = $('#f-date').value;
    const description = $('#f-desc').value.trim();
    const location = $('#f-loc').value.trim();
    if (!name || !date){ alert('Nome e data são obrigatórios.'); return; }

    const cols = getSelectedCollections();
    const totalItems = cols.reduce((s,c)=> s + c.items.length, 0);
    if (totalItems === 0){ alert('Escolhe pelo menos 1 item.'); return; }

    
    const images = [...new Set(cols.flatMap(c => [c.img, ...c.items.map(it=>it.img)]) )].filter(Boolean);

    if (ev){
      ev.name = name; ev.date = date; ev.description = description; ev.location = location;
      ev.collections = cols;
      ev.images = images.length ? images : ev.images || [];
    } else {
      const id = Math.max(0, ...state.events.map(e => e.id)) + 1;
      state.events.push({ id, name, date, description, location, collections: cols, images });
    }

    closeForm();
    render();
  };

  
  $('#f-cancel').onclick = closeForm;
  $('#form-close').onclick = closeForm;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='eventForm') closeForm(); }, { once:true });
  function escCloseForm(e){ if (e.key === 'Escape'){ closeForm(); window.removeEventListener('keydown', escCloseForm); } }
  window.addEventListener('keydown', escCloseForm);
}



function setupEventFormCollections(ev){
  const grid = $('#f-col-list');
  const wrap = $('#f-items-wrap');

 
  const selected = new Map();    
  let editingColId = null;
  let colFilter = '';
  let itemFilter = '';

 
  if (ev?.collections?.length){
    ev.collections.forEach(c=>{
      const col = state.userCollections.find(x => x.id === c.id || x.name === c.name);
      if (!col) return;
      const set = new Set();
      (c.items || []).forEach(it => set.add(it.id || it.name));
      selected.set(col.id, set);
    });
  }

  
  const oldColSearch = document.getElementById('col-search-wrap');
  if (oldColSearch) oldColSearch.remove();
  grid.insertAdjacentHTML('beforebegin', `
    <div class="pick-search" id="col-search-wrap">
      <input id="col-search" placeholder="Search collections…">
    </div>
  `);
  const elColSearch = $('#col-search');
  elColSearch.oninput = () => { colFilter = elColSearch.value.trim().toLowerCase(); paintCollections(); };

  
  const oldItemSearch = document.getElementById('item-search-wrap');
  if (oldItemSearch) oldItemSearch.remove();
  wrap.insertAdjacentHTML('beforebegin', `
    <div class="item-search" id="item-search-wrap" hidden>
      <input id="item-search" placeholder="Pesquisar itens desta coleção…">
    </div>
  `);
  const elItemSearchWrap = $('#item-search-wrap');
  const elItemSearch     = document.querySelector('#item-search');
  elItemSearchWrap.hidden = true; 
  
  function paintCollections(){
    const rows = state.userCollections.filter(c => !colFilter || c.name.toLowerCase().includes(colFilter));
    grid.innerHTML = rows.map(c=>{
      const isPicked = selected.has(c.id);
      const cnt = isPicked ? selected.get(c.id).size : 0;
      const badge = isPicked ? `<span class="badge">${cnt} item${cnt===1?'':'s'}</span>` : '';
      const editingCls = editingColId === c.id ? 'editing' : '';
      const doneCls = (isPicked && cnt > 0 && editingColId !== c.id) ? 'done' : '';
      return `
        <label class="pick-card ${editingCls} ${doneCls}">
          <input type="checkbox" value="${c.id}" ${isPicked?'checked':''}>
          <img src="img/${c.img}" alt="${c.name}">
          <span>${c.name}</span>
          ${badge}
        </label>`;
    }).join('');

   
    grid.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
      cb.onchange = () => {
        const cid = cb.value;
        if (cb.checked){
          if (!selected.has(cid)) selected.set(cid, new Set());
          editingColId = cid;                 
          itemFilter = ''; if (elItemSearch) elItemSearch.value = '';
          paintCollections(); paintItems();
        } else {
          selected.delete(cid);
          if (editingColId === cid) editingColId = null;
          paintCollections(); paintItems();
        }
      };
    });

    
    grid.querySelectorAll('.pick-card').forEach(card=>{
      card.onclick = (e)=>{
        const cb = card.querySelector('input');
        if (e.target === cb) return;
        if (!cb.checked){ cb.checked = true; cb.dispatchEvent(new Event('change')); return; }
        editingColId = cb.value;
        itemFilter = ''; if (elItemSearch) elItemSearch.value = '';
        paintCollections(); paintItems();
      };
    });
  }

  function paintItems(){
    const col = state.userCollections.find(c=>c.id===editingColId);
    const set = col ? (selected.get(col.id) || new Set()) : null;

    elItemSearchWrap.hidden = !col;

    if (!col){
      wrap.innerHTML = `<p class="muted">Seleciona uma coleção para escolher os itens.</p>`;
      return;
    }

    const items = col.items.filter(it => !itemFilter || it.name.toLowerCase().includes(itemFilter));
    wrap.innerHTML = `
      <div class="items-block">
        <div class="items-head">
          <div class="items-col">
            <img src="img/${col.img}" alt="${col.name}">
            <strong>${col.name}</strong>
          </div>
          <div>
            <button type="button" class="tiny" id="btn-all">Sellect all</button>
            <button type="button" class="tiny" id="btn-none">Clean</button>
          </div>
        </div>

        <div class="mini-grid">
          ${items.length ? items.map(it => `
            <label class="mini-card">
              <input type="checkbox" data-col="${col.id}" value="${it.id}" ${set.has(it.id)?'checked':''}>
              <img src="img/${it.img}" alt="${it.name}">
              <span>${it.name}</span>
            </label>
          `).join('') : '<p class="muted">Sem resultados…</p>'}
        </div>

        <div class="items-actions">
          <button type="button" class="tiny" id="btn-finish">Concluir</button>
        </div>
      </div>
    `;

    wrap.querySelectorAll('input[type="checkbox"][data-col]').forEach(cb=>{
      cb.onchange = () => {
        cb.checked ? set.add(cb.value) : set.delete(cb.value);
        selected.set(col.id, set);
        paintCollections();
      };
    });
    $('#btn-all').onclick  = () => { col.items.forEach(it => set.add(it.id)); selected.set(col.id,set); paintItems(); paintCollections(); };
    $('#btn-none').onclick = () => { set.clear(); selected.set(col.id,set); paintItems(); paintCollections(); };
    $('#btn-finish').onclick = () => { editingColId = null; paintCollections(); paintItems(); };

   
    elItemSearch.oninput = () => { itemFilter = elItemSearch.value.trim().toLowerCase(); paintItems(); };
  }

 
  paintCollections();
  editingColId = null;
  elItemSearchWrap.hidden = true;
  wrap.innerHTML = `<p class="muted">Sellect a collection to choose the items.</p>`;

  
  return function collectSelected(){
    const result = [];
    selected.forEach((set, colId) => {
      const col = state.userCollections.find(c => c.id === colId);
      if (!col) return;
      const items = col.items.filter(it => set.has(it.id));
      if (items.length === 0) return; // só guarda coleções com ≥1 item
      result.push({
        id: col.id, name: col.name, img: col.img,
        items: items.map(({id,name,img}) => ({ id, name, img }))
      });
    });
    return result;
  };
}



function closeForm(){
  $('#eventForm').classList.remove('show');
}
/* =============== */
function openJoin(ev){
    if (!isUpcoming(ev.date)) {
    alert('It is no longer possible to particpate in this event, it has already happen.');
    return;
  }
  closeDetail(); // fecha o modal
  const modal = $('#joinForm');
  modal.classList.add('show');
  $('#join-title').textContent = `Participate in: ${ev.name}`;

    const pick = {
    eventId: ev.id,
    collections: new Map(), 
    user: { name:'', dob:'', email:'', phone:'', note:'' }
  };

  // STEP 1
  const grid = $('#user-col-list');
  grid.innerHTML = state.userCollections.map(c => `
    <label class="pick-card">
      <input type="checkbox" value="${c.id}">
      <img src="img/${c.img}" alt="${c.name}">
      <span>${c.name}</span>
    </label>
  `).join('');

  // 
  $('#join-next-1').onclick = () => {
    const chosen = [...grid.querySelectorAll('input[type="checkbox"]:checked')].map(i=>i.value);
    if (!chosen.length){ alert('Escolhe pelo menos 1 coleção.'); return; }
    pick.collections.clear();
    chosen.forEach(id => pick.collections.set(id, new Set()));
    gotoStep(2);
    renderItemsStep();
  };

  // STEP 2: itens por coleção escolhida
  function renderItemsStep(){
    const wrap = $('#items-per-collection');
    const blocks = [];
    pick.collections.forEach((set, colId) => {
      const col = state.userCollections.find(c=>c.id===colId);
      const itemsHtml = col.items.map(it => `
        <label class="mini-card">
          <input type="checkbox" data-col="${colId}" value="${it.id}">
          <img src="img/${it.img}" alt="${it.name}">
          <span>${it.name}</span>
        </label>
      `).join('');

      blocks.push(`
        <div class="items-block">
          <div class="items-head">
            <div class="items-col">
              <img src="img/${col.img}" alt="${col.name}">
              <strong>${col.name}</strong>
            </div>
            <button type="button" class="tiny" data-all="${colId}">Sellect all</button>
          </div>
          <div class="mini-grid">${itemsHtml}</div>
        </div>
      `);
    });
    wrap.innerHTML = blocks.join('');

    // select por coleção
    wrap.addEventListener('click', (e)=>{
      if (e.target.matches('button.tiny')){
        const colId = e.target.dataset.all;
        wrap.querySelectorAll(`input[data-col="${colId}"]`).forEach(cb => { cb.checked = true; pick.collections.get(colId).add(cb.value); });
      }
    });

    // 
    wrap.addEventListener('change', (e)=>{
      if (e.target.matches('input[type="checkbox"][data-col]')){
        const colId = e.target.dataset.col;
        const set = pick.collections.get(colId);
        e.target.checked ? set.add(e.target.value) : set.delete(e.target.value);
      }
    });
  }

  $('#join-back-2').onclick = () => gotoStep(1);
  $('#join-next-2').onclick = () => {
    // se algum set ficar vazio: assume todos
    pick.collections.forEach((set, colId) => {
      if (set.size === 0){
        const col = state.userCollections.find(c=>c.id===colId);
        col.items.forEach(it => set.add(it.id));
      }
    });
    gotoStep(3);
  };

  // STEP 3: dados pessoais
  $('#join-back-3').onclick = () => gotoStep(2);
  $('#join-submit').onclick = () => {
    pick.user.name  = $('#jf-name').value.trim();
    pick.user.dob   = $('#jf-dob').value;
    pick.user.email = $('#jf-email').value.trim();
    pick.user.phone = $('#jf-phone').value.trim();
    pick.user.note  = $('#jf-note').value.trim();

    if (!pick.user.name || !pick.user.dob || !pick.user.email || !pick.user.phone){
      alert('Preenche todos os dados obrigatórios.'); return;
    }

    // guardar 
    const payload = {
      eventId: pick.eventId,
      collections: [...pick.collections.entries()].map(([cid,set])=>({ id: cid, items: [...set] })),
      user: pick.user
    };
    state.participations.push(payload);
    console.log('Participation registered:', payload); 

    closeJoin();
    alert('Participation confirmed! 🎉');
  };

 
  $('#join-close').onclick = closeJoin;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='joinForm') closeJoin(); }, { once:true });

  function closeJoin(){ modal.classList.remove('show'); }

  function gotoStep(n){
   
    [1,2,3].forEach(i=>{
      $('#w-step-'+i).className = i<n ? 'done' : (i===n ? 'active' : '');
    });
    // secçoes
    $('#join-step-1').hidden = n!==1;
    $('#join-step-2').hidden = n!==2;
    $('#join-step-3').hidden = n!==3;
  }
}



function setGrid(){
  const el = $('#events');
  el.classList.remove('list-view');
  $('#btn-grid').setAttribute('aria-pressed','true');
  $('#btn-list').setAttribute('aria-pressed','false');
}
function setList(){
  const el = $('#events');
  el.classList.add('list-view');
  $('#btn-grid').setAttribute('aria-pressed','false');
  $('#btn-list').setAttribute('aria-pressed','true');
}

/* ----- */
function bindUI(){
  // Grid/List
  $('#btn-grid').onclick = () => { setGrid(); render(); };
  $('#btn-list').onclick = () => { setList(); render(); };

  // Pesquisa
  $('#btn-search').onclick = () => { state.q = $('#q').value.trim(); render(); };
  $('#q').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btn-search').click(); });

  // Sort 
  $('#sort').onchange   = (e) => { state.sort   = e.target.value; render(); };
  $('#status').onchange = (e) => { state.status = e.target.value; render(); };

  // Novo evento
  $('#btn-new').onclick = () => openForm();

  //
  $('#eventDetail').addEventListener('click', (e)=>{ if(e.target.id==='eventDetail') closeDetail(); });
}

/* ------*/
window.addEventListener('DOMContentLoaded', () => {
  bindUI();
  setGrid();    
  render();
});


// DARK MODE
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return; 

  const currentTheme = localStorage.getItem("theme");

 
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

 
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  if (!profileBtn || !dropdown) return;

  profileBtn.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

 
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash === "#eventDetail") {
    const modal = document.getElementById("eventDetail");

    if (!modal) return;

    if (typeof openEventDetail === "function" && Array.isArray(window.events) && window.events.length > 0) {
     
      openEventDetail(window.events[0]);
    } else {
    
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("open");
    }
  }
});













