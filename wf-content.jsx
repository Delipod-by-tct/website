/* ============ DELIPOD — contenu réel partagé (FR / EN) ============ */
/* {fr,en} pairs — composants : const P = o => tr(lang, o.fr, o.en)  */
window.DELI = {

  hero: {
    title:   { fr:'Le premier mini-conteneur urbain connecté.', en:'The first connected urban mini-container.' },
    sub:     { fr:'Pensé pour le dernier kilomètre.', en:'Built for the last mile.' },
    tagline: { fr:'Simple. Interopérable. Déployable à grande échelle.', en:'Simple. Interoperable. Deployable at scale.' },
  },

  overview: [
    { fr:'Développé depuis mi-2025 au sein de Toncarton, DELIPOD est un micro-hub mobile et interopérable pensé pour structurer, sécuriser et tracer les flux de marchandises en environnement urbain dense.',
      en:'Developed since mid-2025 within Toncarton, DELIPOD is a mobile, interoperable micro-hub designed to structure, secure and track goods flows in dense urban environments.' },
    { fr:'Chargé de marchandises, le DELIPOD est acheminé par véhicules utilitaires ou poids lourds jusqu’à un point de rupture de charge sécurisé, puis redistribué par des solutions de mobilité douce adaptées aux contraintes urbaines.',
      en:'Loaded with goods, the DELIPOD is carried by vans or trucks to a secure transshipment point, then redistributed via soft-mobility solutions suited to urban constraints.' },
    { fr:'DELIPOD permet d’assurer cette rupture de charge tout en maintenant un suivi en temps réel des opérations entre les différents modes de transport.',
      en:'DELIPOD handles this transshipment while maintaining real-time tracking of operations across the different transport modes.' },
  ],

  why: {
    intro: { fr:'Le dernier kilomètre concentre les principales contraintes opérationnelles :',
             en:'The last mile concentrates the main operational constraints:' },
    points: [
      { fr:'Congestion urbaine et accès difficiles en centre-ville', en:'Urban congestion and difficult city-centre access' },
      { fr:'Hausse du coût du carburant', en:'Rising fuel costs' },
      { fr:'Explosion des coûts de livraison fractionnée', en:'Soaring costs of fragmented delivery' },
      { fr:'Contraintes réglementaires (ZFE, RSE)', en:'Regulatory constraints (LEZ, CSR)' },
      { fr:'Manque de traçabilité sur les ruptures de charge', en:'Lack of traceability at transshipment' },
      { fr:'Faible rentabilité des petits volumes en transport lourd', en:'Low profitability of small volumes in heavy transport' },
    ],
    outro: { fr:'DELIPOD structure ces flux autour d’un conteneur sécurisé, connecté, tracé et interopérable.',
             en:'DELIPOD structures these flows around a secure, connected, traceable and interoperable container.' },
  },

  how: {
    steps: [
      { fr:'Synchronisation automatique avec le TMS / SI logistique, optimisation de tournées', en:'Automatic sync with the TMS / logistics IS, route optimisation',
        ill:{ fr:'SUIVI — TMS / carte', en:'TRACKING — TMS / map' }, src:'assets/usecase-map.png', tags:['EDI','API','ERP'] },
      { fr:'Chargement des marchandises dans le DELIPOD', en:'Loading goods into the DELIPOD',
        ill:{ fr:'PHOTO — chargement', en:'PHOTO — loading' }, src:'assets/usecase-chargement.jpg' },
      { fr:'Acheminement vers un lieu de rupture de charge sécurisé', en:'Inbound to a secure transshipment site',
        ill:{ fr:'PHOTO — poids lourd / VUL', en:'PHOTO — truck / van' }, src:'assets/usecase-acheminement.jpg' },
      { fr:'Livraison finale via mobilité douce', en:'Final delivery via soft mobility',
        ill:{ fr:'PHOTO — vélo-cargo', en:'PHOTO — cargo bike' }, src:'assets/usecase-velo.jpg' },
    ],
    events: { fr:'Chaque opération génère des événements standardisés : dépôts, retraits, ouvertures, incidents, preuves de livraison, données capteurs.',
              en:'Each operation generates standardised events: drop-offs, pick-ups, openings, incidents, proofs of delivery, sensor data.' },
  },

  /* équipements embarqués → grille de fonctionnalités */
  equipment: [
    { k:'4G',   fr:'Connectivité 4G native', en:'Native 4G connectivity' },
    { k:'GPS',  fr:'Géolocalisation GPS', en:'GPS geolocation' },
    { k:'LOCK', fr:'Verrouillage sécurisé', en:'Secure locking' },
    { k:'PWR',  fr:'Alimentation autonome (solaire + batterie)', en:'Autonomous power (solar + battery)' },
  ],

  options: [
    { fr:'Scan de codes-barres embarqué', en:'On-board barcode scanning' },
    { fr:'Détection par RFID', en:'RFID detection' },
    { fr:'Caméra intégrée', en:'Integrated camera' },
    { fr:'Sonde de température', en:'Temperature probe' },
    { fr:'Capteur de champ magnétique', en:'Magnetic field sensor' },
    { fr:'Ouverture/fermeture électronique', en:'Electronic opening/closing' },
  ],

  specsStd: [
    { fr:'Dimensions', en:'Dimensions', v:{ fr:'160 × 80 × 160 cm', en:'160 × 80 × 160 cm' } },
    { fr:'Volume', en:'Volume', v:{ fr:'Jusqu’à 2 m³', en:'Up to 2 m³' } },
    { fr:'Charge utile', en:'Payload', v:{ fr:'Jusqu’à 250 kg', en:'Up to 250 kg' } },
    { fr:'Connectivité', en:'Connectivity', v:{ fr:'4G + GPS', en:'4G + GPS' } },
    { fr:'Énergie', en:'Power', v:{ fr:'Panneau solaire & batterie', en:'Solar panel & battery' } },
  ],

  fresh: {
    desc: [
      { fr:'Le DELIPOD Fresh est une version dédiée aux flux et produits thermosensibles.',
        en:'DELIPOD Fresh is a version dedicated to thermosensitive flows and products.' },
      { fr:'Il intègre un caisson isotherme connecté utilisant des plaques eutectiques pour assurer un maintien du froid passif et la continuité de la chaîne du froid.',
        en:'It features a connected insulated enclosure using eutectic plates for passive cold retention and an unbroken cold chain.' },
      { fr:'Il permet le suivi en temps réel des paramètres critiques : température, horodatage, ouverture, alertes.',
        en:'It enables real-time monitoring of critical parameters: temperature, timestamp, opening, alerts.' },
    ],
    specs: [
      { fr:'Dimensions intérieures', en:'Interior dimensions', v:{ fr:'132 × 66 × 110 cm', en:'132 × 66 × 110 cm' } },
      { fr:'Dimensions extérieures', en:'Exterior dimensions', v:{ fr:'146 × 80 × 150 cm', en:'146 × 80 × 150 cm' } },
      { fr:'Volume', en:'Volume', v:{ fr:'Jusqu’à 1,7 m³', en:'Up to 1.7 m³' } },
      { fr:'Charge utile', en:'Payload', v:{ fr:'Jusqu’à 250 kg', en:'Up to 250 kg' } },
      { fr:'Connectivité', en:'Connectivity', v:{ fr:'4G + GPS', en:'4G + GPS' } },
      { fr:'Énergie', en:'Power', v:{ fr:'Panneau solaire & batterie', en:'Solar panel & battery' } },
    ],
    sectorsList: [
      { fr:'Alimentaire', en:'Food' },
      { fr:'Médical', en:'Medical' },
      { fr:'Produits sensibles', en:'Sensitive goods' },
    ],
    sectors: { fr:'Secteurs : alimentaire, médical, produits sensibles.',
               en:'Sectors: food, medical, sensitive goods.' },
  },

  partners: [
    { n:'Toncarton', r:{ fr:'Éditeur de software', en:'Software publisher' }, logo:'assets/toncarton-logo.png' },
    { n:'Eutronix',  r:{ fr:'Électronique & IoT', en:'Electronics & IoT' }, logo:'assets/eutronix-logo.jpg', dark:true },
    { n:'Teliae',    r:{ fr:'Éditeur de software', en:'Software publisher' }, logo:'assets/teliae-logo.png' },
    { n:'CARA',      r:{ fr:'Réseau', en:'Network' }, logo:'assets/cara-logo.png' },
    { n:'Galifar',   r:{ fr:'Cyclologistique', en:'Cyclo-logistics' }, logo:'assets/galifar-logo.png' },
  ],

  /* ---------------- À PROPOS ---------------- */
  about: {
    intro: { fr:'Une solution développée au sein de Toncarton pour faire le lien entre le camion et le vélo, et fluidifier le passage de l’un à l’autre.',
             en:'A solution developed within Toncarton to bridge truck and bike, and smooth the handover from one to the other.' },
    who: [
      { fr:'DELIPOD est né au sein de Toncarton, éditeur de solutions logicielles dédiées au transport et à la logistique depuis 2018.',
        en:'DELIPOD was born within Toncarton, a publisher of software solutions for transport and logistics since 2018.' },
      { fr:'Toncarton développe une plateforme TMS permettant aux transporteurs, logisticiens et acteurs du dernier kilomètre de piloter leurs opérations de bout en bout : planification des tournées, dispatch, suivi en temps réel, traçabilité des flux et gestion opérationnelle.',
        en:'Toncarton builds a TMS platform letting carriers, logisticians and last-mile players manage operations end to end: route planning, dispatch, real-time tracking, flow traceability and operational management.' },
      { fr:'Avec DELIPOD, Toncarton étend son champ d’action du logiciel vers le hardware, afin de répondre aux enjeux de la logistique urbaine et des nouveaux modèles multimodaux.',
        en:'With DELIPOD, Toncarton extends from software to hardware, addressing urban logistics and new multimodal models.' },
    ],
    mission: {
      intro: { fr:'Rendre les flux logistiques urbains plus accessibles, plus intelligents et plus durables',
               en:'Make urban logistics flows more accessible, smarter and more sustainable' },
      points: [
        { fr:'Collecter les événements terrain pour les pousser vers vos systèmes d’information logistiques', en:'Collect field events and push them to your logistics information systems' },
        { fr:'Fluidifier, documenter et tracer les ruptures de charge', en:'Smooth, document and trace transshipment' },
        { fr:'Améliorer la traçabilité et la visibilité des flux en temps réel', en:'Improve real-time traceability and flow visibility' },
        { fr:'Optimiser l’exploitation des ressources logistiques', en:'Optimise the use of logistics resources' },
        { fr:'Accompagner la transition vers des modèles de transport décarbonés', en:'Support the shift to decarbonised transport models' },
      ],
    },
    approach: {
      intro: { fr:'Nous partons d’un constat simple : la logistique urbaine est fragmentée. Les outils, les modes de transport et les données fonctionnent souvent en silos.',
               en:'We start from a simple observation: urban logistics is fragmented. Tools, transport modes and data often work in silos.' },
      points: [
        { t:{ fr:'Multimodale', en:'Multimodal' }, d:{ fr:'route, cyclologistique, véhicules légers', en:'road, cyclelogistics, light vehicles' } },
        { t:{ fr:'Interopérable', en:'Interoperable' }, d:{ fr:'API, EDI, systèmes TMS', en:'API, EDI, TMS systems' } },
        { t:{ fr:'Connectée', en:'Connected' }, d:{ fr:'données terrain en temps réel', en:'real-time field data' } },
        { t:{ fr:'Standardisée', en:'Standardised' }, d:{ fr:'événements logistiques exploitables', en:'usable logistics events' } },
      ],
    },
    values: [
      { t:{ fr:'Open source', en:'Open source' }, d:{ fr:'Partager les sources et fédérer une communauté autour d’un bien commun logistique, ouvert et amélioré collectivement.', en:'Sharing the source and building a community around an open logistics common good, improved collectively.' } },
      { t:{ fr:'Multimodalité', en:'Multimodality' }, d:{ fr:'La complémentarité des modes : route, vélo, hubs urbains et logistique de proximité.', en:'Complementary modes: road, bike, urban hubs and local logistics.' } },
      { t:{ fr:'Interopérabilité', en:'Interoperability' }, d:{ fr:'S’intégrer dans les écosystèmes existants sans les remplacer.', en:'Fit into existing ecosystems without replacing them.' } },
      { t:{ fr:'Décarbonation', en:'Decarbonisation' }, d:{ fr:'Accompagner la transition vers des modèles logistiques plus sobres.', en:'Support the shift to leaner logistics models.' } },
      { t:{ fr:'Reconnu d’utilité urbaine', en:'Recognised urban usefulness' }, d:{ fr:'Chaque fonctionnalité répond à un usage opérationnel réel et mesurable.', en:'Every feature answers a real, measurable operational need.' } },
      { t:{ fr:'Automatisation', en:'Automation' }, d:{ fr:'Mettre la technologie au service du terrain pour simplifier le quotidien des opérateurs.', en:'Put technology to work in the field to simplify operators’ daily work.' } },
    ],
    vision: { fr:'Transformer la logistique urbaine en un système fluide, connecté et durable, où infrastructures physiques et systèmes numériques travaillent ensemble en temps réel.',
              en:'Turn urban logistics into a fluid, connected, sustainable system where physical infrastructure and digital systems work together in real time.' },

    founders: [
      { name:'Chakib Chadda', role:{ fr:'Fondateur & CEO', en:'Founder & CEO' },
        img:'assets/chakib.png',
        bio:[
          { fr:'Ingénieur en technologie embarquée, Chakib fonde Toncarton en 2018 avec une conviction : les acteurs du transport ont besoin d’outils simples, connectés et réellement utiles sur le terrain.',
            en:'An embedded-technology engineer, Chakib founded Toncarton in 2018 with one conviction: transport players need tools that are simple, connected and genuinely useful in the field.' },
          { fr:'Il développe Toncarton autour d’une expertise forte en TMS, télématique et IoT, réunis dans une seule interface SaaS. La solution combine logiciel métier, application mobile, matériel embarqué et données opérationnelles pour donner aux opérateurs terrain les outils indispensables au pilotage quotidien de leurs flux.',
            en:'He builds Toncarton on strong TMS, telematics and IoT expertise, brought together in a single SaaS interface. The solution combines business software, a mobile app, embedded hardware and operational data to give field operators the tools they need to run their flows day to day.' },
          { fr:'Avec DELIPOD, il porte la vision technique d’une infrastructure logistique connectée, capable de faire dialoguer matériel, logiciel, données et exploitation terrain dans une logique simple, robuste et industrialisable.',
            en:'With DELIPOD, he carries the technical vision of a connected logistics infrastructure able to make hardware, software, data and field operations work together in a simple, robust and industrialisable way.' },
        ] },
      { name:'Salim Lahlou', role:{ fr:'CRO & Associé', en:'CRO & Partner' },
        img:'assets/salim.png',
        bio:[
          { fr:'Entrepreneur depuis 2014 dans le secteur du traiteur B2B puis de la foodtech, Salim a construit son parcours au contact direct des opérations terrain : production, livraison, service client, logistique du dernier kilomètre et contraintes urbaines.',
            en:'An entrepreneur since 2014 in B2B catering and then foodtech, Salim built his career in direct contact with field operations: production, delivery, customer service, last-mile logistics and urban constraints.' },
          { fr:'Fondateur de Baobab Lab, il a développé des modèles autour de la cantine connectée, de la livraison de repas en entreprise, des contenants réutilisables, des circuits courts et d’une restauration plus responsable.',
            en:'Founder of Baobab Lab, he developed models around the connected canteen, corporate meal delivery, reusable containers, short supply chains and more responsible catering.' },
          { fr:'Aujourd’hui CRO Associé chez Toncarton, il pilote le développement commercial, les partenariats et les cas d’usage terrain. Il cofonde DELIPOD avec Chakib Chadda pour rapprocher transporteurs, distributeurs, cyclo-logisticiens et systèmes d’information autour d’une unité logistique commune.',
            en:'Now CRO & Partner at Toncarton, he leads commercial development, partnerships and field use cases. He co-founds DELIPOD with Chakib Chadda to bring carriers, distributors, cyclo-logistics operators and information systems together around a shared logistics unit.' },
        ] },
    ],

    story: {
      intro: { fr:'Engagée pour une logistique durable, DELIPOD aide ses clients à réduire leurs coûts opérationnels tout en atteignant leurs objectifs environnementaux et en s’intégrant de façon transparente à leurs processus existants.',
               en:'Committed to sustainable logistics, DELIPOD helps clients cut operating costs while meeting their environmental goals — integrating seamlessly into existing processes.' },
      milestones: [
        { date:{ fr:'Juillet 2025', en:'July 2025' }, t:{ fr:'L’idée', en:'The idea' },
          d:{ fr:'Naissance du concept DELIPOD au sein de Toncarton.', en:'The DELIPOD concept is born within Toncarton.' } },
        { date:{ fr:'Septembre 2025', en:'September 2025' }, t:{ fr:'Conception', en:'Design' },
          d:{ fr:'Design du premier mini-conteneur urbain connecté.', en:'Design of the first connected urban mini-container.' } },
        { date:{ fr:'Novembre 2025', en:'November 2025' }, t:{ fr:'Fabrication', en:'Manufacturing' },
          d:{ fr:'Mise en production du premier DELIPOD.', en:'First DELIPOD enters production.' } },
        { date:{ fr:'Mars 2026', en:'March 2026' }, t:{ fr:'Tests clients', en:'Client trials' },
          d:{ fr:'Premiers déploiements et essais en conditions réelles.', en:'First deployments and real-world trials.' } },
        { date:{ fr:'Juin 2026', en:'June 2026' }, t:{ fr:'Premières commandes', en:'First orders' },
          d:{ fr:'Vente directe à des premiers utilisateurs.', en:'Direct sales to first users.' } },
      ],
    },
  },
};
