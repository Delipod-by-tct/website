/* ============ À PROPOS / ABOUT ============ */
function About() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  const P = (o) => tr(lang, o.fr, o.en);
  const A = window.DELI.about;

  return (
    <div>
      {/* HERO */}
      <section className="wsec" style={{ paddingTop: '70px' }}>
        <Kicker>{T('À propos', 'About')} · DELIPOD · TONCARTON</Kicker>
        <h1 className="wt" style={{ marginBottom: 20, fontSize: 'clamp(26px, 5.5vw, 40px)', width: '100%', maxWidth: 'none' }}>
          {T('Le chaînon manquant du dernier kilomètre',
             'The missing link of the last mile')}
        </h1>
        <p className="lead" style={{ width: '100%', maxWidth: 'none' }}>{P(A.intro)}</p>
      </section>

      {/* WHO WE ARE — Toncarton */}
      <section className="wsec fill">
        <Kicker n="01">{T('Qui sommes-nous', 'Who we are')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 24, fontSize: '28px' }}>{T('La genèse', 'The genesis')}</h2>
        <div className="genese-block" style={{ overflow: 'hidden' }}>
          <Slot label={T('IMAGE — équipe / atelier', 'IMAGE — team / workshop')} src="assets/team.jpg" className="genese-photo"
            style={{ height: 340, width: 480, maxWidth: '50%', float: 'right', marginLeft: 40, marginBottom: 18 }} imgStyle={{ objectFit: 'cover', objectPosition: '0% 50%' }} />
          {A.who.map((p, i) =>
          <p key={i} className="lead" style={{ maxWidth: 'none', margin: '0 0 14px', textAlign: 'justify' }}>{P(p)}</p>
          )}
        </div>
      </section>

      {/* FOUNDERS — human, portraits + bio */}
      <section className="wsec">
        <Kicker n="02">{T('Les fondateurs', 'The founders')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 36, fontSize: '28px', width: '100%', maxWidth: 'none' }}>
          {T('Deux parcours, une même conviction', 'Two journeys, one shared conviction')}
        </h2>
        <div className="grid2" style={{ gap: 40 }}>
          {A.founders.map((f, i) =>
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <Slot label={T('PORTRAIT', 'PORTRAIT')} src={f.img || null}
                  style={{ width: 96, height: 96, flex: '0 0 96px', borderRadius: '50%' }} />
                <div>
                  <h3 className="wt" style={{ fontSize: 22 }}>{f.name}</h3>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {f.bio.map((b, j) =>
                <p key={j} className="lead" style={{ maxWidth: 'none', fontSize: 15.5, margin: 0, textAlign: 'justify' }}>{P(b)}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STORY / TIMELINE — with fabrication photos */}
      <section className="wsec fill">
        <Kicker n="03">{T('Notre histoire', 'Our story')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 18, fontSize: '28px', width: '100%', maxWidth: 'none' }}>
          {T('De l’idée au premier déploiement', 'From idea to first deployment')}
        </h2>
        <p className="lead" style={{ width: '100%', maxWidth: 'none', marginBottom: 40 }}>{P(A.story.intro)}</p>

        {/* horizontal timeline */}
        <div className="timeline">
          {A.story.milestones.map((m, i) =>
          <div key={i} className="tl-step">
              <div className="tl-dot" />
              {i < A.story.milestones.length - 1 ? <div className="tl-bar" /> : null}
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>{P(m.date)}</div>
              <h3 className="wt" style={{ fontSize: 18, marginBottom: 8 }}>{P(m.t)}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: '#54544e', margin: 0 }}>{P(m.d)}</p>
            </div>
          )}
        </div>

        {/* fabrication photos — 3 rows */}
        <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {[
          { label: T('Prototypage', 'Prototyping'),
            shots: [
              { src: 'assets/fab-cad.png', imgStyle: { objectPosition: '50% 70%' } },
              { src: 'assets/proto-slicer.png' },
              { src: 'assets/proto-render.png' }] },
          { label: T('Électronique', 'Electronics'),
            shots: [
              { src: 'assets/elec-pcb.jpeg' },
              { src: 'assets/elec-render.jpeg' },
              { src: 'assets/elec-enclosure.jpeg' }] },
          { label: T('Soudure & assemblage', 'Welding & assembly'),
            shots: [
              { src: IMG_FAB[2] },
              { src: IMG_FAB[1] },
              { src: IMG_FAB[3], imgStyle: { transform: 'scale(1.45)', objectPosition: '74% 26%' } }] },
          { label: T('Tests terrain', 'Field testing'),
            shots: [
              { src: 'assets/test-warehouse.png' },
              { src: 'assets/test-bike-altermund.jpg' },
              { src: 'assets/test-bike-sunny.jpg' }] }].
          map((row, ri) =>
          <div key={ri}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                {'0' + (ri + 1)} · {row.label}
              </div>
              <div className="grid3">
                {row.shots.map((s, si) =>
                <Slot key={si} label={T('PHOTO FABRICATION', 'MANUFACTURING PHOTO')} src={s.src} style={{ height: 210 }} imgStyle={s.imgStyle} />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MISSION — liste en ligne */}
      <section className="wsec">
        <Kicker n="04">{T('Notre mission', 'Our mission')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 30, fontSize: '28px' }}>{P(A.mission.intro)}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {A.mission.points.map((p, i) =>
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline',
            padding: '18px 22px', border: '1.5px solid var(--line)', borderRadius: 6, background: '#fff' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>{'0' + (i + 1)}</span>
              <span style={{ fontSize: 15.5, color: '#3f3f3a' }}>{P(p)}</span>
            </div>
          )}
        </div>
      </section>

      {/* VALUES */}
      <section className="wsec fill">
        <Kicker n="05">{T('Nos valeurs', 'Our values')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 30, fontSize: '28px' }}>
          {T('Six principes guidant chaque décision', 'Six principles guiding every decision')}
        </h2>
        <div className="grid3">
          {A.values.map((v, i) =>
          <div key={i} style={{ border: '1.5px solid #16786a', borderRadius: 4, padding: 24, background: '#fff' }}>
              <div style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{'0' + (i + 1)}</div>
              <h3 className="wt" style={{ fontSize: 21, marginBottom: 10 }}>{P(v.t)}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: '#54544e', margin: 0, textAlign: 'left' }}>{P(v.d)}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
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
    </div>);

}
Object.assign(window, { About });
