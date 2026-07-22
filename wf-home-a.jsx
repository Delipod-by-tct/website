/* ============ HOME — Direction A · Éditorial (AirPods-like) ============ */
const IMG_OPEN = 'assets/delipod-open.png';
const IMG_STREET = 'assets/delipod-street.png';
const IMG_HERO = 'assets/delipod-hero-transparent.png';
const IMG_VELO = 'assets/usecase-velo.jpg';
const IMG_ACHEM = 'assets/usecase-acheminement.jpg';
const IMG_CHAKIB = 'assets/chakib.png';
const IMG_SALIM = 'assets/salim.png';
const IMG_ELEC = 'assets/electronics.png';
const IMG_TONCARTON = 'assets/toncarton-logo.png';
const IMG_EUTRONIX = 'assets/eutronix-logo.jpg';
const IMG_FAB = ['assets/fab-slicer.png', 'assets/fab-weld-1.png', 'assets/fab-weld-2.png', 'assets/fab-weld-3.png'];
Object.assign(window, { IMG_OPEN, IMG_STREET, IMG_HERO, IMG_VELO, IMG_ACHEM, IMG_CHAKIB, IMG_SALIM, IMG_ELEC, IMG_TONCARTON, IMG_EUTRONIX, IMG_FAB });

function HomeA() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  const P = (o) => tr(lang, o.fr, o.en);
  const D = window.DELI;

  return (
    <div>
      {/* HERO */}
      <section className="wsec" style={{ textAlign: 'center', paddingTop: '70px' }}>
        <Kicker>DELIPOD · TONCARTON</Kicker>
        <h1 className="wt" style={{ maxWidth: '18ch', margin: '0 auto 22px' }}>{P(D.hero.title)}</h1>
        <p className="lead" style={{ margin: '0 auto 14px' }}>{P(D.hero.sub)}</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 30 }}>
          {P(D.hero.tagline)}
        </p>
        <div className="row" style={{ justifyContent: 'center', marginBottom: 46 }}>
          <Btn primary arrow>{T('Découvrir la solution', 'Discover the solution')}</Btn>
          <Btn>{T('Nous contacter', 'Contact us')}</Btn>
        </div>
        <div style={{ position: 'relative' }}>
          <Slot label={T('RENDU PRODUIT — vue 3/4 plein écran', 'PRODUCT RENDER — full-bleed 3/4')}
          src={IMG_OPEN} dim="DELIPOD 001" style={{ height: 440, maxWidth: 900, margin: '0 auto' }} />
        </div>
      </section>

      {/* OVERVIEW — présentation */}
      <section className="wsec">
        <div className="grid2" style={{ alignItems: 'center' }}>
          <div>
            <Kicker n="01">{T('Présentation', 'Overview')}</Kicker>
            <h2 className="wt" style={{ marginBottom: 18 }}>
              {T('Un micro-hub mobile pour la logistique urbaine.', 'A mobile micro-hub for urban logistics.')}
            </h2>
            <div className="col" style={{ gap: 8 }}>
              {D.overview.map((p, i) => <p key={i} className="lead" style={{ maxWidth: 'none' }}>{P(p)}</p>)}
            </div>
          </div>
          <Slot label={T('PHOTO — DELIPOD en situation', 'PHOTO — DELIPOD in context')}
          src={IMG_STREET} dim="contexte urbain" style={{ height: 380 }} />
        </div>
      </section>

      {/* WHY DELIPOD — problem */}
      <section className="wsec fill">
        <Kicker n="02">{T('Pourquoi DELIPOD ?', 'Why DELIPOD?')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 14, maxWidth: '20ch' }}>{P(D.why.intro)}</h2>
        <div className="grid2" style={{ alignItems: 'start', marginTop: 24 }}>
          <div className="col" style={{ gap: 0 }}>
            {D.why.points.map((p, i) =>
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '14px 0', borderBottom: '1px dashed var(--line-soft)' }}>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>{'0' + (i + 1)}</span>
                <span style={{ fontSize: 16, color: '#3f3f3a' }}>{P(p)}</span>
              </div>
            )}
          </div>
          <div className="card" style={{ alignSelf: 'start', background: 'var(--ink)', color: '#f1f1ec', borderColor: 'var(--ink)' }}>
            <h3 className="wt" style={{ fontSize: 20, marginBottom: 12, color: '#fff' }}>{T('La réponse DELIPOD', 'The DELIPOD answer')}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.5, color: '#cfcfc8', margin: 0 }}>{P(D.why.outro)}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — fonctionnement */}
      <section className="wsec">
        <Kicker n="03">{T('Fonctionnement', 'How it works')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 30, maxWidth: '20ch' }}>
          {T('Du poids lourd au dernier kilomètre.', 'From truck to last mile.')}
        </h2>
        <div className="grid4" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
          {D.how.steps.map((s, i) =>
          <div key={i} style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700, marginBottom: 10 }}>{'0' + (i + 1)}{i < 4 ? '  →' : ''}</div>
              <Slot label={P(s.ill)} src={s.real ? IMG_OPEN : null} style={{ height: 120, marginBottom: 12 }} />
              <p style={{ fontSize: 14, lineHeight: 1.4, color: '#3f3f3a', margin: 0 }}>{P(s)}</p>
            </div>
          )}
        </div>
        <div className="card" style={{ marginTop: 28, display: 'flex', gap: 14, alignItems: 'center' }}>
          <span className="icon" style={{ flex: '0 0 auto' }}>≡</span>
          <p style={{ margin: 0, fontSize: 15, color: '#3f3f3a' }}>{P(D.how.events)}</p>
        </div>
      </section>

      {/* FEATURES — équipements embarqués */}
      <section className="wsec fill">
        <Kicker n="04">{T('Fonctionnalités & équipements', 'Features & equipment')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 30, maxWidth: '20ch' }}>
          {T('Ce que DELIPOD embarque.', 'What DELIPOD carries on board.')}
        </h2>
        <div className="grid3">
          {D.equipment.map((f) =>
          <div className="card" key={f.k} style={{ position: 'relative' }}>
              {f.opt ? <span style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--line-soft)', borderRadius: 999, padding: '3px 9px' }}>{T('Option', 'Option')}</span> :
            <span style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '3px 9px' }}>{T('De série', 'Standard')}</span>}
              <div className="icon" style={{ marginBottom: 16, border: 'none', color: 'var(--accent)', width: 'auto', height: 'auto', justifyContent: 'flex-start' }}>
                <EquipIcon name={f.k} size={30} />
              </div>
              <h3 className="wt" style={{ fontSize: 18 }}>{P(f)}</h3>
            </div>
          )}
        </div>
      </section>

      {/* TECH SPECS — Standard */}
      <section className="wsec">
        <div className="grid2" style={{ alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 120 }}>
            <Kicker n="05">{T('Fiche technique', 'Tech specs')}</Kicker>
            <h2 className="wt" style={{ marginBottom: 18 }}>DELIPOD {T('Standard', 'Standard')}</h2>
            <Slot label={T('RENDU — DELIPOD 001', 'RENDER — DELIPOD 001')}
            src={IMG_OPEN} style={{ height: 240, marginTop: 8 }} />
          </div>
          <table className="spec">
            <tbody>
              {D.specsStd.map((r, i) => <tr key={i}><td>{P(r)}</td><td>{P(r.v)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      {/* DELIPOD FRESH */}
      <section className="wsec ink">
        <Kicker n="06"><span style={{ color: '#b6b6ad' }}>{T('Gamme', 'Range')}</span></Kicker>
        <div className="grid2" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="wt" style={{ marginBottom: 16 }}>DELIPOD <span style={{ color: 'var(--accent)' }}>Fresh</span></h2>
            <div className="col" style={{ gap: 13 }}>
              {D.fresh.desc.map((p, i) => <p key={i} className="lead" style={{ color: '#c9c9c2', maxWidth: 'none' }}>{P(p)}</p>)}
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: '#9a9a92', marginTop: 18 }}>{P(D.fresh.sectors)}</p>
          </div>
          <div>
            <Slot label={T('RENDU — DELIPOD Fresh', 'RENDER — DELIPOD Fresh')}
            style={{ height: 220, borderColor: '#43443d', background: 'repeating-linear-gradient(45deg,#2a2b27 0 11px,#2f302b 11px 22px)', marginBottom: 18 }} />
            <table className="spec">
              <tbody>
                {D.fresh.specs.map((r, i) =>
                <tr key={i}>
                    <td style={{ color: '#9a9a92' }}>{P(r)}</td>
                    <td style={{ color: '#d6d6cf' }}>{P(r.v)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="wsec">
        <Kicker n="07">{T('Partenaires', 'Partners')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 28, maxWidth: '22ch' }}>
          {T('Un écosystème qui rend DELIPOD opérationnel.', 'An ecosystem that makes DELIPOD operational.')}
        </h2>
        <div className="grid3">
          {D.partners.map((p, i) =>
          <div className="card" key={i} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="slot" style={{ height: 60, width: '100%', background: '#fff', border: '1.5px solid var(--line-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--ui)', fontWeight: 800, letterSpacing: '.04em', fontSize: 18, color: p.n === '…' ? 'var(--line-soft)' : 'var(--ink)', textTransform: 'uppercase' }}>{p.n === '…' ? '+' : p.n}</span>
              </div>
              <div>
                <h3 className="wt" style={{ fontSize: 18, marginBottom: 6 }}>{p.n}</h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', margin: 0 }}>{P(p.r)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="wsec" style={{ textAlign: 'center', background: 'var(--grey-fill-2)' }}>
        <h2 className="wt" style={{ fontSize: 42, maxWidth: '16ch', margin: '0 auto 22px' }}>
          {T('Déployer DELIPOD dans votre ville ?', 'Deploy DELIPOD in your city?')}
        </h2>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Btn primary arrow>{T('Demander une démonstration', 'Request a demo')}</Btn>
          <Btn>{T('Documentation technique', 'Technical documentation')}</Btn>
        </div>
      </section>
      <Footer />
    </div>);

}

/* shared footer */
function Footer() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  return (
    <footer className="wfoot">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mark" onClick={() => window.deliGo('home')} style={{ cursor: 'pointer' }}>DELIPOD</span>
        <div style={{ display: 'flex', gap: 22, fontSize: 13, color: '#9a9a93', fontFamily: 'var(--mono)', flexWrap: 'wrap' }}>
          <span onClick={() => window.deliGo('home')} style={{ fontFamily: "sans-serif", fontSize: "14px", cursor: 'pointer' }}>{T('Accueil', 'Home')}</span><span onClick={() => window.deliGo('about')} style={{ fontFamily: "sans-serif", fontSize: "14px", cursor: 'pointer' }}>{T('À propos', 'About')}</span>
          <span onClick={() => window.deliGo('contact')} style={{ fontFamily: "sans-serif", fontSize: "14px", cursor: 'pointer' }}>{T('Contact', 'Contact')}</span>
          <span onClick={() => window.deliGo('presse')} style={{ fontFamily: "sans-serif", fontSize: "14px", cursor: 'pointer' }}>{T('Presse', 'Press')}</span>
          <span onClick={() => window.deliGo('legal')} style={{ fontFamily: "sans-serif", fontSize: "14px", cursor: 'pointer' }}>{T('Mentions légales', 'Legal notice')}</span>
          <span onClick={() => window.deliGo('cgv')} style={{ fontFamily: "sans-serif", fontSize: "14px", cursor: 'pointer' }}>{T('CGV', 'Terms of sale')}</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#6f6f68' }}>© 2026 Toncarton</span>
      </div>
    </footer>);

}
Object.assign(window, { HomeA, Footer });