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
  joined: new Set(JSON.parse(localStorage.getItem('joinedEvents') || '[]'))
};

function saveJoined(){ localStorage.setItem('joinedEvents', JSON.stringify([...state.joined])); }
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
    // assegura imagens
    const imgs = (ev.images && ev.images.length ? ev.images : ['event-placeholder.jpg']);
    const main = imgs[0];
    const thumbs = imgs.slice(1, 4); // até 3 miniaturas visíveis

    return `
      <article class="collection-card event-card" data-id="${ev.id}" tabindex="0" aria-label="${ev.name}">
        <div class="ev-gallery" data-id="${ev.id}">
          <img class="ev-main" src="img/${main}" alt="${ev.name}">
          <div class="ev-strip">
            ${thumbs.map(s => `<img class="ev-thumb" src="img/${s}" alt="">`).join('')}
          </div>
        </div>

        <h2 style="margin-top:10px">${ev.name}</h2>
        <p class="muted">${fmtDate(ev.date)}</p>

        <div style="margin-top:auto">
          <a href="javascript:void(0)" class="btn btn-details" data-id="${ev.id}">View Details</a>
        </div>
      </article>
    `;
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
function openDetail(id){
  const ev = state.events.find(x => x.id === id);

  // Preenche
  $('#ev-name').textContent = ev.name;
  $('#ev-date').textContent = fmtDate(ev.date);
  $('#ev-desc').textContent = ev.description || '—';

  // Ações
  $('#d-plus').onclick = () => openForm(ev);
  $('#d-join').onclick = () => {
    state.joined.has(ev.id) ? state.joined.delete(ev.id) : state.joined.add(ev.id);
    saveJoined();
    closeDetail();
    render();
  };

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

/* ============ MODAL: FORMULÁRIO (Criar / Editar) ============ */
function openForm(ev=null){
  $('#f-title').textContent = ev ? 'Edit Event' : 'New Event';
  $('#f-name').value = ev?.name || '';
  $('#f-date').value = ev?.date?.slice(0,16) || '';
  $('#f-desc').value = ev?.description || '';

  const modal = $('#eventForm');
  modal.classList.add('show');             // <— usa classe .show (coerente com CSS)

  // Guardar
  $('#f-save').onclick = () => {
    const name = $('#f-name').value.trim();
    const date = $('#f-date').value;
    const description = $('#f-desc').value.trim();
    if (!name || !date) return;

    if (ev){
      // update
      ev.name = name; ev.date = date; ev.description = description;
      // Sprint 2: PUT api/events.php?id=ev.id
    } else {
      // create
      const id = Math.max(0, ...state.events.map(e => e.id)) + 1;
      state.events.push({ id, name, date, description });
      // Sprint 2: POST api/events.php
    }
    closeForm();
    render();
  };

  // Fechar (Cancel, X, clique fora, ESC)
  $('#f-cancel').onclick = closeForm;
  $('#form-close').onclick = closeForm;
  modal.addEventListener('click', (e)=>{ if(e.target.id==='eventForm') closeForm(); }, { once:true });

  function escCloseForm(e){
    if (e.key === 'Escape'){ closeForm(); window.removeEventListener('keydown', escCloseForm); }
  }
  window.addEventListener('keydown', escCloseForm);
}
function closeForm(){
  $('#eventForm').classList.remove('show');
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
