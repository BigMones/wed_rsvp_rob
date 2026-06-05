/* ============================================================
   ANTONIO & ROBERTO — site.js
   ============================================================ */

/* ---------- 11 tappe del viaggio ---------- */
/* x/y = posizione % sulla mappa astratta (vagamente continentale) */
const STOPS = [
  { id:1,  name:"Sydney",            country:{it:"Australia",  en:"Australia"},      x:88, y:80,
    it:"Si sono conosciuti in Italia, ma fin dal primo giorno condividevano lo stesso sogno. Il primo messaggio che si sono scambiati parlava proprio di lei: Sydney. Ancora prima di sapere che si stavano scegliendo per sempre, avevano già scelto insieme un posto nel mondo.",
    en:"They met in Italy, but from the very first day they shared the same dream. Their very first message was already about it: Sydney. Even before they knew they were choosing each other forever, they had already chosen a place in the world together." },
  { id:2,  name:"Tasmania",          country:{it:"Australia",  en:"Australia"},      x:83, y:92,
    it:"Sono arrivati per celebrare l'amore dei loro amici, il primo matrimonio vissuto insieme. In quella piccola isola selvaggia hanno iniziato a sentire che anche il loro momento stava lentamente prendendo forma.",
    en:"They travelled there to celebrate their friends' love, their first wedding experienced together. On that wild little island, they began to feel that their own moment was quietly finding its way." },
  { id:3,  name:"Indonesia",         country:{it:"Indonesia",  en:"Indonesia"},      x:78, y:62,
    it:"Una pausa necessaria. Un viaggio che li ha purificati. Tra templi e discrezione, in un luogo che non lasciava spazio al loro amore, hanno imparato a nascondersi dietro un sorriso: fratelli per il mondo, complici in segreto, amore per sempre.",
    en:"A necessary pause. A journey that cleansed them. Among temples and quiet discretion, in a place that left no room for their love, they learned to hide behind a smile: brothers to the world, accomplices in secret, love forever." },
  { id:4,  name:"Filippine",         country:{it:"Filippine",  en:"Philippines"},    x:82, y:48,
    it:"Tra natura selvaggia e acque cristalline, il loro amore ha potuto respirare libero. Tra avventure e meraviglia, hanno celebrato la vita — e il compleanno di Antonio — in una suite sospesa tra sogno e realtà. Un viaggio che li ha uniti ancora di più, rendendo ogni istante indimenticabile.",
    en:"Among wild nature and crystal-clear waters, their love could finally breathe freely. Between adventure and wonder, they celebrated life — and Antonio's birthday — in a suite suspended between dream and reality. A journey that brought them even closer, turning every moment into something unforgettable." },
  { id:5,  name:"U.S.A.",            country:{it:"Stati Uniti",en:"United States"},   x:14, y:42,
    it:"Un viaggio condiviso, tra famiglia e sogni. Il compleanno di Roberto, luci, spettacoli e avventura. Alcuni sogni si sono realizzati, altri hanno solo cambiato forma — ma tutti hanno reso quel viaggio indimenticabile.",
    en:"A journey shared with family and dreams. Roberto's birthday, lights, shows, and adventure. Some dreams came true, others simply took a different shape — but all of them made this trip unforgettable." },
  { id:6,  name:"Monaco di Baviera", country:{it:"Germania",   en:"Germany"},        x:53, y:26,
    it:"Tra birra, risate e musica, un viaggio vissuto insieme senza pensieri. Eppure Antonio, nel suo modo silenzioso, stava già tracciando la strada: credeva così tanto nell'amore da volerlo vedere nascere anche negli altri. Proprio lì, sotto le note di Adele, è arrivata una richiesta speciale: essere testimoni di un amore pronto a diventare promessa.",
    en:"Between beer, laughter, and music, it was a journey lived together without a care. And yet, in his quiet way, Antonio was already paving the path: he believed in love so deeply that he wanted to see it blossom in others. Right there, beneath the notes of Adele, a special request arrived: to be witnesses to a love ready to become a promise." },
  { id:7,  name:"Parigi",            country:{it:"Francia",    en:"France"},         x:47, y:30,
    it:"La città dell'amore. Per Roberto era sempre stato un sogno: vivere Parigi con la persona che amava. Antonio ha costruito tutto in silenzio, passo dopo passo. Solo in aeroporto Roberto ha scoperto la destinazione — un biglietto bruciato, poche parole: «tout commence à…». E da lì, la magia: un sogno che ha preso vita tra le luci di Disneyland.",
    en:"The city of love. For Roberto, it had always been a dream: to experience Paris with the person he loved. Antonio built everything in silence, step by step. Only at the airport did Roberto discover the destination — a burned note, just a few words: 'tout commence à…'. And from there, magic: a dream coming to life among the lights of Disneyland." },
  { id:8,  name:"Canarie",           country:{it:"Spagna",     en:"Spain"},          x:38, y:48,
    it:"Roberto ha portato Antonio nei luoghi che un tempo chiamava casa, tra ricordi, amicizie e nuove emozioni. È stato il loro primo viaggio insieme, quello che ha dato inizio a tutto. E proprio lì, tra sole e libertà, hanno festeggiato il compleanno di Antonio, intrecciando passato e futuro nello stesso orizzonte.",
    en:"Roberto took Antonio to the places he once called home, among memories, friendships, and new emotions. It was their first trip together, the one that started it all. And right there, between sunshine and freedom, they celebrated Antonio's birthday, weaving past and future into the same horizon." },
  { id:9,  name:"Edimburgo",         country:{it:"Scozia",     en:"Scotland"},       x:46, y:17,
    it:"Un gesto per ricambiare, un viaggio pensato con il cuore. Roberto ha scelto Edimburgo per regalare ad Antonio qualcosa di davvero suo, un luogo capace di parlare alla sua anima. Tra freddo, strade incantate e storie misteriose, hanno vissuto un'esperienza sospesa tra realtà e magia.",
    en:"A gesture to give back, a journey shaped by the heart. Roberto chose Edinburgh to gift Antonio something truly his own — a place that could speak to his soul. Among the cold, enchanted streets, and mysterious stories, they lived an experience suspended between reality and magic." },
  { id:10, name:"Londra",            country:{it:"Inghilterra",en:"England"},        x:45, y:24,
    it:"La città della nostra prima casa insieme. Qui il nostro amore è cresciuto, giorno dopo giorno, tra vita quotidiana e sogni condivisi. È qui che abbiamo scelto di restare insieme, ovunque, e poi, poco dopo, per sempre.",
    en:"The city of our first home together. Here our love grew, day by day, through everyday life and shared dreams. It is here that we chose to stay together, anywhere, and soon after, forever." },
  { id:11, name:"Napoli",            country:{it:"Italia",     en:"Italy"},          x:54, y:39, final:true,
    it:"Dove tutto è iniziato. La città in cui ci siamo conosciuti, ci siamo innamorati e abbiamo scelto di cambiare le nostre vite per sempre. È da qui che è partito il nostro viaggio, ed è qui che ci ha sempre riportato — il luogo in cui abbiamo scelto di dirci il nostro sì.",
    en:"Where it all began. The city where we met, fell in love, and chose to change our lives forever. This is where our journey started, and where it has always led us back — the place where we chose to say 'I do.'" }
];

