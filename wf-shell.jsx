/* ============ DELIPOD wireframes — shell, context & primitives ============ */
const { useState, useEffect, useContext, createContext, createElement } = React;

const WF = createContext({ lang: 'fr', tweaks: {} });
const useWF = () => useContext(WF);
const tr = (lang, fr, en) => lang === 'en' ? en : fr;
window.tr = tr;
window.useWF = useWF;
window.WF = WF;

/* ---- greeked text ---- */
function Lines({ n = 3, w = '70%', gap }) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const width = i === n - 1 ? w : '100%';
    rows.push(<span key={i} style={{ width }} />);
  }
  return <div className="lines" style={gap ? { gap } : null}>{rows}</div>;
}

/* ---- section kicker  "01 — OVERVIEW" ---- */
function Kicker({ n, children, style }) {
  return <p className="kicker" style={style}>{n ? <b>{n}</b> : null}{children}</p>;
}

/* ---- product / image placeholder (swaps to real render via tweak) ---- */
function Slot({ label, src, dim, style, className = '', imgStyle }) {
  const { tweaks } = useWF();
  const real = tweaks.images === 'real' && src;
  return (
    <div className={'slot ' + (real ? 'real ' : '') + className} data-label={label} style={style}>
      {real ? <img src={src} alt={label} style={imgStyle} /> : null}
      {dim ? <span className="dim">{dim}</span> : null}
    </div>);

}

/* ---- annotation note (hand-drawn) ---- */
function Note({ children, grey, style }) {
  return <span className={'note' + (grey ? ' grey' : '')} style={style}>{children}</span>;
}

/* ---- wireframe button ---- */
function Btn({ children, primary, arrow, href, onClick }) {
  const cls = 'wbtn' + (primary ? ' primary' : '');
  const inner = <React.Fragment>{children}{arrow ? <span className="arr">→</span> : null}</React.Fragment>;
  if (href) {
    return <a className={cls} href={href} onClick={onClick} style={{ fontSize: "15px", textDecoration: 'none' }}>{inner}</a>;
  }
  return (
    <span className={cls} onClick={onClick} style={{ fontSize: "15px", cursor: onClick ? 'pointer' : 'default' }}>
      {inner}
    </span>);

}

/* ---- global smooth scroll to a section id (works without behavior:smooth) ---- */
function deliScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const compute = () => el.getBoundingClientRect().top + window.scrollY - 104;
  const start = window.scrollY;
  const target = compute();
  const dist = target - start;
  const dur = 500;
  let t0 = null, done = false;
  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const step = (ts) => {
    if (t0 === null) t0 = ts;
    const p = Math.min((ts - t0) / dur, 1);
    window.scrollTo(0, start + dist * ease(p));
    if (p < 1) requestAnimationFrame(step); else done = true;
  };
  requestAnimationFrame(step);
  // fallback: guarantee final position even if rAF is throttled (background paint)
  setTimeout(() => { if (!done) window.scrollTo(0, compute()); }, 650);
}
window.deliScrollTo = deliScrollTo;

/* ---- DELIPOD wordmark (Lovelo placeholder) ---- */
function Mark({ size = 18, color }) {
  return (
    <span style={{
      fontFamily: 'var(--ui)', fontWeight: 700, letterSpacing: '.22em',
      fontSize: size, color: color || 'inherit'
    }}>DELIPOD</span>);

}

Object.assign(window, { Lines, Kicker, Slot, Note, Btn, Mark });

