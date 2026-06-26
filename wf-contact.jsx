/* ============ CONTACT & PRESSE / CONTACT & PRESS ============ */
function PressIcon({ name }) {
  const c = { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', style: { display: 'block' } };
  if (name === 'kit') {
    return (
      <svg {...c}>
        <path d="M4 4h9l3 3v13H4z" />
        <path d="M13 4v3h3" />
        <path d="M7 11h6M7 14h6M7 17h4" />
      </svg>);
  }
  if (name === 'image') {
    return (
      <svg {...c}>
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="M21 16l-5-5-8 8" />
      </svg>);
  }
  // logo
  return (
    <svg {...c}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.2 2.2 4.8-5" />
    </svg>);
}

function Contact() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data }).
    then(() => setSent(true)).catch(() => setSent(true));
  };

  const Input = ({ l, ph, area, type = 'text', name, required }) =>
  <label className="cfield">
      <span className="cfield-l">{l}</span>
      {area ?
    <textarea className="cinput" rows={5} placeholder={ph} name={name} required={required} /> :
    <input className="cinput" type={type} placeholder={ph} name={name} required={required} />}
    </label>;

  const coords = [
  { l: T('Email', 'Email'), v: 'sales@toncarton.com', ic: 'mail' },
  { l: T('Téléphone', 'Phone'), v: '+33 6 52 28 42 16', ic: 'phone' },
  { l: T('Adresse', 'Address'), v: '9 Rue Anatole de la Forge\n75017 Paris, France', ic: 'pin' }];


  return (
    <div>
      <style>{`
        .cfield{ display:flex; flex-direction:column; gap:8px; }
        .cfield-l{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
        .cinput{
          font-family:var(--ui); font-size:15px; color:var(--ink);
          background:#fff; border:1.5px solid var(--line-soft); border-radius:10px;
          padding:14px 16px; outline:none; transition:border-color .15s, box-shadow .15s; resize:vertical; width:100%;
        }
        .cinput::placeholder{ color:#b4b4ad; }
        .cinput:focus{ border-color:var(--accent); box-shadow:0 0 0 4px color-mix(in oklab, var(--accent) 16%, transparent); }
        .cinfo-row{ display:flex; gap:16px; align-items:flex-start; padding:18px 0; border-bottom:1px solid rgba(255,255,255,.1); }
        .cinfo-row:last-child{ border-bottom:0; }
        .cinfo-ic{ width:38px; height:38px; flex:0 0 auto; border:1.5px solid rgba(255,255,255,.22); border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; }
      `}</style>

      {/* HERO */}
      <section className="wsec" style={{ paddingTop: '70px', paddingBottom: '40px' }}>
        <Kicker>{T('Contact', 'Contact')}</Kicker>
        <h1 className="wt" style={{ marginBottom: 16, fontSize: "clamp(26px, 5.5vw, 40px)" }}>
          {T('Parlons de votre projet', 'Let’s talk about your project')}
        </h1>
        <p className="lead" style={{ maxWidth: '52ch' }}>
          {T('Une démonstration, un partenariat, une question ? Écrivez-nous, nous revenons vers vous rapidement.',
          'A demo, a partnership, a question? Write to us — we’ll get back to you quickly.')}
        </p>
      </section>

      {/* CONTACT — modern form | dark info panel + map */}
      <section className="wsec" style={{ paddingTop: '20px' }}>
        <div className="grid2" style={{ alignItems: 'stretch', gap: 28 }}>

          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="card" style={{ padding: 34, display: 'flex', flexDirection: 'column', gap: 18, borderRadius: 14 }}>
            <input type="hidden" name="form-name" value="contact" />
            <p hidden><label>Bot field<input name="bot-field" /></label></p>
            <h3 className="wt" style={{ fontSize: 22, marginBottom: 2 }}>{T('Nous écrire', 'Get in touch')}</h3>
            {sent ?
            <div style={{ padding: '28px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 10, color: 'var(--accent)' }}>✓</div>
                <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>{T('Message envoyé, merci !', 'Message sent, thank you!')}</p>
                <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>{T('Nous revenons vers vous sous 24 heures.', 'We’ll get back to you within 24 hours.')}</p>
              </div> :
            <React.Fragment>
            <div className="grid2" style={{ gap: 18 }}>
              <Input l={T('Nom', 'Name')} ph={T('Votre nom', 'Your name')} name="name" required />
              <Input l={T('Société', 'Company')} ph={T('Votre société', 'Your company')} name="company" />
            </div>
            <Input l="Email" ph="vous@société.com" type="email" name="email" required />
            <Input l={T('Sujet', 'Subject')} ph={T('Démo, partenariat, presse…', 'Demo, partnership, press…')} name="subject" />
            <Input l={T('Message', 'Message')} ph={T('Décrivez votre besoin…', 'Describe your need…')} area name="message" required />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--muted)' }}>
                {T('Réponse sous 24 heures', 'Reply within 24 hours')}
              </span>
              <button type="submit" className="wbtn primary" style={{ fontSize: '15px', border: 0, cursor: 'pointer' }}>{T('Envoyer le message', 'Send message')}<span className="arr">→</span></button>
            </div>
            </React.Fragment>}
          </form>

          <div className="col" style={{ gap: 22 }}>
            <div style={{ background: 'var(--ink)', color: '#f1f1ec', borderRadius: 14, padding: 32 }}>
              <h3 className="wt" style={{ fontSize: 22, marginBottom: 14, color: '#fff' }}>{T('Nous joindre', 'Reach us')}</h3>
              <div>
                {coords.map((c, i) =>
                <div key={i} className="cinfo-row">
                    <span className="cinfo-ic"><InfoIcon name={c.ic} /></span>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9a9a92', marginBottom: 4 }}>{c.l}</div>
                      <div style={{ fontSize: 15.5, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{c.v}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--line)', flex: '1 1 auto', minHeight: 240, background: '#e7e5e1' }}>
              <div style={{ position: 'absolute', inset: 0 }}><StylizedMap /></div>
              <iframe title="map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=9%20Rue%20Anatole%20de%20la%20Forge%2075017%20Paris&output=embed"
                style={{ position: 'relative', width: '100%', height: '100%', minHeight: 240, border: 0, display: 'block', filter: 'grayscale(1) contrast(1.05)' }} />
              <div style={{ position: 'absolute', left: 16, bottom: 14, background: 'rgba(255,255,255,.93)', borderRadius: 8, padding: '8px 12px', boxShadow: '0 2px 10px rgba(0,0,0,.14)', pointerEvents: 'none' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>{T('Paris 17e', 'Paris 17th')}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>9 Rue Anatole de la Forge</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>);

}

/* ============ PRESSE ============ */
function Presse() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);

  return (
    <div>
      {/* HERO */}
      <section className="wsec" style={{ paddingTop: '70px', paddingBottom: '20px' }}>
        <Kicker>{T('Presse', 'Press')}</Kicker>
        <h1 className="wt" style={{ marginBottom: 16, fontSize: "clamp(26px, 5.5vw, 40px)" }}>
          {T('Espace presse', 'Press room')}
        </h1>
        <p className="lead" style={{ maxWidth: '56ch' }}>
          {T('Tout le nécessaire pour parler de DELIPOD.',
          'Everything you need to write about DELIPOD.')}
        </p>
      </section>

      {/* RESOURCES */}
      <section className="wsec" style={{ paddingTop: '24px' }}>
        <Kicker n="01">{T('Ressources', 'Resources')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 8, fontSize: 28 }}>{T('Kit média', 'Media kit')}</h2>
        <p className="lead" style={{ marginBottom: 30, width: "100%", maxWidth: "none" }}>
          {T('Kit presse, images haute définition et logos disponibles au téléchargement.',
          'Press kit, high-definition images and logos available to download.')}
        </p>
        <div className="grid3">
          {[
          { t: T('Kit presse', 'Press kit'), s: T('Dossier Drive', 'Drive folder'), ic: 'kit', href: 'https://drive.google.com/drive/folders/1sPnTrVylRg2yNRX-_w3CvYpCZIlF3XGB?usp=drive_link' },
          { t: T('Visuels HD', 'HD visuals'), s: T('Dossier Drive', 'Drive folder'), ic: 'image', href: 'https://drive.google.com/drive/folders/1Ki0cE0fF2VBciyBsIi9O3QaLXJ0PAO3z?usp=drive_link' },
          { t: T('Logos', 'Logos'), s: T('Dossier Drive', 'Drive folder'), ic: 'logo', href: 'https://drive.google.com/drive/folders/1knSjrRmMABft2ruEzYFzSq0aa62sLIs3?usp=drive_link' }].
          map((d, i) =>
          <a key={i} className="card" href={d.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 14, borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
              <div className="slot" style={{ height: 72, width: '100%', borderRadius: 8, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: 28 }}>
                <PressIcon name={d.ic} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="wt" style={{ fontSize: 17, marginBottom: 4 }}>{d.t}</h3>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{d.s}</span>
                </div>
                <span style={{ width: 36, height: 36, borderRadius: 9, border: '1.5px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700 }}>↓</span>
              </div>
            </a>
          )}
        </div>
      </section>

      {/* MEDIA CONTACT */}
      <section className="wsec fill">
        <Kicker n="02">{T('Contact média', 'Media contact')}</Kicker>
        <h2 className="wt" style={{ marginBottom: 8, fontSize: 28 }}>{T('Une demande presse ?', 'A press enquiry?')}</h2>
        <p className="lead" style={{ marginBottom: 24, width: "100%", maxWidth: "none" }}>
          {T('Pour toute sollicitation média, interview ou information complémentaire, écrivez-nous.',
          'For any media request, interview or further information, get in touch.')}
        </p>
        <Btn primary arrow onClick={() => window.deliGo('contact')}>{T('Nous contacter', 'Contact us')}</Btn>
      </section>

      <Footer />
    </div>);

}

/* ============ MENTIONS LÉGALES ============ */
function MentionsLegales() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);

  const Block = ({ n, title, children }) =>
  <div style={{ marginBottom: 30 }}>
      <h2 className="wt" style={{ fontSize: 20, marginBottom: 10 }}><span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 13, marginRight: 10 }}>{n}</span>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.6, color: '#54544e', width: '100%', maxWidth: 'none', textAlign: 'justify' }}>{children}</div>
    </div>;

  return (
    <div>
      <section className="wsec" style={{ paddingTop: '70px' }}>
        <Kicker>{T('Mentions légales', 'Legal notice')}</Kicker>
        <h1 className="wt" style={{ marginBottom: 28, fontSize: "36px" }}>
          {T('Mentions légales', 'Legal notice')}
        </h1>

        <Block n="01" title={T('Éditeur du site', 'Site publisher')}>
          {T('Ce site est édité par Toncarton, éditeur de la solution DELIPOD.', 'This site is published by Toncarton, publisher of the DELIPOD solution.')}<br />
          TONCARTON SAS — {T('société par actions simplifiée au capital de 10 000 €', 'simplified joint-stock company with capital of €10,000')}<br />
          {T('Immatriculée au RCS de Paris sous le numéro 840 768 774', 'Registered with the Paris Trade Register under number 840 768 774')}<br />
          {T('Siège social', 'Registered office')} : 9 rue Anatole de La Forge, 75017 Paris, France<br />
          {T('Numéro de TVA intracommunautaire', 'Intra-EU VAT number')} : FR08840768774<br />
          {T('Directeur de la publication', 'Publication director')} : Chakib Chadda, {T('Président de Toncarton', 'President of Toncarton')}<br />
          Contact : hello@toncarton.com
        </Block>
        <Block n="02" title={T('Hébergement', 'Hosting')}>
          {T('Ce site est hébergé par :', 'This site is hosted by:')}<br />
          Netlify, Inc.<br />
          512 2nd Street, Suite 200, San Francisco, CA 94107, {T('États-Unis', 'United States')}<br />
          www.netlify.com
        </Block>
        <Block n="03" title={T('Propriété intellectuelle', 'Intellectual property')}>
          {T('L’ensemble des contenus présents sur ce site (textes, visuels, logos, marques, photographies, illustrations) est la propriété de Toncarton, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, est soumise à autorisation préalable écrite de Toncarton.',
          'All content on this site (texts, visuals, logos, trademarks, photographs, illustrations) is the property of Toncarton unless otherwise stated. Any reproduction, representation, modification or exploitation, in whole or in part, is subject to Toncarton’s prior written authorisation.')}
        </Block>
        <Block n="04" title={T('Données personnelles', 'Personal data')}>
          {T('Les informations recueillies via les formulaires de contact ou de demande de démonstration sont utilisées uniquement pour répondre à vos demandes et, le cas échéant, pour vous adresser des informations relatives aux produits et services DELIPOD.',
          'Information collected via the contact or demo-request forms is used solely to answer your requests and, where relevant, to send you information about DELIPOD products and services.')}<br /><br />
          {T('Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, d’opposition et de suppression de vos données personnelles.',
          'Under the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have the right to access, rectify, object to and delete your personal data.')}<br /><br />
          {T('Pour exercer ces droits, vous pouvez nous contacter à l’adresse suivante :', 'To exercise these rights, you can contact us at:')} hello@toncarton.com<br /><br />
          {T('Les données collectées sont conservées pendant une durée maximale de trois ans à compter du dernier contact.',
          'Collected data is kept for a maximum of three years from the last contact.')}
        </Block>
        <Block n="05" title={T('Cookies', 'Cookies')}>
          {T('Ce site est susceptible d’utiliser des cookies de mesure d’audience et de fonctionnement. Ces cookies ne collectent aucune donnée personnelle identifiable sans votre consentement.',
          'This site may use audience-measurement and functional cookies. These cookies do not collect any identifiable personal data without your consent.')}
        </Block>
        <Block n="06" title={T('Responsabilité', 'Liability')}>
          {T('Toncarton s’efforce d’assurer l’exactitude et la mise à jour des informations diffusées sur ce site. Toncarton ne saurait être tenu responsable des erreurs ou omissions, ni des dommages directs ou indirects résultant de l’utilisation de ce site ou de sites tiers vers lesquels il renvoie.',
          'Toncarton strives to ensure the accuracy and currency of the information published on this site. Toncarton cannot be held liable for errors or omissions, nor for direct or indirect damage resulting from the use of this site or of third-party sites it links to.')}
        </Block>
      </section>
      <Footer />
    </div>);

}