/* ---------- UI strings ---------- */
const UI = {
  prev:{it:"Tappa prec.",en:"Previous"},
  next:{it:"Tappa succ.",en:"Next"},
  photoHere:{it:"foto · "+"",en:"photo · "},
  hint:{it:"Tocca una tappa",en:"Tap a stop"},
};

/* ---------- language ---------- */
let LANG = localStorage.getItem('ar-lang') || 'it';

function applyLang(lang){
  LANG = lang;
  localStorage.setItem('ar-lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-it]').forEach(el=>{
    const v = el.getAttribute('data-'+lang);
    if(v!=null) el.textContent = v;
  });
  document.querySelectorAll('[data-it-html]').forEach(el=>{
    const v = el.getAttribute('data-'+lang+'-html');
    if(v!=null) el.innerHTML = v;
  });
  document.querySelectorAll('.lang button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===lang);
  });
  renderJourney();
}

/* ---------- journey: map + panel + timeline ---------- */
let ACTIVE = 0;

function buildMap(){
  const stage = document.getElementById('atlasStage');
  if(!stage) return;
  // routes svg
  const svgNS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(svgNS,'svg');
  svg.setAttribute('class','atlas-svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('preserveAspectRatio','none');
  let d="";
  STOPS.forEach((s,i)=>{
    if(i===0){ d+=`M ${s.x} ${s.y} `; }
    else{
      const p=STOPS[i-1];
      const mx=(p.x+s.x)/2, my=(p.y+s.y)/2 - 9; // arch upward
      d+=`Q ${mx} ${my} ${s.x} ${s.y} `;
    }
  });
  const path=document.createElementNS(svgNS,'path');
  path.setAttribute('d',d);
  path.setAttribute('fill','none');
  path.setAttribute('stroke','oklch(0.52 0.062 150)');
  path.setAttribute('stroke-width','0.4');
  path.setAttribute('stroke-dasharray','0.9 1.8');
  path.setAttribute('opacity','0.65');
  path.setAttribute('vector-effect','non-scaling-stroke');
  svg.appendChild(path);
  stage.appendChild(svg);

  // pins
  STOPS.forEach((s,i)=>{
    const pin=document.createElement('button');
    pin.className='pin'+(s.final?' final':'');
    pin.style.left=s.x+'%'; pin.style.top=s.y+'%';
    pin.dataset.idx=i;
    pin.innerHTML=`<span class="dot">${s.final?'★':s.id}</span><span class="nm"></span>`;
    pin.addEventListener('click',()=>setActive(i));
    pin.addEventListener('mouseenter',()=>{ pin.querySelector('.nm').textContent=s.name; });
    stage.appendChild(pin);
  });
  // plane marker
  const plane=document.createElement('div');
  plane.className='atlas-plane';
  plane.id='atlasPlane';
  plane.textContent='✈';
  stage.appendChild(plane);
}

function setActive(i){
  ACTIVE=i;
  renderJourney();
}

function renderJourney(){
  const s=STOPS[ACTIVE];
  // pins active state + names
  document.querySelectorAll('.pin').forEach(p=>{
    const idx=+p.dataset.idx;
    p.classList.toggle('active', idx===ACTIVE);
    p.querySelector('.nm').textContent=STOPS[idx].name;
  });
  // plane to active
  const plane=document.getElementById('atlasPlane');
  if(plane){ plane.style.left=s.x+'%'; plane.style.top=(s.y-6)+'%'; }
  // panel
  const panel=document.getElementById('atlasPanel');
  if(panel){
    panel.querySelector('.ap-num').textContent=(LANG==='en'?'Stop':'Tappa')+' '+String(s.id).padStart(2,'0')+' / 11';
    panel.querySelector('.ap-country').textContent=s.country[LANG];
    panel.querySelector('.ap-name').textContent=s.name;
    panel.querySelector('.ap-text').textContent=s[LANG];
    panel.querySelector('.ap-photo .lab').textContent=(LANG==='en'?'photo · ':'foto · ')+s.name.toLowerCase();
    panel.querySelector('.ap-photo .stamp').innerHTML=s.country[LANG]+'<br>'+String(s.id).padStart(2,'0');
  }
  // timeline (mobile) — render once, update lang text
  const tl=document.getElementById('timeline');
  if(tl && !tl.dataset.built){
    tl.innerHTML='<div class="tl-line"></div>'+STOPS.map((st,i)=>`
      <div class="tl-stop${st.final?' final':''} reveal">
        <span class="tl-dot">${st.final?'★':st.id}</span>
        <div class="tl-photo"><span class="lab"></span></div>
        <div class="tl-country"></div>
        <div class="tl-name">${st.name}</div>
        <div class="tl-text"></div>
      </div>`).join('');
    tl.dataset.built='1';
    // re-observe new reveals
    tl.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  }
  if(tl){
    tl.querySelectorAll('.tl-stop').forEach((node,i)=>{
      const st=STOPS[i];
      node.querySelector('.tl-country').textContent=st.country[LANG];
      node.querySelector('.tl-text').textContent=st[LANG];
      node.querySelector('.tl-photo .lab').textContent=(LANG==='en'?'photo · ':'foto · ')+st.name.toLowerCase();
    });
  }
  // panel nav labels
  const pv=document.getElementById('apPrev'), nx=document.getElementById('apNext');
  if(pv) pv.lastChild.textContent=' '+(LANG==='en'?'Previous':'Precedente');
  if(nx) nx.firstChild.textContent=(LANG==='en'?'Next':'Successiva')+' ';
}

/* ---------- countdown ---------- */
function tickCountdown(){
  const target=new Date('2026-09-20T11:30:00+02:00').getTime();
  const now=Date.now();
  let diff=Math.max(0,target-now);
  const d=Math.floor(diff/86400000); diff-=d*86400000;
  const h=Math.floor(diff/3600000);  diff-=h*3600000;
  const m=Math.floor(diff/60000);    diff-=m*60000;
  const sec=Math.floor(diff/1000);
  const set=(id,v)=>{const e=document.getElementById(id); if(e) e.textContent=String(v).padStart(2,'0');};
  set('cd-d',d); set('cd-h',h); set('cd-m',m); set('cd-s',sec);
}

/* ---------- reveal observer ---------- */
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revealObserver.unobserve(e.target);} });
},{threshold:0.12, rootMargin:'0px 0px -8% 0px'});

