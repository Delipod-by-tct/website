/* L'histoire : progression du parcours + scène de relais pilotée au scroll (initialisée quand la page s'affiche) */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init(root){
    root.classList.add('js');
    var q = function(id){ return root.querySelector('#' + id); };
    var head = document.querySelector('header');
    function setNav(){ root.style.setProperty('--navh', (head ? head.offsetHeight : 68) + 'px'); }
    setNav();

    var steps = q('steps');
    function stepsUpdate(){
      if (!steps) return;
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var sp = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (Math.max(r.height, 200) + vh * 0.1)));
      steps.style.setProperty('--sp', sp.toFixed(3));
      var li = steps.children;
      for (var i = 0; i < li.length; i++) { li[i].classList.toggle('on', sp >= (i / li.length) + 0.04 || reduce); }
    }

    var rel = q('rel'), update = null;
    if (rel) {
      var ptruck = q('ptruck'), proute = q('proute');
      var L = ptruck.getTotalLength(), dStop = 380, RL = proute.getTotalLength();
      var truck = q('truck'), bike = q('bike'), pod = q('pod'), podring = q('podring'), ping = q('ping'), flash = q('flash');
      var doors = root.querySelectorAll('#doors .door'), rings = root.querySelectorAll('#rings .rg');
      var hl = rel.querySelectorAll('.hl[data-at]'), chips = q('chips').children;
      var stepN = q('step-n'), stepT = q('step-t');
      var clamp = function(v, a, b){ a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)); };
      var ease = function(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
      var seg = function(p, a, b){ return clamp((p - a) / (b - a)); };
      var lerp = function(a, b, t){ return a + (b - a) * t; };
      var BAY = { x: 430, y: 265 }, NODE = { x: 430, y: 112 };
      var EV = [.34, .52, .66, .78, .90], DOOR = [.66, .78, .90];
      var KEYS = [[.545, 0], [.655, 403], [.685, 403], [.775, 743], [.805, 743], [.90, 963], [1, 963]];
      var sOf = function(p){
        if (p <= KEYS[0][0]) return 0;
        for (var k = 1; k < KEYS.length; k++) { if (p <= KEYS[k][0]) { var a = KEYS[k - 1], b = KEYS[k]; return lerp(a[1], b[1], ease(seg(p, a[0], b[0]))); } }
        return 963;
      };
      var tang = function(path, d, len){ var a = path.getPointAtLength(clamp(d - 8, 0, len)), b = path.getPointAtLength(clamp(d + 8, 0, len)); return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; };
      var stopPt = ptruck.getPointAtLength(dStop);
      var truckD = function(p){ if (p < .24) return ease(seg(p, 0, .24)) * dStop; if (p < .34) return dStop; return dStop + ease(seg(p, .34, .52)) * (L - dStop); };
      var bikeState = function(p){
        if (p < .40) return { x: 640, y: 265, a: 180 };
        if (p < .52) { var t = ease(seg(p, .40, .52)); return { x: 640 - 178 * t, y: 265, a: 180 }; }
        if (p < .545) { var t2 = ease(seg(p, .52, .545)); return { x: 462, y: 265, a: 180 * (1 - t2) }; }
        var s = sOf(p), pt = proute.getPointAtLength(s); return { x: pt.x, y: pt.y, a: tang(proute, s, RL) };
      };
      var podPos = function(p){
        if (p < .24) { var d = truckD(p), pt = ptruck.getPointAtLength(d); return { x: pt.x - 11, y: pt.y }; }
        if (p < .34) { var t = ease(seg(p, .24, .34)); return { x: lerp(stopPt.x - 11, BAY.x, t), y: lerp(stopPt.y, BAY.y, t) }; }
        if (p < .52) return { x: BAY.x, y: BAY.y };
        if (p < .545) { var t3 = ease(seg(p, .52, .545)); return { x: lerp(BAY.x, 442, t3), y: BAY.y }; }
        var s = sOf(p);
        if (s < 22) return { x: 462 + (s - 22), y: 265 };
        var pt2 = proute.getPointAtLength(s - 22); return { x: pt2.x, y: pt2.y };
      };
      var STEPS = [[0, '01', 'Un camion s’arrête en périphérie.'], [.24, '02', 'Le Delipod est déposé au point de rupture.'], [.34, '03', 'Il signale le dépôt à vos outils. Le camion repart.'], [.52, '04', 'Le vélo prend le relais, jusqu’à la dernière porte.'], [.90, '05', 'Chaque retrait remonte dans vos outils, avec sa preuve.']];
      var lastStep = -1;
      update = function(p){
        var d = truckD(p), tp = ptruck.getPointAtLength(d), ta = tang(ptruck, d, L);
        truck.setAttribute('transform', 'translate(' + tp.x.toFixed(1) + ' ' + tp.y.toFixed(1) + ') rotate(' + ta.toFixed(1) + ')');
        var b = bikeState(p); bike.setAttribute('transform', 'translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ') rotate(' + b.a.toFixed(1) + ')');
        var pp = podPos(p); pod.setAttribute('transform', 'translate(' + pp.x.toFixed(1) + ' ' + pp.y.toFixed(1) + ')');
        var pingOp = 0, flashOp = 0, ringOp = 0, ringR = 12;
        for (var e = 0; e < EV.length; e++) {
          var qq = (p - EV[e]) / .075;
          if (qq > 0 && qq < 1) {
            var from = podPos(EV[e]);
            ping.setAttribute('cx', lerp(from.x, NODE.x, ease(qq)).toFixed(1)); ping.setAttribute('cy', lerp(from.y, NODE.y, ease(qq)).toFixed(1)); pingOp = 1;
            ringR = 12 + 18 * qq; ringOp = (1 - qq) * .9;
          } else if (qq >= 1 && qq < 1.25) { flashOp = .6 * (1 - (qq - 1) / .25); }
        }
        ping.setAttribute('opacity', pingOp); flash.setAttribute('opacity', flashOp.toFixed(2));
        podring.setAttribute('cx', pp.x.toFixed(1)); podring.setAttribute('cy', pp.y.toFixed(1)); podring.setAttribute('r', ringR.toFixed(1)); podring.setAttribute('opacity', ringOp.toFixed(2));
        for (var k = 0; k < doors.length; k++) {
          var qd = (p - DOOR[k]) / .08;
          doors[k].setAttribute('fill', p >= DOOR[k] ? '#FFFCFC' : '#0C0C0B');
          if (qd > 0 && qd < 1) { rings[k].setAttribute('r', (5 + 22 * qd).toFixed(1)); rings[k].setAttribute('opacity', (1 - qd).toFixed(2)); } else { rings[k].setAttribute('opacity', 0); }
        }
        for (var h = 0; h < hl.length; h++) { hl[h].classList.toggle('on', p >= parseFloat(hl[h].getAttribute('data-at'))); }
        for (var c = 0; c < chips.length; c++) { chips[c].classList.toggle('on', p >= parseFloat(chips[c].getAttribute('data-at'))); }
        var si = 0; for (var s = 0; s < STEPS.length; s++) { if (p >= STEPS[s][0]) si = s; }
        if (si !== lastStep) { lastStep = si; stepN.textContent = STEPS[si][1]; stepT.textContent = STEPS[si][2]; }
      };
      if (reduce) { rel.classList.add('static'); update(1); } else { update(0); }
    }

    var ticking = false;
    function progress(){
      ticking = false;
      if (!root.isConnected) { stop(); return; }
      stepsUpdate();
    }
    function onScroll(){ if (!ticking) { ticking = true; requestAnimationFrame(progress); } }
    function onResize(){ setNav(); onScroll(); }
    function stop(){ window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); }
    /* relais joué en boucle, comme un GIF, quand il est à l'écran */
    if (rel && !reduce && update) {
      var DUR = 13000, HOLD = 2600, t0 = null, vis = false, raf = 0;
      var loop = function(ts){
        if (!root.isConnected) return;
        if (t0 === null) t0 = ts;
        var t = (ts - t0) % (DUR + HOLD);
        update(Math.min(1, t / DUR));
        raf = vis ? requestAnimationFrame(loop) : 0;
      };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function(es){ vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }, { threshold: .15 }).observe(rel);
      } else { vis = true; raf = requestAnimationFrame(loop); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    progress();
  }
  function scan(){
    var els = document.querySelectorAll('.hist');
    for (var i = 0; i < els.length; i++) { if (!els[i].__hist) { els[i].__hist = true; try { init(els[i]); } catch (e) { console.warn('histoire', e); } } }
  }
  window.__histScan = scan;
  var pending = false;
  function boot(){
    new MutationObserver(function(){ if (!pending) { pending = true; requestAnimationFrame(function(){ pending = false; scan(); }); } }).observe(document.documentElement, { childList: true, subtree: true });
    scan();
    setInterval(scan, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