/* ============ CONDITIONS GÉNÉRALES DE VENTE ============ */
function CGV() {
  const { lang } = useWF();
  const T = (fr, en) => tr(lang, fr, en);

  const Block = ({ n, title, children }) =>
  <div style={{ marginBottom: 30 }}>
      <h2 className="wt" style={{ fontSize: 19, marginBottom: 10 }}><span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 13, marginRight: 10 }}>{n}</span>{title}</h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#54544e', width: '100%', maxWidth: 'none', textAlign: 'justify' }}>{children}</div>
    </div>;

  const List = ({ items }) =>
  <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
      {items.map((it, i) => <li key={i} style={{ marginBottom: 4 }}>{it}</li>)}
    </ul>;

  return (
    <div>
      <section className="wsec" style={{ paddingTop: '70px' }}>
        <Kicker>{T('Conditions générales de vente', 'Terms of sale')}</Kicker>
        <h1 className="wt" style={{ marginBottom: 12, fontSize: "36px" }}>
          {T('Conditions générales de vente DELIPOD', 'DELIPOD terms of sale')}
        </h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 28 }}>
          {T('Version en vigueur au 29 juin 2026', 'Version in force on 29 June 2026')}
        </p>

        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#54544e', width: '100%', maxWidth: 'none', marginBottom: 36, textAlign: 'justify' }}>
          {T('Les présentes Conditions générales de vente s’appliquent aux produits et services DELIPOD commercialisés par TONCARTON, société par actions simplifiée au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 840 768 774, dont le siège social est situé au 9 rue Anatole de La Forge, 75017 Paris.',
          'These terms of sale apply to the DELIPOD products and services marketed by TONCARTON, a simplified joint-stock company with capital of €10,000, registered with the Paris Trade Register under number 840 768 774, with registered office at 9 rue Anatole de La Forge, 75017 Paris.')}<br />
          Contact : hello@toncarton.com<br />
          {T('DELIPOD est une solution actuellement développée et commercialisée par TONCARTON.', 'DELIPOD is a solution currently developed and marketed by TONCARTON.')}
        </div>

        <Block n="01" title={T('Champ d’application', 'Scope')}>
          {T('Les présentes conditions s’appliquent exclusivement aux ventes et prestations conclues avec des clients professionnels. Toute commande implique l’acceptation sans réserve des présentes Conditions générales de vente, sauf conditions particulières expressément acceptées par écrit par TONCARTON.',
          'These terms apply exclusively to sales and services concluded with professional clients. Any order implies unreserved acceptance of these terms, except for specific conditions expressly accepted in writing by TONCARTON.')}
        </Block>
        <Block n="02" title={T('Produits et services', 'Products and services')}>
          {T('L’offre DELIPOD comprend notamment :', 'The DELIPOD offer notably includes:')}
          <List items={[
            T('la vente des équipements DELIPOD ;', 'the sale of DELIPOD equipment;'),
            T('la vente de composants, accessoires et options ;', 'the sale of components, accessories and options;'),
            T('les équipements électroniques, télématiques et IoT associés ;', 'the associated electronic, telematics and IoT equipment;'),
            T('l’accès aux logiciels et interfaces DELIPOD sous forme d’abonnement ;', 'access to DELIPOD software and interfaces on a subscription basis;'),
            T('les prestations de connectivité, paramétrage, intégration, formation, support et maintenance prévues au devis.', 'connectivity, configuration, integration, training, support and maintenance services set out in the quote.')]} />
          <br />
          {T('Les caractéristiques exactes des produits et services commandés sont précisées dans le devis ou le bon de commande. Les photographies, illustrations, schémas et présentations disponibles sur le site ont une valeur indicative et ne constituent pas un engagement contractuel.',
          'The exact characteristics of the products and services ordered are specified in the quote or purchase order. The photographs, illustrations, diagrams and presentations on the site are indicative and do not constitute a contractual commitment.')}
        </Block>
        <Block n="03" title={T('Devis et commandes', 'Quotes and orders')}>
          {T('Toute commande fait l’objet d’un devis ou d’un bon de commande précisant les produits, options, services, prix et conditions particulières applicables. Sauf mention contraire, les devis sont valables pendant trente jours à compter de leur date d’émission.',
          'Each order is subject to a quote or purchase order specifying products, options, services, prices and applicable specific conditions. Unless stated otherwise, quotes are valid for thirty days from their issue date.')}<br /><br />
          {T('La commande devient ferme après signature du devis ou du bon de commande, acceptation des présentes CGV et règlement de l’acompte prévu. Toute modification du périmètre après validation pourra entraîner une facturation complémentaire et une modification des délais.',
          'The order becomes firm after signature of the quote or purchase order, acceptance of these terms and payment of the agreed deposit. Any change of scope after validation may lead to additional invoicing and a change of deadlines.')}
        </Block>
        <Block n="04" title={T('Prix', 'Prices')}>
          {T('Les prix sont exprimés en euros hors taxes. Sauf mention contraire dans le devis, ne sont pas compris dans le prix du matériel : la livraison, l’installation, la formation, la maintenance, la connectivité, les abonnements logiciels, les intégrations API ou EDI, les développements spécifiques, les déplacements et interventions sur site.',
          'Prices are expressed in euros excluding tax. Unless stated otherwise in the quote, the equipment price does not include: delivery, installation, training, maintenance, connectivity, software subscriptions, API or EDI integrations, specific developments, travel and on-site interventions.')}<br /><br />
          {T('Les options, accessoires et prestations complémentaires sont facturés selon le devis accepté par le client.',
          'Options, accessories and additional services are invoiced according to the quote accepted by the client.')}
        </Block>
        <Block n="05" title={T('Paiement', 'Payment')}>
          {T('Sauf conditions particulières précisées au devis, le paiement du matériel s’effectue comme suit : 50 % d’acompte à la commande ; 50 % à la livraison. Les abonnements logiciels, services de connectivité, maintenance et support sont facturés selon la périodicité indiquée dans le devis ou le contrat.',
          'Unless otherwise specified in the quote, equipment is paid as follows: 50% deposit on order; 50% on delivery. Software subscriptions, connectivity, maintenance and support services are invoiced according to the frequency stated in the quote or contract.')}<br /><br />
          {T('En cas de retard de paiement, des pénalités seront exigibles de plein droit dès le lendemain de la date d’échéance, sur la base d’un taux égal à trois fois le taux d’intérêt légal. Une indemnité forfaitaire de 40 € pour frais de recouvrement sera également due pour chaque facture payée en retard. TONCARTON pourra suspendre toute livraison, activation, connectivité, maintenance ou accès logiciel en cas de défaut de paiement.',
          'In the event of late payment, penalties are payable by right from the day after the due date, at a rate equal to three times the legal interest rate. A fixed recovery indemnity of €40 is also due for each late-paid invoice. TONCARTON may suspend any delivery, activation, connectivity, maintenance or software access in the event of non-payment.')}
        </Block>
        <Block n="06" title={T('Livraison et réception', 'Delivery and receipt')}>
          {T('Les délais de livraison sont donnés à titre indicatif, sauf engagement exprès figurant au devis. Le client doit vérifier l’état et la quantité des produits lors de leur réception. Toute anomalie apparente doit être mentionnée sur le bon de livraison et signalée par écrit à TONCARTON dans un délai de quarante-huit heures. Le transfert des risques intervient au moment de la livraison ou de la mise à disposition du matériel.',
          'Delivery times are indicative unless expressly committed to in the quote. The client must check the condition and quantity of the products on receipt. Any visible anomaly must be noted on the delivery slip and reported in writing to TONCARTON within forty-eight hours. Transfer of risk occurs upon delivery or provision of the equipment.')}
        </Block>
        <Block n="07" title={T('Réserve de propriété', 'Retention of title')}>
          {T('TONCARTON conserve la propriété du matériel vendu jusqu’au paiement complet de l’ensemble des sommes dues. Jusqu’au paiement intégral, le client ne peut ni revendre, ni céder, ni donner en garantie, ni modifier substantiellement le matériel sans l’accord écrit de TONCARTON.',
          'TONCARTON retains ownership of the equipment sold until full payment of all sums due. Until full payment, the client may not resell, transfer, pledge or substantially modify the equipment without TONCARTON’s written agreement.')}
        </Block>
        <Block n="08" title={T('Abonnements logiciels', 'Software subscriptions')}>
          {T('Les logiciels DELIPOD sont fournis sous la forme d’un droit d’utilisation personnel, non exclusif, non cessible et limité à la durée de l’abonnement. Les abonnements sont conclus pour une durée initiale de douze mois, renouvelés par périodes successives de douze mois, sauf dénonciation par l’une des parties au moins trois mois avant l’échéance.',
          'DELIPOD software is provided as a personal, non-exclusive, non-transferable right of use limited to the subscription term. Subscriptions run for an initial twelve-month term, renewed for successive twelve-month periods unless terminated by either party at least three months before expiry.')}<br /><br />
          {T('La résiliation de l’abonnement logiciel n’entraîne pas la reprise ni le remboursement du matériel acheté. TONCARTON peut suspendre les accès en cas de non-paiement, d’usage frauduleux, de risque de sécurité ou de non-respect des présentes CGV.',
          'Termination of the software subscription does not entail the return or refund of purchased equipment. TONCARTON may suspend access in the event of non-payment, fraudulent use, security risk or breach of these terms.')}
        </Block>
        <Block n="09" title={T('Garantie du matériel', 'Equipment warranty')}>
          {T('Le matériel DELIPOD bénéficie d’une garantie contractuelle de deux ans à compter de sa livraison, couvrant les pièces présentant un défaut de fabrication imputable à TONCARTON. La garantie comprend uniquement la fourniture ou le remplacement des pièces reconnues défectueuses ; la main-d’œuvre, les déplacements et frais d’intervention ne sont pas inclus, sauf mention contraire.',
          'DELIPOD equipment carries a two-year contractual warranty from delivery, covering parts with a manufacturing defect attributable to TONCARTON. The warranty covers only the supply or replacement of parts found to be defective; labour, travel and intervention costs are not included unless stated otherwise.')}<br /><br />
          {T('La garantie ne couvre pas : l’usure normale, les consommables, les chocs, accidents ou collisions, la surcharge, le vol ou le vandalisme, les dégradations volontaires ou accidentelles, le défaut d’entretien, le stockage inadapté, le non-respect des notices ou formations, les modifications ou réparations non autorisées, les dommages causés par les marchandises transportées, et les pannes provenant d’un équipement ou service tiers. La présente garantie ne prive pas le client des garanties légales applicables.',
          'The warranty does not cover: normal wear, consumables, impacts, accidents or collisions, overloading, theft or vandalism, intentional or accidental damage, lack of maintenance, unsuitable storage, failure to follow manuals or training, unauthorised modifications or repairs, damage caused by the transported goods, and failures from third-party equipment or services. This warranty does not deprive the client of applicable legal guarantees.')}
        </Block>
        <Block n="10" title={T('Utilisation et entretien', 'Use and maintenance')}>
          {T('Le client est responsable de l’utilisation, de la surveillance, de la sécurité, du stockage et de l’entretien courant du matériel. Il s’engage à respecter les notices fournies, les limites de charge, les conditions de stockage, les règles de sécurité, les procédures de chargement, de fermeture et de mise en service, ainsi que les réglementations applicables. Toute utilisation non conforme peut entraîner l’exclusion de la garantie.',
          'The client is responsible for the use, monitoring, safety, storage and routine maintenance of the equipment. They undertake to comply with the manuals provided, load limits, storage conditions, safety rules, loading, closing and commissioning procedures, and applicable regulations. Any non-compliant use may void the warranty.')}
        </Block>
        <Block n="11" title={T('Dispositions propres à DELIPOD Fresh', 'Provisions specific to DELIPOD Fresh')}>
          {T('Lors de l’achat d’un DELIPOD Fresh, une formation des équipes est prévue afin de présenter les conditions de bon fonctionnement, d’entretien, de stockage et de mise en œuvre. DELIPOD Fresh est un outil logistique et de suivi ; il ne dispense pas le client de vérifier la compatibilité du dispositif avec la nature des marchandises, les températures requises, la durée de transport et les obligations réglementaires.',
          'When purchasing a DELIPOD Fresh, team training is provided to present the conditions for proper operation, maintenance, storage and implementation. DELIPOD Fresh is a logistics and tracking tool; it does not exempt the client from checking the device’s compatibility with the nature of the goods, required temperatures, transport duration and regulatory obligations.')}<br /><br />
          {T('Le client demeure seul responsable du conditionnement et du chargement des marchandises, de l’utilisation des plaques ou dispositifs de froid, du préconditionnement, du respect des températures, de la surveillance des alertes, des contrôles avant/pendant/après utilisation, du respect de la chaîne du froid, de l’entretien et du stockage, ainsi que des marchandises transportées et de leur assurance. Les capteurs, alertes et données de température constituent des outils d’information et ne garantissent pas de façon absolue la conservation des marchandises. Sauf faute directement imputable à TONCARTON, celle-ci ne pourra être tenue responsable de la perte, altération, destruction, contamination ou dépréciation des marchandises.',
          'The client remains solely responsible for packaging and loading the goods, using the cold plates or devices, pre-conditioning, temperature compliance, alert monitoring, checks before/during/after use, cold-chain compliance, maintenance and storage, and the transported goods and their insurance. Sensors, alerts and temperature data are information tools and do not absolutely guarantee preservation of the goods. Except for fault directly attributable to TONCARTON, it cannot be held liable for the loss, alteration, destruction, contamination or depreciation of the goods.')}
        </Block>
        <Block n="12" title={T('Connectivité et services tiers', 'Connectivity and third-party services')}>
          {T('Certaines fonctionnalités reposent sur des services tiers (réseaux mobiles, cartes SIM, géolocalisation, hébergeurs, opérateurs télécoms, API ou logiciels externes). TONCARTON ne garantit pas une disponibilité permanente et sans interruption de ces services et ne pourra être tenue responsable d’une interruption, perte de signal ou indisponibilité provenant d’un opérateur, d’une zone non couverte, d’un service tiers ou d’un événement extérieur à son contrôle.',
          'Some features rely on third-party services (mobile networks, SIM cards, geolocation, hosts, telecom operators, external APIs or software). TONCARTON does not guarantee permanent, uninterrupted availability of these services and cannot be held liable for any interruption, signal loss or unavailability from an operator, an uncovered area, a third-party service or an event beyond its control.')}
        </Block>
        <Block n="13" title={T('Données', 'Data')}>
          {T('Les équipements et logiciels DELIPOD peuvent collecter des données opérationnelles (géolocalisation, température, ouvertures, fermetures, alertes, statuts, preuves de livraison). Ces données servent au fonctionnement, à la traçabilité, à la sécurité, au support, à la maintenance et à l’amélioration des services. Le client reste responsable des données qu’il introduit ou traite dans les logiciels DELIPOD ainsi que du respect de ses propres obligations envers ses salariés, clients, destinataires et partenaires.',
          'DELIPOD equipment and software may collect operational data (geolocation, temperature, openings, closings, alerts, statuses, proofs of delivery). This data is used for operation, traceability, security, support, maintenance and service improvement. The client remains responsible for the data they enter or process in DELIPOD software and for meeting their own obligations towards employees, clients, recipients and partners.')}
        </Block>
        <Block n="14" title={T('Responsabilité', 'Liability')}>
          {T('TONCARTON est tenue d’une obligation de moyens. Sa responsabilité ne pourra être engagée qu’en cas de dommage direct, certain et démontré résultant d’un manquement qui lui est directement imputable. Elle ne pourra notamment être tenue responsable des pertes de marchandises, d’exploitation, de chiffre d’affaires ou de marge, des pénalités supportées par le client, des pertes de données, des dommages indirects, des conséquences d’une mauvaise utilisation, d’un défaut d’entretien ou de surveillance, ou d’une interruption provenant d’un service tiers.',
          'TONCARTON has an obligation of means. Its liability can only be engaged for direct, certain and demonstrated damage resulting from a breach directly attributable to it. It cannot, in particular, be held liable for loss of goods, business, revenue or margin, penalties borne by the client, data loss, indirect damage, the consequences of misuse, lack of maintenance or monitoring, or an interruption from a third-party service.')}<br /><br />
          {T('Sous réserve des responsabilités qui ne peuvent légalement être limitées, la responsabilité totale de TONCARTON est plafonnée au montant hors taxes payé par le client au titre du produit ou du service directement concerné par le dommage.',
          'Subject to liabilities that cannot legally be limited, TONCARTON’s total liability is capped at the pre-tax amount paid by the client for the product or service directly concerned by the damage.')}
        </Block>
        <Block n="15" title={T('Propriété intellectuelle', 'Intellectual property')}>
          {T('La marque DELIPOD, les designs, logiciels, interfaces, plans, documentations, composants, procédés, bases de données et savoir-faire restent la propriété exclusive de TONCARTON et de DELIPOD, ou de leurs titulaires respectifs. L’achat du matériel ou la souscription d’un abonnement n’emporte aucun transfert de propriété intellectuelle. Toute copie, reproduction, décompilation, ingénierie inverse, modification ou exploitation non autorisée est interdite.',
          'The DELIPOD brand, designs, software, interfaces, plans, documentation, components, processes, databases and know-how remain the exclusive property of TONCARTON and DELIPOD, or their respective holders. Purchasing equipment or subscribing does not transfer any intellectual property. Any unauthorised copying, reproduction, decompilation, reverse engineering, modification or exploitation is prohibited.')}
        </Block>
        <Block n="16" title={T('Suspension et résiliation', 'Suspension and termination')}>
          {T('En cas de manquement du client à ses obligations, TONCARTON pourra suspendre les services concernés. Lorsque le manquement n’est pas régularisé dans les quinze jours suivant une notification écrite, TONCARTON pourra résilier le contrat ou l’abonnement, sans préjudice des sommes restant dues.',
          'If the client fails to meet its obligations, TONCARTON may suspend the services concerned. If the breach is not remedied within fifteen days of written notice, TONCARTON may terminate the contract or subscription, without prejudice to sums still due.')}
        </Block>
        <Block n="17" title={T('Force majeure', 'Force majeure')}>
          {T('Aucune partie ne pourra être tenue responsable d’un retard ou d’une inexécution résultant d’un événement échappant raisonnablement à son contrôle : catastrophe naturelle, incendie, conflit, grève, rupture d’approvisionnement, cyberattaque, panne de réseau, décision administrative ou événement similaire.',
          'Neither party can be held liable for a delay or non-performance resulting from an event reasonably beyond its control: natural disaster, fire, conflict, strike, supply disruption, cyberattack, network failure, administrative decision or similar event.')}
        </Block>
        <Block n="18" title={T('Droit applicable et litiges', 'Governing law and disputes')}>
          {T('Les présentes CGV sont soumises au droit français. En cas de difficulté, les parties rechercheront d’abord une solution amiable. À défaut d’accord, tout litige relèvera de la compétence exclusive des tribunaux compétents de Paris, y compris en cas de pluralité de défendeurs, d’appel en garantie ou de procédure d’urgence.',
          'These terms are governed by French law. In the event of difficulty, the parties will first seek an amicable solution. Failing agreement, any dispute falls under the exclusive jurisdiction of the competent courts of Paris, including in cases of multiple defendants, third-party claims or emergency proceedings.')}
        </Block>
        <Block n="19" title={T('Acceptation', 'Acceptance')}>
          {T('La signature d’un devis, le règlement d’un acompte, la réception du matériel ou l’utilisation d’un service DELIPOD implique l’acceptation pleine et entière des présentes Conditions générales de vente.',
          'Signing a quote, paying a deposit, receiving the equipment or using a DELIPOD service implies full and complete acceptance of these terms of sale.')}
        </Block>
      </section>
      <Footer />
    </div>);

}

