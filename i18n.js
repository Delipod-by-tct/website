/* DELIPOD : bascule FR / EN.
   Le HTML reste en français (lisible tel quel par les moteurs) ; en anglais, chaque texte
   est remplacé à partir de window.DELIPOD_EN, y compris le contenu ajouté plus tard. */
(function () {
  var EN = window.DELIPOD_EN || {};
  var ATTR = ['alt', 'aria-label', 'placeholder', 'title'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var origText = new WeakMap(), origAttr = new WeakMap();
  var ENV = new Set(), FRK = new Set(); for (var k0 in EN) if (Object.prototype.hasOwnProperty.call(EN, k0)) { ENV.add(norm(EN[k0])); FRK.add(norm(k0)); }
  var queue = [], timer = 0;
  var lang = 'fr', busy = false, obs = null;

  function norm(s) { return s.replace(/[\u2019\u2018]/g, "'").replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim(); }
  function isEn(s) { var n = norm(s); return ENV.has(n) && !FRK.has(n); }
  function enOf(s) { var k = norm(s); return k && Object.prototype.hasOwnProperty.call(EN, k) ? EN[k] : null; }

  function doText(n) {
    var v = n.nodeValue;
    if (lang === 'en') {
      if (isEn(v)) return;
      var t = enOf(v);
      if (t === null) return;
      if (!origText.has(n)) origText.set(n, v);
      var lead = v.match(/^\s*/)[0], tail = v.match(/\s*$/)[0];
      var nv = lead + t + tail;
      if (nv !== v) n.nodeValue = nv;
    } else if (origText.has(n)) {
      n.nodeValue = origText.get(n); origText.delete(n);
    }
  }
  function doAttrs(el) {
    for (var i = 0; i < ATTR.length; i++) {
      var a = ATTR[i];
      if (!el.hasAttribute(a)) continue;
      var store = origAttr.get(el) || {};
      if (lang === 'en') {
        var cur = el.getAttribute(a); if (isEn(cur)) continue;
        var t = enOf(cur);
        if (t === null) continue;
        if (!(a in store)) store[a] = el.getAttribute(a);
        origAttr.set(el, store);
        el.setAttribute(a, t);
      } else if (a in store) {
        el.setAttribute(a, store[a]); delete store[a];
      }
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (SKIP[root.tagName] || (root.hasAttribute && root.hasAttribute('data-i18n-skip'))) return; doAttrs(root); }
    var c = root.firstChild;
    while (c) { walk(c); c = c.nextSibling; }
  }

  function meta() {
    var t = document.querySelector('title');
    if (t) { if (!isEn(t.textContent)) t.dataset.fr = t.textContent; var tt = lang === 'en' ? (enOf(t.dataset.fr) || t.dataset.fr) : t.dataset.fr; if (t.textContent !== tt) t.textContent = tt; }
    var d = document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]');
    for (var i = 0; i < d.length; i++) {
      var m = d[i], c = m.getAttribute('content') || ''; if (!isEn(c)) m.dataset.fr = c;
      var nc = lang === 'en' ? (enOf(m.dataset.fr) || m.dataset.fr) : m.dataset.fr; if (c !== nc) m.setAttribute('content', nc);
    }
    var og = document.querySelector('meta[property="og:locale"]'); if (og) og.setAttribute('content', lang === 'en' ? 'en_GB' : 'fr_FR');
    document.documentElement.lang = lang;
  }

  function toggles() {
    var b = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', b[i].getAttribute('data-lang') === lang ? 'true' : 'false');
  }

  function inSkip(n) { var e = n.nodeType === 1 ? n : n.parentNode; return !!(e && e.closest && e.closest('[data-i18n-skip]')); }
  function flush() {
    timer = 0; var q = queue; queue = [];
    if (lang !== 'en') return;
    for (var i = 0; i < q.length; i++) { var n = q[i]; if (n.isConnected !== false) walk(n); }
    meta();
  }
  function observe(on) {
    if (obs) { obs.disconnect(); obs = null; }
    queue = []; if (timer) { clearTimeout(timer); timer = 0; }
    if (!on || !window.MutationObserver) return;
    obs = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var r = list[i];
        if (r.type === 'childList') { for (var j = 0; j < r.addedNodes.length; j++) { var a = r.addedNodes[j]; if (!inSkip(a)) queue.push(a); } }
        else if (!inSkip(r.target)) {
          if (r.type === 'characterData' && isEn(r.target.nodeValue)) continue;
          queue.push(r.target);
        }
      }
      if (queue.length && !timer) timer = setTimeout(flush, 60);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }

  function set(l, save) {
    lang = l === 'en' ? 'en' : 'fr';
    busy = true; walk(document.body); meta(); busy = false;
    toggles(); observe(lang === 'en');
    try { document.dispatchEvent(new CustomEvent('delipod:lang', { detail: lang })); } catch (e) {}
    if (save) { try { localStorage.setItem('delipod.lang', lang); } catch (e) {} }
    try {
      var u = new URL(location.href);
      if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
      history.replaceState(history.state, '', u.toString());
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (!b) return;
    e.preventDefault();
    var l = b.getAttribute('data-lang');
    if (l !== lang) set(l, true);
  });

  function start() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    var saved = null; try { saved = localStorage.getItem('delipod.lang'); } catch (e) {}
    var l = q === 'en' || q === 'fr' ? q : (saved || 'fr');
    toggles();
    if (l === 'en') set('en', false);
  }
  window.delipodSetLang = function (l) { set(l, true); };
  window.delipodLang = function () { return lang; };
  window.delipodT = function (s) { if (lang !== 'en') return s; var t = enOf(s); return t === null ? s : t; };
  window.delipodRetitle = function () { meta(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
  else setTimeout(start, 0);
})();