/* ---- equipment line-icons (functional UI icons) ---- */
function EquipIcon({ name, size = 26 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    '4G': <g><path d="M5 14a7 7 0 0 1 14 0" /><path d="M2 14a10 10 0 0 1 20 0" /><circle cx="12" cy="15" r="1.4" /></g>,
    'GPS': <g><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></g>,
    'LOCK': <g><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></g>,
    'PWR': <g><path d="M12 3v3" /><path d="M12 18v3" /><path d="M5 12H2" /><path d="M22 12h-3" /><path d="M6 6 4 4" /><path d="m20 4-2 2" /><circle cx="12" cy="12" r="4" /></g>,
    'CAM': <g><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" /><circle cx="12" cy="12.5" r="3.2" /></g>,
    'IoT': <g><rect x="8" y="8" width="8" height="8" rx="1.5" /><path d="M10 8V5M14 8V5M10 19v-3M14 19v-3M8 10H5M8 14H5M19 10h-3M19 14h-3" /></g>
  };
  return <svg {...common}>{paths[name] || <rect x="5" y="5" width="14" height="14" rx="2" />}</svg>;
}
window.EquipIcon = EquipIcon;

/* ---- sector icons (DELIPOD Fresh) ---- */
function SectorIcon({ name, size = 17 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    'food': <g><path d="M5 3v7a3 3 0 0 0 6 0V3" /><path d="M8 3v18" /><path d="M17 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5Z" /><path d="M17 12v9" /></g>,
    'medical': <g><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z" /></g>,
    'sensitive': <g><path d="M12 3 4 7v5c0 4.5 3.5 7.5 8 9 4.5-1.5 8-4.5 8-9V7Z" /><path d="m9 12 2 2 4-4" /></g>
  };
  return <svg {...common}>{paths[name] || <circle cx="12" cy="12" r="8" />}</svg>;
}
window.SectorIcon = SectorIcon;

