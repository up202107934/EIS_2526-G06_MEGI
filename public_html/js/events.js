/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* js/events.js — versão alinhada com modais por classe .show */

// Helpers curtos
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// Estado da página
const state = {
  view: 'grid',
  sort: 'date_asc',
  status: '',
  q: '',
  // Eventos de exemplo + imagens associadas (coleções do evento)
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
      description: 'Feira de moedas e notas raras.',
      images: ['coin1.jpg','coin2.jpg','coin3.jpg','coin4.jpg','coin5.jpg']
    },
    {
      id: 3,
      name: 'Retro Expo Porto',
      date: '2025-12-02T15:00',
      description: 'Exposição retro com miniaturas e comics.',
      images: ['stamp1.jpg','stamp2.jpg','stamp3.jpg','stamp4.jpg','train1.jpg','collection2.jpg']
    }
  ],
  joined: new Set(JSON.parse(localStorage.getItem('joinedEvents') || '[]')),
  ratings: JSON.parse(localStorage.getItem('eventRatings') || '{}')

};

// Coleções do UTILIZADOR (mock). Cada uma com itens.
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

// registo simples das participações
state.participations = []; // {eventId, collections:[{id, items:[ids]}], user:{...}}


function saveJoined(){ localStorage.setItem('joinedEvents', JSON.stringify([...state.joined])); }
function saveRatings(){ localStorage.setItem('eventRatings', JSON.stringify(state.ratings)); }
function isUpcoming(iso){ return new Date(iso) > new Date(); }
function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleString([], { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

/* ===== Carrosséis por evento (gestão de timers) ===== */
const carousels = new Map(); // id -> { timer, idx, imgs }

/* ============ RENDER DOS CARTÕES (com galeria) ============ */
function render(){
  const wrap = $('#events');

  // limpar timers antigos para evitar leaks sempre que re-renderizamos
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

  // HTML dos cartões (com galeria)
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

    <div class="ev-meta">
      <h2 class="ev-title">${ev.name}</h2>
      <p class="ev-date muted">${fmtDate(ev.date)}</p>
    </div>

    <div class="ev-actions">
      <a href="javascript:void(0)" class="btn btn-details" data-id="${ev.id}">View Details</a>
    </div>
  </article>`;
}).join('');


  // Inicializar carrossel de cada cartão
  rows.forEach(ev => initCarouselFor(ev));

  // Abrir detalhe ao clicar no botão
  $$('.btn-details').forEach(b => b.addEventListener('click', e => openDetail(+e.currentTarget.dataset.id)));

  // Acessibilidade: Enter sobre o cartão abre detalhe
  $$('.event-card').forEach(c => c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openDetail(+c.dataset.id);
  }));
}

/* ===== Inicialização/rotação do carrossel de um evento (pausa/retoma) ===== */
function initCarouselFor(ev){
  const gallery = document.querySelector(`.ev-gallery[data-id="${ev.id}"]`);
  if (!gallery) return;

  const imgs = (ev.images && ev.images.length ? [...ev.images] : ['event-placeholder.jpg']);

  const mainEl  = gallery.querySelector('.ev-main');
  const stripEl = gallery.querySelector('.ev-strip');

  // estado local do carrossel guardado também no Map()
  const car = { idx: 0, imgs, timer: null };

  function paint(){
    const n = car.imgs.length;
    if (!n) return;

    const i = ((car.idx % n) + n) % n; // índice circular
    mainEl.src = `img/${car.imgs[i]}`;

    const thumbs = [];
    for (let k = 1; k <= 3 && k < n; k++){
      thumbs.push(car.imgs[(i + k) % n]);
    }
    stripEl.innerHTML = thumbs.map(s => `<img class="ev-thumb" src="img/${s}" alt="">`).join('');
  }

  function start(){
    if (car.timer || car.imgs.length <= 1) return; // nada a rodar
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

  // primeira pintura + arranque
  paint();
  start();

  // pausa/retoma no hover
  gallery.addEventListener('mouseenter', stop);
  gallery.addEventListener('mouseleave', start);

  // (opcional) clicar numa miniatura avança imediatamente para essa imagem
  stripEl.addEventListener('click', (e) => {
    if (e.target.matches('.ev-thumb')){
      const src = e.target.getAttribute('src').replace(/^img\//,'');
      const pos = car.imgs.indexOf(src);
      if (pos >= 0){ car.idx = pos; paint(); }
    }
  });

  // guarda para limpeza no próximo render
  carousels.set(ev.id, car);
}



/* ===== Cartão de detalhes (modal leve .ev-modal) ===== */
function filenameToLabel(s){
  // "coin1.jpg" -> "coin1" (ou capitaliza se quiseres)
  const base = s.split('/').pop();
  return base.replace(/\.[a-z0-9]+$/i,'').replace(/[-_]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
}

/* ===== Cartão de detalhes (modal leve .ev-modal) ===== */
function openDetail(id){
  const ev = state.events.find(x => x.id === id);

  // Preenche campos base
  $('#ev-name').textContent = ev.name;
  $('#ev-date').textContent = fmtDate(ev.date);
  $('#ev-desc').textContent = ev.description || '—';

  // Coleções (usa ev.collections se existir; senão deriva de images)
  const cols = Array.isArray(ev.collections) && ev.collections.length
    ? ev.collections.map(c => ({ name: c.name || filenameToLabel(c.img || ''), img: c.img }))
    : (Array.isArray(ev.images) ? ev.images.slice(0,6).map(img => ({ name: filenameToLabel(img), img })) : []);

  $('#ev-col-count').textContent = `${cols.length} ${cols.length===1 ? 'coleção' : 'coleções'}`;
  $('#ev-col-list').innerHTML = cols.length
  ? cols.map((c, i) => `
      <article class="ev-col-item" data-col-idx="${i}" title="Ver itens desta coleção">
        <img src="img/${c.img}" alt="${c.name}">
        <span class="ev-col-name">${c.name}</span>
        <div class="hover-add" aria-hidden="true">
          <div class="plus">+</div>
        </div>
      </article>
    `).join('')
  : `<p class="muted">Ainda sem coleções associadas.</p>`;

    // Clique numa coleção -> ver itens dessa coleção no evento
    $('#ev-col-list').onclick = (e) => {
      const tile = e.target.closest('.ev-col-item');
      if (!tile) return;
      const idx = +tile.dataset.colIdx;
      const col = cols[idx] || null;
      if (!col) return;
      openCollectionItems(ev, col); // função abaixo
    };
    
    
// Botão "Avaliar": só visível para eventos já decorridos
const reviewBtn = $('#d-review');
if (isUpcoming(ev.date)) {
  reviewBtn.style.display = 'none';
  reviewBtn.onclick = null;
} else {
  reviewBtn.style.display = 'inline-block';
  reviewBtn.onclick = () => openReview(ev);
}

    
 // Atualizar a secção de avaliação (só mostra se o evento já ocorreu)


  // Ações
const plusBtn = $('#d-plus');
if (plusBtn) plusBtn.onclick = () => openForm(ev);  // só se existir

// Botão "Participar": só permite para eventos futuros
const joinBtn = $('#d-join');

if (isUpcoming(ev.date)) {
  // evento ainda não aconteceu → pode participar
  joinBtn.disabled = false;
  joinBtn.textContent = 'Participar';
  joinBtn.title = '';
  joinBtn.classList.remove('disabled');
  joinBtn.onclick = () => openJoin(ev);
} else {
  // evento já passou → bloquear
  joinBtn.onclick = null;
  joinBtn.disabled = true;                 // bloqueia o clique
  joinBtn.textContent = 'Participação encerrada';
  joinBtn.title = 'Já não é possível participar neste evento.';
  joinBtn.classList.add('disabled');
}


  

  // Mostrar
  const modal = $('#eventDetail');
  modal.classList.add('show');

  // Fechar (X, ESC, clique fora)
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

  // carregar avaliação anterior (se existir)
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

  // submit/cancel/close
  $('#rv-submit').onclick = () => {
    if (current === 0){ alert('Escolhe de 1 a 5 estrelas.'); return; }
    state.ratings[ev.id] = {
      stars: current,
      comment: ta.value.trim(),
      when: new Date().toISOString()
    };
    saveRatings();
    closeReview();
    alert('✅ Avaliação submetida. Obrigado!');
  };

  const closeReview = () => { modal.classList.remove('show'); };
  $('#rv-cancel').onclick = closeReview;
  $('#review-close').onclick = closeReview;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='reviewForm') closeReview(); }, { once:true });
  function esc(e){ if(e.key==='Escape'){ closeReview(); window.removeEventListener('keydown', esc); } }
  window.addEventListener('keydown', esc);

  // abrir modal
  modal.classList.add('show');
}



function openCollectionItems(ev, col){
  // col pode vir com { name, img, items: [{name,img}, ...] }
  const modal = $('#colItems');
  $('#colItems-title').textContent = `${col.name} — itens no evento`;

  const items = Array.isArray(col.items) ? col.items : [];
  const grid  = $('#colItems-grid');

  if (!items.length){
    grid.innerHTML = `<p class="muted">Ainda não há itens listados para esta coleção neste evento.</p>`;
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

  // fechar
  const close = () => modal.classList.remove('show');
  $('#colItems-close').onclick = close;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='colItems') close(); }, { once:true });
  function esc(e){ if(e.key==='Escape'){ close(); window.removeEventListener('keydown', esc); } }
  window.addEventListener('keydown', esc);
}


/* ============ MODAL: FORMULÁRIO (Criar / Editar) ============ */
function openForm(ev=null){
  $('#f-title').textContent = ev ? 'Edit Event' : 'New Event';
  $('#f-name').value = ev?.name || '';
  $('#f-date').value = ev?.date?.slice(0,16) || '';
  $('#f-desc').value = ev?.description || '';

  // monta o picker de coleções/itens dentro do form
  const getSelectedCollections = setupEventFormCollections(ev);

  const modal = $('#eventForm');
  modal.classList.add('show');

  // Guardar
  $('#f-save').onclick = () => {
    const name = $('#f-name').value.trim();
    const date = $('#f-date').value;
    const description = $('#f-desc').value.trim();
    if (!name || !date){ alert('Nome e data são obrigatórios.'); return; }

    // recolhe seleções do picker
    const cols = getSelectedCollections(); // [{name,img,items:[{id,name,img}]}]
    const totalItems = cols.reduce((sum,c)=> sum + c.items.length, 0);
    if (totalItems === 0){
      alert('Escolhe pelo menos 1 item de alguma coleção.'); 
      return;
    }

    // Derivar imagens para o cartão (grelha) a partir das coleções/itens escolhidos
    const imgs = [];
    cols.forEach(c=>{
      if (c.img) imgs.push(c.img);
      c.items.forEach(it => imgs.push(it.img));
    });
    // tirar repetidos e limitar (opcional)
    const images = [...new Set(imgs)];

    if (ev){
      // update
      ev.name = name; 
      ev.date = date; 
      ev.description = description;
      ev.collections = cols;
      ev.images = images.length ? images : ev.images || [];
      // Sprint 2: PUT api/events.php?id=ev.id
    } else {
      // create
      const id = Math.max(0, ...state.events.map(e => e.id)) + 1;
      state.events.push({ id, name, date, description, collections: cols, images });
      // Sprint 2: POST api/events.php
    }

    closeForm();
    render();
  };

  // Fechar (Cancel, X, backdrop, ESC)
  $('#f-cancel').onclick = closeForm;
  $('#form-close').onclick = closeForm;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='eventForm') closeForm(); }, { once:true });

  function escCloseForm(e){
    if (e.key === 'Escape'){ closeForm(); window.removeEventListener('keydown', escCloseForm); }
  }
  window.addEventListener('keydown', escCloseForm);
}

// Constrói o picker de coleções/itens dentro do #eventForm.
// Devolve uma função que, quando chamada, retorna o array "collections" pronto a gravar.
function setupEventFormCollections(ev){
  const grid = $('#f-col-list');
  const wrap = $('#f-items-wrap');

  // Estado local: colId -> Set(itemIds)
  const selected = new Map();

  // Pré-preenche se for edição e o evento tiver collections
  if (ev?.collections?.length){
    ev.collections.forEach(c=>{
      // tentar mapear por id; se não houver id, mapear por name
      const col = state.userCollections.find(x => x.id === c.id || x.name === c.name);
      if (!col) return;
      const set = new Set();
      (c.items || []).forEach(it => set.add(it.id || it.name)); // fallback por nome
      selected.set(col.id, set);
    });
  }

  // Render coleções (checkboxes)
  grid.innerHTML = state.userCollections.map(c => `
    <label class="pick-card">
      <input type="checkbox" value="${c.id}" ${selected.has(c.id) ? 'checked' : ''}>
      <img src="img/${c.img}" alt="${c.name}">
      <span>${c.name}</span>
    </label>
  `).join('');

  // Render itens por coleção selecionada
  function paintItems(){
    const blocks = [];
    selected.forEach((set, colId) => {
      const col = state.userCollections.find(c => c.id === colId);
      if (!col) return;

      const itemsHtml = col.items.map(it => `
        <label class="mini-card">
          <input type="checkbox" data-col="${colId}" value="${it.id}" ${set.has(it.id) ? 'checked' : ''}>
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
            <button type="button" class="tiny" data-all="${colId}">Selecionar todos</button>
          </div>
          <div class="mini-grid">${itemsHtml}</div>
        </div>
      `);
    });

    wrap.innerHTML = blocks.join('') || `<p class="muted">Seleciona coleções acima.</p>`;
  }

  paintItems();

  // Eventos do grid de coleções
  grid.addEventListener('change', e=>{
    const t = e.target;
    if (t && t.matches('input[type="checkbox"]')){
      const cid = t.value;
      if (t.checked) selected.set(cid, selected.get(cid) || new Set());
      else selected.delete(cid);
      paintItems();
    }
  });

  // Selecionar todos os itens de uma coleção
  wrap.addEventListener('click', e=>{
    const btn = e.target.closest('button.tiny');
    if (!btn) return;
    const colId = btn.dataset.all;
    const col = state.userCollections.find(c => c.id === colId);
    if (!col) return;
    const set = selected.get(colId) || new Set();
    col.items.forEach(it => set.add(it.id));
    selected.set(colId, set);
    paintItems();
  });

  // Check/uncheck de itens
  wrap.addEventListener('change', e=>{
    const t = e.target;
    if (t && t.matches('input[type="checkbox"][data-col]')){
      const colId = t.dataset.col;
      const set = selected.get(colId) || new Set();
      t.checked ? set.add(t.value) : set.delete(t.value);
      selected.set(colId, set);
    }
  });

  // Função que devolve o array "collections" pronto a gravar
  return function collectSelected(){
    const result = [];
    selected.forEach((set, colId) => {
      const col = state.userCollections.find(c => c.id === colId);
      if (!col) return;
      const items = col.items.filter(it => set.has(it.id));
      if (items.length === 0) return;
      result.push({
        id: col.id,
        name: col.name,
        img: col.img,
        items: items.map(({id,name,img}) => ({ id, name, img }))
      });
    });
    return result;
  };
}


function closeForm(){
  $('#eventForm').classList.remove('show');
}
/* ======== JOIN WIZARD ======== */
function openJoin(ev){
    if (!isUpcoming(ev.date)) {
    alert('Já não é possível participar num evento que já aconteceu.');
    return;
  }
  closeDetail(); // fecha a modal de detalhe
  const modal = $('#joinForm');
  modal.classList.add('show');
  $('#join-title').textContent = `Participar em: ${ev.name}`;

  // estado interno do wizard
  const pick = {
    eventId: ev.id,
    collections: new Map(), // colId -> Set(itemIds)
    user: { name:'', dob:'', email:'', phone:'', note:'' }
  };

  // STEP 1: render coleções do utilizador
  const grid = $('#user-col-list');
  grid.innerHTML = state.userCollections.map(c => `
    <label class="pick-card">
      <input type="checkbox" value="${c.id}">
      <img src="img/${c.img}" alt="${c.name}">
      <span>${c.name}</span>
    </label>
  `).join('');

  // next 1 -> step 2
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
            <button type="button" class="tiny" data-all="${colId}">Selecionar todos</button>
          </div>
          <div class="mini-grid">${itemsHtml}</div>
        </div>
      `);
    });
    wrap.innerHTML = blocks.join('');

    // select all por coleção
    wrap.addEventListener('click', (e)=>{
      if (e.target.matches('button.tiny')){
        const colId = e.target.dataset.all;
        wrap.querySelectorAll(`input[data-col="${colId}"]`).forEach(cb => { cb.checked = true; pick.collections.get(colId).add(cb.value); });
      }
    });

    // sync picks
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
    // se algum set ficar vazio, assume "todos"
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

    // guardar (mock)
    const payload = {
      eventId: pick.eventId,
      collections: [...pick.collections.entries()].map(([cid,set])=>({ id: cid, items: [...set] })),
      user: pick.user
    };
    state.participations.push(payload);
    console.log('Participação registada:', payload); // aqui farás POST no Sprint 2

    closeJoin();
    alert('Participação confirmada! 🎉');
  };

  // fechar modal
  $('#join-close').onclick = closeJoin;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='joinForm') closeJoin(); }, { once:true });

  function closeJoin(){ modal.classList.remove('show'); }

  function gotoStep(n){
    // header
    [1,2,3].forEach(i=>{
      $('#w-step-'+i).className = i<n ? 'done' : (i===n ? 'active' : '');
    });
    // sections
    $('#join-step-1').hidden = n!==1;
    $('#join-step-2').hidden = n!==2;
    $('#join-step-3').hidden = n!==3;
  }
}


/* ============ GRID/LIST TOGGLE (aplica .list-view ao #events) ============ */
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

/* ============ BIND UI ============ */
function bindUI(){
  // Grid/List
  $('#btn-grid').onclick = () => { setGrid(); render(); };
  $('#btn-list').onclick = () => { setList(); render(); };

  // Pesquisa
  $('#btn-search').onclick = () => { state.q = $('#q').value.trim(); render(); };
  $('#q').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btn-search').click(); });

  // Sort / Status
  $('#sort').onchange   = (e) => { state.sort   = e.target.value; render(); };
  $('#status').onchange = (e) => { state.status = e.target.value; render(); };

  // Novo evento
  $('#btn-new').onclick = () => openForm();

  // Backdrop close de segurança (detalhe)
  $('#eventDetail').addEventListener('click', (e)=>{ if(e.target.id==='eventDetail') closeDetail(); });
}

/* ============ INIT ============ */
window.addEventListener('DOMContentLoaded', () => {
  bindUI();
  setGrid();     // arranca em grid
  render();
});


// === DARK MODE TOGGLE ===
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return; // segurança

  const currentTheme = localStorage.getItem("theme");

  // aplica o tema guardado
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  // alterna entre claro/escuro
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});