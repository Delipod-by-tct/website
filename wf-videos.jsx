/* ============ VIDÉOS ============ */
function Videos() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  const P = (o) => tr(lang, o.fr, o.en);
  const videos = window.DELI.videos;
  const groups = [];
  videos.forEach((v) => {
    const key = v.cat.fr;
    let g = groups.find((g) => g.key === key);
    if (!g) { g = { key, cat: v.cat, items: [] }; groups.push(g); }
    g.items.push(v);
  });

  return (
    <div>
      <section className="wsec" style={{ paddingTop: '70px', paddingBottom: '20px' }}>
        <Kicker>{T('Vidéos', 'Videos')}</Kicker>
        <h1 className="wt" style={{ marginBottom: 16, fontSize: "40px" }}>
          {T('DELIPOD en images', 'DELIPOD in motion')}
        </h1>
        <p className="lead" style={{ width: '100%', maxWidth: 'none' }}>
          {T('Présentations, événements, livraisons de terrain et coulisses de fabrication. Toutes les vidéos DELIPOD, passées et à venir.',
          'Presentations, events, field deliveries and behind-the-scenes manufacturing. Every DELIPOD video, past and future.')}
        </p>
      </section>

      {groups.map((g, gi) =>
      <section className="wsec" key={g.key} style={{ background: gi % 2 ? 'var(--grey-fill-2)' : undefined }}>
          <Kicker n={'0' + (gi + 1)}>{P(g.cat)}</Kicker>
          <div className="grid2" style={{ gap: 32 }}>
            {g.items.map((v) =>
            <div key={v.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <LiteVideo id={v.id} title={P(v.title)} />
                <div style={{ padding: 22 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{P(v.date)}</div>
                  <h3 className="wt" style={{ fontSize: 18, marginBottom: 8 }}>{P(v.title)}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: '#54544e', margin: 0 }}>{P(v.desc)}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="wsec" style={{ textAlign: 'center', background: 'var(--grey-fill-2)' }}>
        <h2 className="wt" style={{ width: '100%', maxWidth: 'none', margin: '0 auto 22px', fontSize: '28px' }}>
          {T('Construisons la logistique urbaine de demain', 'Let’s build tomorrow’s urban logistics')}
        </h2>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Btn primary arrow onClick={() => window.deliGo('contact')}>{T('Nous contacter', 'Contact us')}</Btn>
          <Btn onClick={() => window.deliGo('home', 'sec-ov')}>{T('Découvrir DELIPOD', 'Discover DELIPOD')}</Btn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
/* ---- click-to-play YouTube (avoids embed referrer errors, stays on site) ---- */
function LiteVideo({ id, title }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000' }}>
        <iframe
          src={'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1'}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      </div>);
  }
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000' }}>
      <button onClick={() => setPlaying(true)} aria-label={title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 0, padding: 0, cursor: 'pointer', display: 'block' }}>
        <img src={'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'} alt={title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 62, height: 44, borderRadius: 10, background: 'rgba(20,20,18,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
      </button>
    </div>);
}
Object.assign(window, { LiteVideo });

Object.assign(window, { Videos });

/* ---- reusable video carousel (used on the home page) ---- */
function VideoCarousel() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  const P = (o) => tr(lang, o.fr, o.en);
  const videos = window.DELI.videos;
  const trackRef = React.useRef(null);
  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };
  return (
    <div>
      <div ref={trackRef} className="noscrollbar" style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 8 }}>
        {videos.map((v) =>
        <div key={v.id} className="card" style={{ flex: '0 0 320px', scrollSnapAlign: 'start', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', flex: '0 0 auto' }}>
              <LiteVideo id={v.id} title={P(v.title)} />
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '3px 8px' }}>{P(v.cat)}</span>
              </div>
              <h3 className="wt" style={{ fontSize: 15.5, margin: 0 }}>{P(v.title)}</h3>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
        <button className="wbtn" onClick={() => scrollBy(-1)} style={{ padding: '10px 16px' }}>←</button>
        <button className="wbtn" onClick={() => scrollBy(1)} style={{ padding: '10px 16px' }}>→</button>
        <span className="wbtn" onClick={() => window.deliGo('videos')} style={{ padding: '10px 18px', cursor: 'pointer' }}>{T('Toutes les vidéos', 'All videos')}<span className="arr">→</span></span>
      </div>
    </div>
  );
}
Object.assign(window, { VideoCarousel });