/* ===================== TOOLBAR (tool chrome) ===================== */
function Toolbar({ page, setPage, lang, setLang, onTweaks }) {
  const tabs = [
  { id: 'home', fr: 'Accueil', en: 'Home' },
  { id: 'about', fr: 'À propos', en: 'About' },
  { id: 'presse', fr: 'Presse', en: 'Press' },
  { id: 'contact', fr: 'Contact', en: 'Contact' }];

  return (
    <div className="chrome">
      <div className="chrome-row">
        <div className="brandchip" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
          <span className="mark">DELIPOD</span>
          <span className="sub"></span>
        </div>
        <div className="tabs" role="tablist">
          {tabs.map((t) =>
          <button key={t.id} className="tab" role="tab"
          aria-selected={page === t.id} onClick={() => setPage(t.id)}>
              {tr(lang, t.fr, t.en)}
            </button>
          )}
        </div>
        <div className="chrome-right">
          <div className="langtog">
            <button aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
            <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
          {(typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin')) ?
          <button className="gear" onClick={onTweaks}>◵ {tr(lang, 'Réglages', 'Tweaks')}</button> : null}
        </div>
      </div>
    </div>);

}

/* ===================== DIRECTION SUB-BAR (home only) ===================== */
function SubBar({ dir, setDir, lang }) {
  return (
    <div className="subbar">
      <div className="subbar-row">
        <span className="lbl">{tr(lang, 'Page d’accueil — 2 directions', 'Home — 2 directions')}</span>
        <div className="dirtog">
          <button className="dirbtn" aria-pressed={dir === 'a'} onClick={() => setDir('a')}>
            <span className="num">A</span>{tr(lang, 'Éditorial', 'Editorial')}
          </button>
          <button className="dirbtn" aria-pressed={dir === 'b'} onClick={() => setDir('b')}>
            <span className="num">B</span>{tr(lang, 'Technique', 'Technical')}
          </button>
        </div>
        <Note grey style={{ marginLeft: 'auto' }}>
          {tr(lang, '← compare les deux mises en page', '← compare the two layouts')}
        </Note>
      </div>
    </div>);

}

/* ===================== TWEAKS DRAWER ===================== */
function Tweaks({ open, onClose, tweaks, set, lang }) {
  if (!open) return null;
  const Seg = ({ k, opts }) =>
  <div className="seg">
      {opts.map((o) =>
    <button key={o.v} aria-pressed={tweaks[k] === o.v} onClick={() => set(k, o.v)}>{o.l}</button>
    )}
    </div>;

  const accents = [
  { v: 'green', c: '#16786a' },
  { v: 'blue', c: '#2f5fd0' },
  { v: 'orange', c: '#c4602a' },
  { v: 'teal', c: '#1f7a6b' },
  { v: 'none', c: '#23241f' }];

  return (
    <React.Fragment>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-hd">
          <h4>{tr(lang, 'Réglages', 'Tweaks')}</h4>
          <button className="xbtn" onClick={onClose}>×</button>
        </div>
        <div className="drawer-bd">
          <div className="twk">
            <div className="tlbl">{tr(lang, 'Couleur d’accent', 'Accent colour')}</div>
            <div className="swatches">
              {accents.map((a) =>
              <button key={a.v} className="sw" style={{ background: a.c }}
              aria-pressed={tweaks.accent === a.v} onClick={() => set('accent', a.v)}
              title={a.v} />
              )}
            </div>
            <Note grey style={{ fontSize: 13, marginTop: 9, display: 'block' }}>
              {tr(lang, 'dernier = noir pur, sans accent', 'last = pure black, no accent')}
            </Note>
          </div>
          <div className="twk">
            <div className="tlbl">{tr(lang, 'Densité', 'Density')}</div>
            <Seg k="density" opts={[
            { v: 'air', l: tr(lang, 'Aéré', 'Airy') },
            { v: 'compact', l: tr(lang, 'Compact', 'Compact') }]
            } />
          </div>
          <div className="twk">
            <div className="tlbl">{tr(lang, 'Style des titres', 'Heading style')}</div>
            <Seg k="titles" opts={[
            { v: 'net', l: tr(lang, 'Net', 'Clean') },
            { v: 'croquis', l: tr(lang, 'Croquis', 'Sketch') }]
            } />
          </div>
          <div className="twk" style={{ borderBottom: '0' }}>
            <div className="tlbl">{tr(lang, 'Images', 'Images')}</div>
            <Seg k="images" opts={[
            { v: 'placeholder', l: tr(lang, 'Placeholder', 'Placeholder') },
            { v: 'real', l: tr(lang, 'Réelles', 'Real') }]
            } />
            <Note grey style={{ fontSize: 13, marginTop: 9, display: 'block' }}>
              {tr(lang, 'glisse les rendus DELIPOD dans les zones', 'drop DELIPOD renders into the slots')}
            </Note>
          </div>
        </div>
      </aside>
    </React.Fragment>);

}

/* ===================== EVENT BANNER (sous le header) ===================== */
function EventBanner({ lang }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div style={{ background: 'var(--accent)', color: '#fff' }}>
      <div className="eventbar-row" style={{ maxWidth: 1380, margin: '0 auto', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,.16)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        <p style={{ margin: 0, flex: '1 1 auto', fontSize: 14, lineHeight: 1.35, minWidth: 200 }}>
          <strong style={{ fontWeight: 700 }}>{tr(lang, 'Événement', 'Event')}</strong>
          <span style={{ opacity: .92 }}>{tr(lang,
            ' — Première présentation publique de DELIPOD à l’Innovation Day II d’Eutronix le 3 juillet 2026.',
            ' — First public reveal of DELIPOD at Eutronix Innovation Day II on 3 July 2026.')}</span>
        </p>
        <a href="https://www.eutronix.eu/fr/event/innovation-day-ii-11/register" target="_blank" rel="noopener noreferrer"
          style={{ flex: '0 0 auto', background: '#fff', color: 'var(--ink)', border: 0, borderRadius: 6, padding: '9px 18px', fontFamily: 'var(--ui)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          {tr(lang, 'S’inscrire', 'Register')}<span style={{ fontFamily: 'var(--mono)' }}>→</span>
        </a>
        <button onClick={() => setOpen(false)} aria-label={tr(lang, 'Fermer', 'Close')}
          style={{ flex: '0 0 auto', background: 'transparent', border: 0, color: '#fff', fontSize: 19, lineHeight: 1, opacity: .8, cursor: 'pointer', padding: '4px 6px' }}>×</button>
      </div>
    </div>);

}

Object.assign(window, { Toolbar, SubBar, Tweaks, EventBanner });