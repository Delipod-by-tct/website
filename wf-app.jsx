/* ============ APP ROOT — state, persistence, routing ============ */
const DEFAULTS = { accent:'green', density:'air', titles:'net', images:'real' };

function load(key, fb) {
  try { const v = localStorage.getItem(key); return v == null ? fb : v; } catch (e) { return fb; }
}
function loadTweaks() {
  try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('delipod.tweaks.v2') || '{}')); }
  catch (e) { return Object.assign({}, DEFAULTS); }
}

function App() {
  const [page, setPage]   = useState(() => load('delipod.page', 'home'));
  const [lang, setLang]   = useState(() => load('delipod.lang', 'fr'));
  const [tweaks, setTw]   = useState(loadTweaks);
  const [drawer, setDraw] = useState(false);

  useEffect(() => { localStorage.setItem('delipod.page', page); }, [page]);
  useEffect(() => { localStorage.setItem('delipod.lang', lang); document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    localStorage.setItem('delipod.tweaks.v2', JSON.stringify(tweaks));
    const r = document.documentElement;
    r.setAttribute('data-accent', tweaks.accent);
    r.setAttribute('data-density', tweaks.density);
    r.setAttribute('data-titles', tweaks.titles);
  }, [tweaks]);

  const setTweak = (k, v) => setTw(t => Object.assign({}, t, { [k]: v }));

  // global navigation helper for CTA buttons: deliGo(page, anchorId?)
  useEffect(() => {
    window.deliGo = (targetPage, anchorId) => {
      setPage(targetPage);
      if (!anchorId) { window.scrollTo(0, 0); return; }
      let tries = 0;
      const tick = () => {
        if (document.getElementById(anchorId)) {
          window.deliScrollTo(anchorId);
        } else if (tries++ < 80) {
          setTimeout(tick, 30);
        }
      };
      setTimeout(tick, 50);
    };
  }, []);

  // reset scroll on plain page change (toolbar nav); anchor CTAs re-scroll after
  const prevPage = React.useRef(page);
  useEffect(() => {
    if (prevPage.current !== page) window.scrollTo(0, 0);
    prevPage.current = page;
  }, [page]);

  let body = null, cap = '';
  if (page === 'home') {
    body = <HomeB />;
    cap = tr(lang,'Accueil','Home');
  } else if (page === 'about') {
    body = <About />;
    cap = tr(lang,'À propos','About');
  } else if (page === 'presse') {
    body = <Presse />;
    cap = tr(lang,'Presse','Press');
  } else if (page === 'legal') {
    body = <MentionsLegales />;
    cap = tr(lang,'Mentions légales','Legal notice');
  } else if (page === 'cgv') {
    body = <CGV />;
    cap = tr(lang,'Conditions générales de vente','Terms of sale');
  } else {
    body = <Contact />;
    cap = tr(lang,'Contact','Contact');
  }

  return (
    <WF.Provider value={{ lang, tweaks }}>
      <Toolbar page={page} setPage={setPage} lang={lang} setLang={setLang} onTweaks={() => setDraw(true)} />
      <EventBanner lang={lang} />
      <div className="stage">
        <div className="sheet">{body}</div>
      </div>
      <Tweaks open={drawer} onClose={() => setDraw(false)} tweaks={tweaks} set={setTweak} lang={lang} />
    </WF.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
