/* ============================================================
   ANTONIO & ROBERTO — atlas-geo.js
   Real-geography journey: flat world chart (option 1) +
   rotating orthographic globe (option 2), switchable.
   Requires: d3 (v7) and topojson-client, loaded before this file.
   ============================================================ */
(function(){
  const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

  // palette (mirrors site.css "Atlante" system)
  const SAGE      = 'oklch(0.68 0.145 42)';     // coral
  const SAGE_DEEP = 'oklch(0.585 0.155 40)';    // terracotta accent
  const LINE      = '#cdbfa4';
  const LAND_FILL = 'oklch(0.855 0.05 64)';     // warm apricot-tan landmass
  const COAST     = 'oklch(0.56 0.10 46)';      // warm terracotta coastline
  const OCEAN_FLAT= '#f1e9d8';

  let CFG, stage, canvas, ctx, plane, glabel, toggleBtns = [];
  let desktopMode = 'chart';          // user's chosen mode on desktop
  const mqMobile = window.matchMedia('(max-width:960px)');
  let W = 0, H = 0, DPR = 1;
  let land = null, GRAT = null, ROUTE = null, proj = null, pathGen = null;
  let stops = [], pins = [];
  let mode = 'chart';                 // 'chart' | 'globe'
  let rot = [-12, -18];               // [lambda, phi]
  let rotFrom = null, targetRot = null, rotT0 = 0;
  const ROT_DUR = 1150, SPIN_SPEED = 6; // deg/sec idle spin
  let raf = null, lastTs = 0, spinPauseUntil = 0, dragging = false, ready = false;
  const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- math helpers ---------- */
  const HALF_PI = Math.PI / 2;
  function shortAngle(a, b){ return ((b - a) % 360 + 540) % 360 - 180; }
  function lerpAngle(a, b, t){ return a + shortAngle(a, b) * t; }
  function easeInOut(t){ return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2; }

  /* ---------- setup ---------- */
  function init(cfg){
    CFG = cfg;
    stops = cfg.stops;
    stage = document.getElementById('atlasStage');
    if(!stage) return;

    canvas = document.getElementById('atlasCanvas');
    if(!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'atlasCanvas';
      stage.insertBefore(canvas, stage.firstChild);
    }
    ctx = canvas.getContext('2d');

    // plane marker
    plane = document.createElement('div');
    plane.className = 'atlas-plane';
    plane.id = 'atlasPlane';
    plane.textContent = '\u2708';
    stage.appendChild(plane);

    // live caption shown under the globe on mobile
    glabel = document.createElement('div');
    glabel.className = 'globe-label';
    stage.appendChild(glabel);

    // pins (reuse .pin styling from site.css)
    stops.forEach((s, i) => {
      const pin = document.createElement('button');
      pin.className = 'pin' + (s.final ? ' final' : '');
      pin.dataset.idx = i;
      pin.setAttribute('aria-label', s.name);
      pin.innerHTML = '<span class="dot">' + (s.final ? '\u2605' : s.id) +
                      '</span><span class="nm">' + s.name + '</span>';
      pin.addEventListener('click', () => CFG.onSelect(i));
      stage.appendChild(pin);
      pins.push(pin);
    });

    // mode toggle
    const tg = document.getElementById('mapToggle');
    if(tg){
      toggleBtns = Array.from(tg.querySelectorAll('button'));
      toggleBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode, true)));
    }

    // drag to spin (globe only)
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup',   onUp);
    canvas.addEventListener('pointerleave',onUp);

    GRAT = d3.geoGraticule10();
    buildRoute();

    // observe size (ResizeObserver catches breakpoint show/hide; window resize as fallback)
    if(window.ResizeObserver){
      new ResizeObserver(() => onResize()).observe(stage);
    }
    window.addEventListener('resize', onResize);

    stage.classList.add('mode-chart');
    updateLabel(CFG._active || 0);

    // mobile shows the globe by default; desktop respects the toggle
    if(mqMobile.addEventListener) mqMobile.addEventListener('change', applyResponsiveMode);
    else if(mqMobile.addListener) mqMobile.addListener(applyResponsiveMode);
    applyResponsiveMode();

    // load geography
    fetch(LAND_URL)
      .then(r => r.json())
      .then(topo => {
        land = topojson.feature(topo, topo.objects.land);
        ready = true;
        sizeCanvas();
        if(mode === 'globe'){                       // start centred on the active stop
          const a = CFG._active || 0;
          rot = [ -stops[a].lng, -stops[a].lat ];
        }
        makeProjection();
        draw();
        if(mode === 'globe'){ lastTs = 0; ensureRAF(); }
      })
      .catch(err => { console.warn('atlas-geo: land load failed', err); });
  }

  function buildRoute(){
    const coords = [];
    for(let i = 0; i < stops.length - 1; i++){
      const a = [stops[i].lng, stops[i].lat];
      const b = [stops[i+1].lng, stops[i+1].lat];
      const I = d3.geoInterpolate(a, b);
      for(let t = 0; t <= 1.0001; t += 1/30) coords.push(I(Math.min(1, t)));
    }
    ROUTE = { type: 'LineString', coordinates: coords };
  }

  function sizeCanvas(){
    const r = stage.getBoundingClientRect();
    if(r.width < 2 || r.height < 2) return false;  // stage hidden / not laid out yet
    W = r.width; H = r.height;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return true;
  }

  function makeProjection(){
    if(!land || !W) return;
    if(mode === 'globe'){
      proj = d3.geoOrthographic().clipAngle(90).rotate(rot)
              .fitExtent([[18,18],[W-18,H-18]], { type:'Sphere' });
    } else {
      proj = d3.geoNaturalEarth1()
              .fitExtent([[6,12],[W-6,H-12]], { type:'Sphere' });
    }
    pathGen = d3.geoPath(proj, ctx);
  }

  /* ---------- drawing ---------- */
  function globeGradient(){
    const c = proj.translate(), r = proj.scale();
    const g = ctx.createRadialGradient(c[0]-r*0.34, c[1]-r*0.4, r*0.1, c[0], c[1], r*1.08);
    g.addColorStop(0, '#f6edda');
    g.addColorStop(0.65,'#ece0c8');
    g.addColorStop(1, '#dccfb3');
    return g;
  }

  function draw(){
    if(!ready) return;
    // lazily (re)size if the stage just became visible (e.g. resized past breakpoint)
    const r = stage.getBoundingClientRect();
    if((!proj || canvas.width <= 2 || Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) && r.width > 2){
      if(sizeCanvas()) makeProjection();
    }
    if(!proj || canvas.width <= 2) return;
    ctx.clearRect(0, 0, W, H);

    // ocean / sphere
    ctx.beginPath(); pathGen({ type:'Sphere' });
    ctx.fillStyle = (mode === 'globe') ? globeGradient() : OCEAN_FLAT;
    ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = LINE; ctx.stroke();

    // graticule
    ctx.beginPath(); pathGen(GRAT);
    ctx.lineWidth = 0.6; ctx.strokeStyle = 'rgba(43,38,32,0.13)'; ctx.stroke();

    // land
    ctx.beginPath(); pathGen(land);
    ctx.fillStyle = LAND_FILL; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = COAST; ctx.stroke();

    // route
    ctx.beginPath(); pathGen(ROUTE);
    ctx.lineWidth = 1.4; ctx.setLineDash([1.6, 4.2]);
    ctx.strokeStyle = SAGE_DEEP; ctx.stroke(); ctx.setLineDash([]);

    positionPins();
  }

  function positionPins(){
    if(!proj) return;
    const r = proj.rotate(), center = [-r[0], -r[1]];
    let activeIdx = CFG._active || 0;
    pins.forEach((pin, i) => {
      const s = stops[i];
      const p = proj([s.lng, s.lat]);
      let vis = !!p;
      if(mode === 'globe' && d3.geoDistance([s.lng, s.lat], center) > HALF_PI) vis = false;
      if(!vis){ pin.style.display = 'none'; return; }
      pin.style.display = 'flex';
      pin.style.left = p[0] + 'px';
      pin.style.top  = p[1] + 'px';
    });
    // plane on active stop
    if(plane){
      const s = stops[activeIdx];
      const p = proj([s.lng, s.lat]);
      let vis = !!p;
      if(mode === 'globe' && d3.geoDistance([s.lng, s.lat], center) > HALF_PI) vis = false;
      if(vis){
        plane.style.display = 'block';
        plane.style.left = p[0] + 'px';
        plane.style.top  = (p[1] - 2) + 'px';
      } else {
        plane.style.display = 'none';
      }
    }
  }

  /* ---------- animation loop (globe) ---------- */
  function ensureRAF(){ if(mode === 'globe' && raf == null) raf = requestAnimationFrame(frame); }

  function frame(ts){
    raf = null;
    if(mode !== 'globe'){ return; }
    const dt = lastTs ? (ts - lastTs) : 16; lastTs = ts;

    if(targetRot){
      const t = Math.min(1, (ts - rotT0) / ROT_DUR);
      const e = easeInOut(t);
      rot = [ lerpAngle(rotFrom[0], targetRot[0], e),
              lerpAngle(rotFrom[1], targetRot[1], e) ];
      proj.rotate(rot);
      if(t >= 1){ targetRot = null; spinPauseUntil = ts + 2600; }
      draw();
      raf = requestAnimationFrame(frame);
      return;
    }

    if(!reduceMotion && !dragging && ts > spinPauseUntil){
      rot = [ rot[0] + SPIN_SPEED * dt / 1000, rot[1] ];
      proj.rotate(rot);
      draw();
      raf = requestAnimationFrame(frame);
      return;
    }

    // idle but keep loop alive cheaply so spin can resume / drag redraws
    if(!reduceMotion){ raf = requestAnimationFrame(frame); }
  }

  /* ---------- mode + active ---------- */
  function updateLabel(i){
    if(!glabel) return;
    const s = stops[i]; if(!s) return;
    glabel.innerHTML = '<b>' + String(s.id).padStart(2,'0') + '</b>' +
                       '<span class="gl-sep">\u00b7</span>' + s.name;
  }

  function applyResponsiveMode(){
    setMode(mqMobile.matches ? 'globe' : desktopMode);
  }

  function setMode(m, userInitiated){
    if(userInitiated && !mqMobile.matches) desktopMode = m;
    if(m === mode) return;
    mode = m;
    stage.classList.toggle('mode-globe', m === 'globe');
    stage.classList.toggle('mode-chart', m === 'chart');
    toggleBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    if(plane) plane.style.transition = (m === 'globe') ? 'none' : '';
    if(!ready) return;
    makeProjection();
    if(m === 'globe'){
      const a = CFG._active || 0;
      rotFrom = proj.rotate().slice();
      targetRot = [ -stops[a].lng, -stops[a].lat ];
      rotT0 = performance.now();
      if(reduceMotion){ rot = targetRot.slice(); targetRot = null; proj.rotate(rot); draw(); }
      lastTs = 0; ensureRAF();
    } else {
      if(raf != null){ cancelAnimationFrame(raf); raf = null; }
      draw();
    }
  }

  function setActive(i){
    CFG._active = i;
    updateLabel(i);
    pins.forEach((p, idx) => {
      p.classList.toggle('active', idx === i);
      const nm = p.querySelector('.nm');
      if(nm) nm.textContent = stops[idx].name;
    });
    if(!ready) return;
    if(mode === 'globe'){
      rotFrom = proj.rotate().slice();
      targetRot = [ -stops[i].lng, -stops[i].lat ];
      rotT0 = performance.now();
      if(reduceMotion){ rot = targetRot.slice(); targetRot = null; proj.rotate(rot); draw(); }
      else { lastTs = 0; ensureRAF(); }
    } else {
      draw(); // plane glides via CSS transition
    }
  }

  /* ---------- interaction ---------- */
  let lastX = 0, lastY = 0;
  function onDown(e){
    if(mode !== 'globe') return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    stage.classList.add('dragging');
    try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
  }
  function onMove(e){
    if(!dragging || mode !== 'globe') return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    const r = proj.rotate();
    rot = [ r[0] + dx * 0.32, Math.max(-82, Math.min(82, r[1] - dy * 0.32)) ];
    proj.rotate(rot); targetRot = null;
    draw();
  }
  function onUp(){
    if(!dragging) return;
    dragging = false;
    stage.classList.remove('dragging');
    spinPauseUntil = performance.now() + 3200;
    lastTs = 0; ensureRAF();
  }

  /* ---------- resize ---------- */
  function onResize(){
    if(!ready) return;
    if(sizeCanvas()){
      makeProjection();
      draw();
    }
  }

  window.AtlasGeo = { init, setActive, setMode };
})();
