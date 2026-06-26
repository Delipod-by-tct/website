/* ============ HOME — Direction B · Technique (Teltonika-like) ============ */
function HomeB() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  const P = (o) => tr(lang, o.fr, o.en);
  const D = window.DELI;

  const anchors = [
  T('Présentation', 'Overview'), T('Pourquoi', 'Why'), T('Fonctionnement', 'How'),
  T('Fonctionnalités', 'Features'), T('Fiche technique', 'Specs'), T('Gamme', 'Range'), T('Partenaires', 'Partners')];
  const secIds = ['sec-ov', 'sec-why', 'sec-how', 'sec-feat', 'sec-specs', 'sec-fresh', 'sec-partners'];
  const [active, setActive] = useState(0);
  const lockRef = React.useRef(false);

  React.useEffect(() => {
    const onScroll = () => {
      if (lockRef.current) return;
      const probe = window.scrollY + 140;
      let current = 0;
      for (let i = 0; i < secIds.length; i++) {
        const el = document.getElementById(secIds[i]);
        if (el && el.offsetTop <= probe) current = i;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i) => {
    setActive(i);
    const el = document.getElementById(secIds[i]);
    if (!el) return;
    lockRef.current = true;
    const target = el.getBoundingClientRect().top + window.scrollY - 104;
    const start = window.scrollY;
    const dist = target - start;
    const dur = 500;
    let t0 = null;
    const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(() => { lockRef.current = false; }, 60);
    };
    requestAnimationFrame(step);
  };


  return (
    <div>
      {/* HERO — split, data-forward */}
      <section className="wsec" style={{ paddingBottom: '46px' }}>
        <div className="grid2" style={{ alignItems: 'center' }}>
          <div className="hero-text">
            <Kicker>DELIPOD · TONCARTON · {T('Logistique urbaine', 'Urban logistics')}</Kicker>
            <h1 className="wt" style={{ fontSize: 'clamp(26px, 5.5vw, 40px)', marginBottom: 18 }}>
              {T('Mini-conteneur urbain intelligent pour le dernier kilomètre',
              'Connected urban mini-container for the last mile')}
            </h1>
            <p className="lead" style={{ marginBottom: 22 }}>
              {T('Structurer, sécuriser et tracer les flux de marchandises en ville dense d’un mode de transport à l’autre.',
              'Structure, secure and track urban goods flows from one transport mode to the next.')}
            </p>
            <div className="row hero-cta" style={{ marginBottom: 24 }}>
              <Btn primary arrow onClick={() => window.deliGo('contact')}>{T('Demander une démo', 'Request a demo')}</Btn>
              <Btn onClick={() => window.deliGo('home', 'sec-feat')}>{T('Fiche technique', 'Spec sheet')}</Btn>
            </div>
            <div className="grid3 hero-stats" style={{ gap: 0, borderTop: '1.5px solid var(--line)' }}>
              {[['2 m³', T('volume utile', 'usable volume')], ['Jusqu’à 250 kg', T('charge utile', 'payload')], ['4G + GPS', T('connecté', 'connected')]].map((s, i) =>
              <div key={i} style={{ borderRight: i < 2 ? '1px dashed var(--line-soft)' : '0', padding: "14px 0px 14px 10px" }}>
                  <div className="wt" style={{ fontWeight: 700, fontSize: "20px" }}>{s[0]}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s[1]}</div>
                </div>
              )}
            </div>
          </div>
          <div className="hero-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 460, overflow: 'hidden' }}>
            <img className="hero-img-el" src={IMG_HERO} alt={T('DELIPOD 001', 'DELIPOD 001')} style={{ width: '100%', maxHeight: 480, objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* sticky in-page nav */}
      <div className="subnav-wrap" style={{ position: 'sticky', top: 54, zIndex: 30, background: '#fff', borderTop: '1.5px solid var(--line)', borderBottom: '1.5px solid var(--line)' }}>
        <div className="subnav-row" style={{ display: 'flex', gap: 4, padding: '0 64px', overflowX: 'auto' }}>
          {anchors.map((a, i) =>
          <button key={i} onClick={() => goTo(i)} style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: '13px 16px', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.04em', display: 'inline-flex', alignItems: 'baseline', gap: 6,
            color: active === i ? 'var(--ink)' : 'var(--muted)', borderBottom: active === i ? '2px solid var(--accent)' : '2px solid transparent', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{'0' + (i + 1)}</span>{a}</button>
          )}
        </div>
      </div>

      {/* OVERVIEW */}
      <section className="wsec" id="sec-ov">
        <h2 className="wt" style={{ marginBottom: 24, maxWidth: 'none', fontSize: "28px" }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>01</span> {T('Là où le camion passe le relais au vélo',
          'Where the truck hands over to the bike')}
        </h2>
        <div className="col" style={{ marginBottom: 30, maxWidth: 'none', lineHeight: "1.5", gap: "0px" }}>
          {D.overview.map((p, i) => <p key={i} className="lead" style={{ maxWidth: 'none', fontSize: 16, textAlign: "justify", margin: "0px 0px 20px" }}>{P(p)}</p>)}
        </div>
        <div className="grid2">
          <Slot label={T('DELIPOD fermé', 'DELIPOD closed')} src={IMG_STREET} dim={T('fermé', 'closed')} style={{ height: 280 }} imgStyle={{ transform: 'scale(1.55)' }} />
          <Slot label={T('DELIPOD ouvert', 'DELIPOD open')} src={IMG_OPEN} dim={T('ouvert', 'open')} style={{ height: 280 }} />
        </div>
      </section>

      {/* WHY — problem table */}
      <section className="wsec fill" id="sec-why">
        <h2 className="wt" style={{ marginBottom: 22, maxWidth: 'none', fontSize: "28px" }}><span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>02</span> {P(D.why.intro)}</h2>
        <div style={{ border: '1.5px solid var(--line)', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
          {D.why.points.map((p, i) =>
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center',
            borderBottom: i < D.why.points.length - 1 ? '1px dashed var(--line-soft)' : '0' }}>
              <div style={{ padding: '16px 18px', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>{'0' + (i + 1)}</div>
              <div style={{ padding: '16px 18px 16px 0', fontSize: 15.5 }}>{P(p)}</div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 18, padding: '16px 20px', borderLeft: '3px solid var(--accent)', background: '#fff', fontSize: 15.5 }}>
          {P(D.why.outro)}
        </div>
      </section>

      {/* HOW — 5-step flow */}
      <section className="wsec" id="sec-how">
        <h2 className="wt" style={{ fontSize: 28, marginBottom: 30 }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>03</span> {T('Flux multimodal', 'Multimodal flow')}
        </h2>
        <div className="grid4">
          {D.how.steps.map((s, i) =>
          <div key={i} style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)', fontSize: 13, marginBottom: 10 }}>{'0' + (i + 1)}</div>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Slot label={P(s.ill)} src={s.src || null} style={{ height: 180 }} imgStyle={{ objectPosition: '72% center' }} />
                {s.tags ?
                <div style={{ position: 'absolute', left: 8, bottom: 8, display: 'flex', gap: 6 }}>
                    {s.tags.map((t) =>
                  <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#fff', background: 'rgba(20,20,18,.82)', borderRadius: 4, padding: '4px 8px' }}>{t}</span>
                  )}
                  </div> : null}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.4, color: '#3f3f3a', margin: 0 }}>{P(s)}</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: 28, borderTop: '1.5px solid var(--line)', paddingTop: 22 }}>
          <p style={{ margin: '0 0 14px', fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {T('Chaque opération génère des événements standardisés', 'Each operation generates standardised events')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
            { fr: 'Dépôt', en: 'Drop-off' }, { fr: 'Retrait', en: 'Pick-up' },
            { fr: 'Ouverture', en: 'Opening' }, { fr: 'Incident', en: 'Incident' },
            { fr: 'Preuve de livraison', en: 'Proof of delivery' }, { fr: 'Données capteurs', en: 'Sensor data' }].
            map((e, i) =>
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid var(--line)', borderRadius: 999, padding: '8px 16px', background: '#fff', fontSize: 14, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                {T(e.fr, e.en)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES / EQUIPMENT — cards with icons (éditorial style) */}
      <section className="wsec fill" id="sec-feat">
        <h2 className="wt" style={{ fontSize: 28, marginBottom: 30, maxWidth: 'none' }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>04</span> {T('Ce que le DELIPOD embarque de série', 'What the DELIPOD carries as standard')}
        </h2>
        <div className="grid4">
          {D.equipment.map((f) =>
          <div className="card" key={f.k} style={{ position: 'relative', borderColor: '#16786a' }}>
              <div className="icon" style={{ marginBottom: 16, border: 'none', color: 'var(--accent)', width: 'auto', height: 'auto', justifyContent: 'flex-start' }}>
                <EquipIcon name={f.k} size={30} />
              </div>
              <h3 className="wt" style={{ fontSize: "17px" }}>{P(f)}</h3>
            </div>
          )}
        </div>

        <div style={{ marginTop: 28, borderTop: '1.5px solid var(--line)', paddingTop: 22 }}>
          <p style={{ margin: '0 0 14px', fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {T('Options & capteurs disponibles', 'Available options & sensors')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {D.options.map((o, i) =>
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid var(--line)', borderRadius: 999, padding: '8px 16px', background: '#fff', fontSize: 14, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                {P(o)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* TECH SPECS — Standard (éditorial : photo gauche, tableau droite) */}
      <section className="wsec" id="sec-specs">
        <h2 className="wt" style={{ marginBottom: 24, fontSize: 28 }}><span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>05</span> DELIPOD <span style={{ color: 'var(--accent)' }}>{T('Standard', 'Standard')}</span></h2>
        <div className="grid2" style={{ alignItems: 'start', gap: '88px' }}>
          <Slot label={T('RENDU — DELIPOD 001', 'RENDER — DELIPOD 001')} src={IMG_OPEN} className="std-photo" style={{ height: 470 }} />
          <div style={{ border: '1.5px solid var(--line)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: '1.5px solid var(--line-soft)', background: 'var(--grey-fill-2)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                {T('Fiche technique — Standard', 'Tech specs — Standard')}
              </span>
            </div>
            <div>
              {D.specsStd.map((r, i) =>
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 12, alignItems: 'baseline',
                padding: '13px 18px', borderBottom: i < D.specsStd.length - 1 ? '1px dashed var(--line-soft)' : '0' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>{P(r)}</span>
                  <span style={{ fontSize: 14.5, color: '#3f3f3a', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{P(r.v)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FRESH — banner + specs */}
      <section className="wsec fill" id="sec-fresh">
        <h2 className="wt" style={{ fontSize: 28, marginBottom: 22 }}><span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>06</span> DELIPOD <span style={{ color: 'var(--accent)' }}>Fresh</span></h2>
        <div className="grid2 fresh-grid" style={{ alignItems: 'start', gap: '88px' }}>
          <div className="fresh-photo" style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1.5px solid var(--line)' }}>
            <Slot label={T('PHOTO — DELIPOD Fresh en entrepôt', 'PHOTO — DELIPOD Fresh in warehouse')} src="assets/fresh-warehouse.jpeg" style={{ height: 470 }} imgStyle={{ objectPosition: '50% 75%' }} />
            <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {D.fresh.sectorsList.map((s, i) =>
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(20,20,18,.82)', color: '#fff', borderRadius: 6, padding: '6px 11px', fontSize: 12.5, fontWeight: 500 }}>
                  <span style={{ display: 'flex', color: '#fff' }}><SectorIcon name={['food', 'medical', 'sensitive'][i]} /></span>
                  {P(s)}
                </span>
              )}
            </div>
          </div>
          <div className="fresh-col" style={{ height: 470, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ border: '1.5px solid var(--line)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                padding: '14px 18px', borderBottom: '1.5px solid var(--line-soft)', background: 'var(--grey-fill-2)' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {T('Fiche technique — Fresh', 'Tech specs — Fresh')}
                </span>
              </div>
              <div>
                {D.fresh.specs.map((r, i) =>
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 12, alignItems: 'baseline',
                  padding: '13px 18px', borderBottom: i < D.fresh.specs.length - 1 ? '1px dashed var(--line-soft)' : '0' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>{P(r)}</span>
                    <span style={{ fontSize: 14.5, color: '#3f3f3a', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{P(r.v)}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              {D.fresh.desc.map((p, i) => <p key={i} style={{ color: '#3f3f3a', fontSize: 14.5, lineHeight: 1.45, textAlign: "justify", margin: i < D.fresh.desc.length - 1 ? "0 0 9px" : 0 }}>{P(p)}</p>)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap',
            border: '1.5px solid var(--line)', borderRadius: 6, background: '#fff', padding: '28px 30px' }}>
            <div style={{ flex: '0 0 auto', width: 46, height: 46, borderRadius: 8, border: '1.5px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6" /><path d="M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
              </svg>
            </div>
            <div style={{ flex: '1 1 280px', minWidth: 240 }}>
              <h3 className="wt" style={{ fontSize: 19, marginBottom: 8 }}>
                {T('Formation & Accompagnement inclus', 'Training & support included')}
              </h3>
              <p className="lead" style={{ color: '#54544e', maxWidth: 'none', fontSize: 15, margin: 0, textAlign: 'justify' }}>
                {T('À chaque acquisition, une formation opérationnelle est incluse pour une prise en main optimale sur le terrain : gestion des plaques eutectiques, plans de chargement, protocoles de nettoyage et manipulation.',
                   'With every purchase, an operational training session is included for optimal field handling: eutectic plate management, loading plans, cleaning and handling protocols.')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="wsec" id="sec-partners">
        <h2 className="wt" style={{ marginBottom: 30, fontSize: "28px" }}><span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>07</span> {T('Partenaires', 'Partners')}</h2>
        <div className="grid4 partners-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {D.partners.map((p, i) =>
          <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ height: 96, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.logo ?
              <img src={p.logo} alt={p.n} style={{ maxWidth: '90%', maxHeight: '96px', objectFit: 'contain' }} /> :
              <span style={{ fontFamily: 'var(--ui)', fontWeight: 800, fontSize: 28, letterSpacing: '.02em', color: 'var(--ink)' }}>{p.n}</span>}
              </div>
              <div className="wt" style={{ fontSize: 16 }}>{p.n}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{P(p.r)}</div>
            </div>
          )}
        </div>
      </section>

      {/* CTA — contact form inline */}
      <section className="wsec" style={{ textAlign: 'center', background: 'var(--grey-fill-2)' }}>
        <h2 className="wt" style={{ width: "100%", maxWidth: "none", margin: '0 auto 22px', fontSize: "28px" }}>
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
Object.assign(window, { HomeB });