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
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                  <iframe
                    src={'https://www.youtube.com/embed/' + v.id + '?rel=0&modestbranding=1'}
                    title={P(v.title)}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
                </div>
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
Object.assign(window, { Videos });