/* small inline icons for contact */
function InfoIcon({ name, size = 18 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const p = {
    mail: <g><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></g>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l2 4v4a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1Z" />,
    pin: <g><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></g>
  };
  return <svg {...c}>{p[name]}</svg>;
}

/* stylized B&W map — Étoile / Paris 17e (radiating avenues) */
function StylizedMap() {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="260" fill="#e7e5e1" />
      {/* blocks */}
      <g fill="#dcdad5">
        <rect x="20" y="18" width="78" height="52" rx="3" /><rect x="112" y="10" width="70" height="44" rx="3" />
        <rect x="300" y="20" width="84" height="60" rx="3" /><rect x="24" y="120" width="66" height="58" rx="3" />
        <rect x="20" y="196" width="80" height="50" rx="3" /><rect x="300" y="180" width="84" height="64" rx="3" />
        <rect x="320" y="100" width="64" height="56" rx="3" />
      </g>
      {/* radiating avenues from the étoile */}
      <g stroke="#c4c1ba" strokeWidth="7" fill="none" strokeLinecap="round">
        <line x1="200" y1="130" x2="40" y2="40" /><line x1="200" y1="130" x2="200" y2="-10" />
        <line x1="200" y1="130" x2="370" y2="40" /><line x1="200" y1="130" x2="400" y2="130" />
        <line x1="200" y1="130" x2="360" y2="240" /><line x1="200" y1="130" x2="200" y2="280" />
        <line x1="200" y1="130" x2="40" y2="240" /><line x1="200" y1="130" x2="0" y2="130" />
      </g>
      {/* secondary streets */}
      <g stroke="#d4d1cb" strokeWidth="3.5" fill="none">
        <line x1="0" y1="92" x2="400" y2="92" /><line x1="0" y1="186" x2="400" y2="186" />
        <line x1="108" y1="0" x2="108" y2="260" /><line x1="292" y1="0" x2="292" y2="260" />
      </g>
      {/* roundabout */}
      <circle cx="200" cy="130" r="30" fill="none" stroke="#bdbab3" strokeWidth="7" />
      <circle cx="200" cy="130" r="14" fill="#dcdad5" />
      {/* marker */}
      <g transform="translate(248,86)">
        <path d="M0 0c-9 0-16 7-16 16 0 11 16 26 16 26s16-15 16-26c0-9-7-16-16-16Z" fill="var(--accent)" />
        <circle cx="0" cy="16" r="6" fill="#fff" />
      </g>
    </svg>);

}
Object.assign(window, { Contact, Presse, MentionsLegales, CGV, InfoIcon, StylizedMap });