/* ---------- nav scroll ---------- */
function initNav(){
  const nav=document.querySelector('.nav');
  const onScroll=()=>nav.classList.toggle('scrolled', window.scrollY>40);
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  // mobile sheet
  const sheet=document.getElementById('sheet');
  document.getElementById('menuBtn')?.addEventListener('click',()=>sheet.classList.add('open'));
  document.getElementById('sheetClose')?.addEventListener('click',()=>sheet.classList.remove('open'));
  sheet?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>sheet.classList.remove('open')));
}

/* ---------- rsvp ---------- */
function initRsvp(){
  const form=document.getElementById('rsvpForm');
  if(!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const pass=document.getElementById('rsvpForm');
    const name=(form.querySelector('[name=name]').value||'').trim();
    const going=form.querySelector('[name=going]:checked');
    const msg=document.getElementById('successMsg');
    const yes = going && going.value==='yes';
    if(LANG==='en'){
      msg.querySelector('h3').textContent = yes ? "You're on board!" : "We'll miss you";
      msg.querySelector('p').textContent = yes
        ? (name? name+", your seat is reserved. " : "")+"We can't wait to celebrate together."
        : "Thank you for letting us know. You'll be with us in spirit.";
    }else{
      msg.querySelector('h3').textContent = yes ? "Sei a bordo!" : "Ci mancherai";
      msg.querySelector('p').textContent = yes
        ? (name? name+", il tuo posto è riservato. " : "")+"Non vediamo l'ora di festeggiare insieme."
        : "Grazie per avercelo fatto sapere. Sarai con noi nel pensiero.";
    }
    msg.querySelector('.plane').textContent = yes? '✈' : '☁';
    pass.classList.add('sent');
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.lang button').forEach(b=>{
    b.addEventListener('click',()=>applyLang(b.dataset.lang));
  });
  buildMap();
  applyLang(LANG);
  setActive(0);
  document.getElementById('apPrev')?.addEventListener('click',()=>setActive((ACTIVE-1+STOPS.length)%STOPS.length));
  document.getElementById('apNext')?.addEventListener('click',()=>setActive((ACTIVE+1)%STOPS.length));
  tickCountdown(); setInterval(tickCountdown,1000);
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  initNav();
  initRsvp();
});
