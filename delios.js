/* Delios : page intégrée dans la V4, scripts limités au conteneur .pdo */
(function(){
  function init(root){
    function __id(i){ return root.querySelector('[id="'+i+'"]'); }

(function(){
   root.classList.add('js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setNav(){ var n=document.querySelector('.site-nav,body>nav,nav[aria-label]'); var hgt=n?Math.min(140,n.getBoundingClientRect().height):72; root.style.setProperty('--navh', hgt+'px'); }
  setNav(); window.addEventListener('resize',setNav);

  /* événements : onglets, passage automatique tant que personne n'a touché */
  var tabs=[].slice.call(root.querySelectorAll('.xt [role=tab]')), panels=[].slice.call(root.querySelectorAll('.xp'));
  var dot=__id('mfd'), cur=0, touched=false, timer=null, vis=false;
  function show(i,focus){
    cur=i;
    tabs.forEach(function(t,k){ var on=k===i; t.classList.toggle('on',on); t.setAttribute('aria-selected',on?'true':'false'); t.tabIndex=on?0:-1; });
    panels.forEach(function(p,k){ var on=k===i; p.hidden=!on; p.classList.toggle('on',on); });
    if(dot&&!reduce){ dot.classList.remove('run'); void dot.offsetWidth; dot.classList.add('run'); }
    if(focus) tabs[i].focus();
  }
  if(panels.length) show(0);
  tabs.forEach(function(t,k){
    t.addEventListener('click',function(){ touched=true; show(k); });
    t.addEventListener('keydown',function(e){
      var n=null;
      if(e.key==='ArrowDown'||e.key==='ArrowRight') n=(k+1)%tabs.length;
      else if(e.key==='ArrowUp'||e.key==='ArrowLeft') n=(k+tabs.length-1)%tabs.length;
      else if(e.key==='Home') n=0; else if(e.key==='End') n=tabs.length-1;
      if(n!==null){ e.preventDefault(); touched=true; show(n,true); }
    });
  });
  var xpl=root.querySelector('#evenements .xpl'), xsp=root.querySelector('#evenements .xsp');
  /* hauteur fixe du panneau = le plus haut des six, pour que le bloc sticky ne bouge plus */
  function fixH(){
    var xcEl=root.querySelector('#evenements .xc'); if(!xcEl) return;
    var mx=0;
    panels.forEach(function(p){ var was=p.hidden; p.hidden=false; mx=Math.max(mx,p.offsetHeight); p.hidden=was; });
    var cs=getComputedStyle(xcEl);
    root.style.setProperty('--xch', Math.ceil(mx+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+2)+'px');
  }
  fixH(); window.addEventListener('resize',function(){ fixH(); stepPx=0; }); setTimeout(function(){ fixH(); stepPx=0; },600);
  var stepPx=0;
  function evScroll(){
    if(!xpl||!xsp||!tabs.length||window.innerWidth<900) return;
    var s=xsp.getBoundingClientRect();
    if(!stepPx) stepPx=xpl.offsetHeight;
    var p=(96+stepPx-s.top)/Math.max(1,s.height);
    p=Math.min(0.9999,Math.max(0,p));
    var f=p*tabs.length, i=Math.floor(f);
    if(i!==cur){ var d=f-Math.floor(f); if(i>cur&&d<0.12&&i===cur+1) return; if(i<cur&&d>0.88&&i===cur-1) return; show(i); }
  }
  window.addEventListener('scroll',function(){ requestAnimationFrame(evScroll); },{passive:true});
  var xc=root.querySelector('.xc');
  if(tabs.length&&xc&&!reduce&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){ vis=es[0].isIntersecting; },{threshold:0.4}).observe(xc);
    timer=setInterval(function(){ if(window.innerWidth<900&&vis&&!touched&&!document.hidden) show((cur+1)%tabs.length); },3400);
  }
})();


  }
  function scan(){ var els=document.querySelectorAll('.pdo'); for(var i=0;i<els.length;i++){ if(!els[i].__pg){ els[i].__pg=true; try{ init(els[i]); }catch(e){ console.warn('pdo',e); } } } }
  var pending=false;
  function boot(){ new MutationObserver(function(){ if(!pending){ pending=true; requestAnimationFrame(function(){ pending=false; scan(); }); } }).observe(document.documentElement,{childList:true,subtree:true}); scan(); setInterval(scan,500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


/* DeliOS – simulateur de report modal v1 (oct. 2026)
   Tout se passe dans le navigateur : le fichier n'est envoyé nulle part.
   Lecture CSV native ; Excel via SheetJS chargé à la demande depuis cdnjs.
   Règles v1 :
   - zone vélo = codes postaux intra-muros de la ville choisie
   - au-delà de CAP_KG par livraison : reste en camion
   - surgelé / pharma : « à étudier », pas de promesse automatique
   - seuils terrain : 30 livraisons vélo par jour pour ouvrir une tournée, 5,5 livraisons par heure de vélo */
(function(){
  var K={c:150,s:30,h:5.5};
  var XL=[
    {u:'https://cdn.jsdelivr.net/npm/@e965/xlsx@0.20.3/dist/xlsx.full.min.js',i:'sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT'},
    {u:'https://unpkg.com/@e965/xlsx@0.20.3/dist/xlsx.full.min.js',i:'sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT'},
    {u:'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',i:null}
  ];
  function r(a,b){var o=[];for(var i=a;i<=b;i++)o.push(String(i));return o;}
  var VILLES={
    paris:{n:'Paris',cp:r(75001,75020).concat(['75116']),pre:['92','93','94'],ext:[],bn:'Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne'},
    lyon:{n:'Lyon',cp:r(69001,69009),ext:['69100','69300','69200','69500','69600','69190','69160','69130'],bn:'Villeurbanne, Caluire, Vénissieux, Bron, Oullins…'},
    marseille:{n:'Marseille',cp:r(13001,13016),ext:['13190','13380','13240'],bn:'Allauch, Plan-de-Cuques, Septèmes'},
    toulouse:{n:'Toulouse',cp:['31000','31100','31200','31300','31400','31500'],ext:['31700','31770','31130','31240','31520','31170'],bn:'Blagnac, Colomiers, Balma, L\'Union, Ramonville, Tournefeuille'},
    bordeaux:{n:'Bordeaux',cp:['33000','33100','33200','33300','33800'],ext:['33700','33600','33400','33130','33110','33150','33310','33270','33520'],bn:'Mérignac, Pessac, Talence, Bègles, Le Bouscat, Cenon…'},
    nice:{n:'Nice',cp:['06000','06100','06200','06300'],ext:['06700','06800','06230','06340'],bn:'Saint-Laurent-du-Var, Cagnes, Villefranche, La Trinité'},
    autre:{n:'Autre ville',cp:null}
  };
  var RX={
    cp:/(code.?postal|\bcp\b|c\.\s?p\b|postal|zip|cde.?post)/,
    adr:/(adresse|address|\brue\b|destination|\badr\b|ville|commune|localite|city)/,
    poids:/(poids|weight|\bkg\b|masse|\bnet\b|brut|tonnage)/,
    temp:/(temp|froid|regime|conservation|gamme|famille|rayon|categorie|nature|type.?produit|univers)/,
    date:/(date|\bjour\b|livraison le|\bday\b|\bliv\b)/,
    qty:/(colis|parcel|quantit|\bqte\b|\bnb\b|nombre|pieces|ref|code.?client|n.?client|tel|siret)/
  };
  var LBL={cp:'Code postal',adr:'Adresse ou ville',poids:'Poids',temp:'Température',date:'Date'};
  function norm(s){return String(s==null?'':s).toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();}
  function num(v){if(v==null||v==='')return NaN;var s=String(v).replace(/\s/g,'');if(/,\d{1,3}$/.test(s)&&s.indexOf('.')>-1)s=s.replace(/\./g,'');s=s.replace(',','.').replace(/[^0-9.\-]/g,'');return s===''||s==='.'?NaN:parseFloat(s);}
  function fr(n,d){d=d||0;return (Math.round(n*Math.pow(10,d))/Math.pow(10,d)).toLocaleString('fr-FR');}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function pl(n,a,b){return n>1?b:a;}

  function cpTxt(v){
    var s=String(v==null?'':v).trim(); if(!s) return '';
    var m=s.match(/^(\d{2})[.\s\u00a0](\d{3})$/); if(m&&valid(m[1]+m[2])) return m[1]+m[2];
    m=s.match(/^(\d{4,5})(?:[.,]0+)?$/); if(m){var c=m[1].length===4?'0'+m[1]:m[1]; return valid(c)?c:'';}
    m=s.match(/(?:^|\D)(\d{5})(?!\d)/); if(m&&valid(m[1])) return m[1];
    var t=norm(s);
    m=t.match(/paris\s*(\d{1,2})(?:e|er|eme)?\b/); if(m&&+m[1]>=1&&+m[1]<=20) return '750'+('0'+m[1]).slice(-2);
    m=t.match(/lyon\s*(\d)(?:e|er|eme)?\b/); if(m&&+m[1]>=1) return '6900'+m[1];
    m=t.match(/marseille\s*(\d{1,2})(?:e|er|eme)?\b/); if(m&&+m[1]>=1&&+m[1]<=16) return '130'+('0'+m[1]).slice(-2);
    return '';
  }
  function valid(c){var n=+c; return n>=1000&&n<=98999;}
  function dateKey(v){
    var s=String(v==null?'':v).trim(); if(!s) return '';
    var m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(m) return m[1]+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[3]).slice(-2);
    m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/); if(m&&+m[2]<=12&&+m[1]<=31){var y=m[3].length===2?'20'+m[3]:m[3]; return y+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[1]).slice(-2);}
    m=norm(s).match(/(\d{1,2})\s+(janv|fevr|mars|avr|mai|juin|juil|aout|sept|oct|nov|dec)\w*\.?\s+(\d{4})/);
    if(m){var mo=['janv','fevr','mars','avr','mai','juin','juil','aout','sept','oct','nov','dec'].indexOf(m[2])+1; return m[3]+'-'+('0'+mo).slice(-2)+'-'+('0'+m[1]).slice(-2);}
    return '';
  }
  function tcls(v){
    var t=norm(v); if(!t) return null;
    if(/pharma|medic|sante|hopital|clinique/.test(t)) return 'pharma';
    if(/ambian|\bsec\b|\bsecs\b|epicerie|non.?refrig|temperature ambiante|\+?\s?1[0-9]\s?(°?c?)?\s?(-|a|\/|–)\s?\+?\s?2[0-9]/.test(t)) return 'sec';
    if(/surgel|congel|negatif|deep.?frozen|frozen|(^|[^0-9])-\s?(1[5-9]|2[0-9]|3[0-9])\s?°?/.test(t)) return 'surg';
    if(/frais|froid|refrig|positif|chill|^\+?\s?[0-4]\s?°?c?\s?(-|a|\/|–)\s?\+?\s?[2-8]\s?°?c?$|\b[0-4]\s?°?c?\s?(-|a|\/|–)\s?\+?[2-8]\s?°c|viande|boeuf|veau|porc|agneau|volaille|poulet|canard|gibier|charcut|traiteur|boucher|poisson|maree|crustac|fruits? de mer|cremerie|laitier|\blait\b|fromage|yaourt|ultra.?frais|\bbof\b|fruit|legume|primeur|salade|fleur|oeuf/.test(t)) return 'frais';
    return null;
  }

  function sample(rows,i){var o=[];for(var k=0;k<rows.length&&o.length<400;k++){var v=rows[k][i];if(v!=null&&String(v).trim()!=='')o.push(v);}return o;}
  function ratio(a,f){if(!a.length)return 0;var n=0;a.forEach(function(v){if(f(v))n++;});return n/a.length;}
  function median(a){if(!a.length)return NaN;a=a.slice().sort(function(x,y){return x-y;});return a[Math.floor(a.length/2)];}

  function headerRow(rows){
    var best=-1,bs=0;
    for(var i=0;i<Math.min(rows.length,15);i++){
      var sc=0; rows[i].forEach(function(c){var t=norm(c); if(!t||/^[\d.,\s\-\/:]+$/.test(t))return; for(var k in RX){ if(k!=='qty'&&RX[k].test(t)){sc++;break;} }});
      if(sc>bs){bs=sc;best=i;}
    }
    return best;
  }
  function detect(head,rows){
    var map={},used={},n=head.length,H=head.map(norm),S=[];
    for(var i=0;i<n;i++) S.push(sample(rows,i));
    function take(k,i){map[k]=i;used[i]=1;}
    function free(i){return !used[i];}
    var c=-1,cs=0;
    for(i=0;i<n;i++){ if(!free(i))continue; var rc=ratio(S[i],function(v){return /^\s*(\d{4,5}([.,]0+)?|\d{2}[.\s]\d{3})\s*$/.test(String(v))&&!!cpTxt(v);});
      var h=RX.cp.test(H[i]), q=RX.qty.test(H[i])||RX.poids.test(H[i])||RX.date.test(H[i]);
      var sc=h?rc+1:(q?0:rc); if((h&&rc>=0.4||!h&&rc>=0.8)&&sc>cs){cs=sc;c=i;} }
    if(c>-1) take('cp',c);
    var d=-1,ds=0;
    for(i=0;i<n;i++){ if(!free(i))continue; var rd=ratio(S[i],function(v){return !!dateKey(v);}); var sc2=rd+(RX.date.test(H[i])?0.5:0); if(rd>=0.6&&sc2>ds){ds=sc2;d=i;} }
    if(d>-1) take('date',d);
    var p=-1,ps=0;
    for(i=0;i<n;i++){ if(!free(i)||!RX.poids.test(H[i])||/colis|quantit|nb/.test(H[i]))continue; var rp=ratio(S[i],function(v){return !isNaN(num(v));}); var sc3=rp+(/poids|weight/.test(H[i])?1:0); if(rp>=0.5&&sc3>ps){ps=sc3;p=i;} }
    if(p>-1) take('poids',p);
    var t=-1,ts=0;
    for(i=0;i<n;i++){ if(!free(i))continue; var hm=RX.temp.test(H[i]); var rt=ratio(S[i],function(v){return tcls(v)!==null;}); if(((hm&&rt>=0.5)||(!hm&&rt>=0.8&&S[i].length>0&&ratio(S[i],function(v){return /[a-z]/i.test(String(v));})>=0.8))&&rt+(hm?1:0)>ts){ts=rt+(hm?1:0);t=i;} }
    if(t>-1) take('temp',t);
    var a=-1,as=0;
    for(i=0;i<n;i++){ if(!free(i)||!RX.adr.test(H[i]))continue; var ra=ratio(S[i],function(v){return !!cpTxt(v);}); var sc4=ra+(/adresse|address/.test(H[i])?0.5:0.1); if(sc4>as){as=sc4;a=i;} }
    if(a>-1) take('adr',a);
    return map;
  }
  function unitOf(head,col,rows){
    if(col==null) return {u:'kg',auto:false};
    var h=norm(head[col]);
    if(/\(g\)|\bgr?\b|gramme/.test(h)) return {u:'g',auto:true};
    if(/\(t\)|tonne/.test(h)) return {u:'t',auto:true};
    var vals=sample(rows,col).map(num).filter(function(x){return !isNaN(x)&&x>0;});
    var md=median(vals);
    if(!/kg|kilo/.test(h)&&md>1000) return {u:'g',auto:true,why:'big'};
    return {u:'kg',auto:false,big:md>1000};
  }

  var xlP=null;
  function loadXLSX(){
    if(window.XLSX&&window.XLSX.read) return Promise.resolve();
    if(xlP) return xlP;
    xlP=new Promise(function(ok,ko){
      var k=0;
      (function next(){
        if(window.XLSX&&window.XLSX.read) return ok();
        if(k>=XL.length){xlP=null;return ko(new Error('xlsx'));}
        var src=XL[k++], s=document.createElement('script'); s.src=src.u; s.async=true;
        if(src.i){s.integrity=src.i;s.crossOrigin='anonymous';}
        var done=false, to=setTimeout(function(){if(!done){done=true;s.remove();next();}},12000);
        s.onload=function(){if(done)return;done=true;clearTimeout(to); if(window.XLSX&&window.XLSX.read) ok(); else next();};
        s.onerror=function(){if(done)return;done=true;clearTimeout(to);s.remove();next();};
        document.head.appendChild(s);
      })();
    });
    return xlP;
  }
  function parseCSV(txt){
    txt=txt.replace(/^﻿/,'');
    var first=txt.split(/\r?\n/)[0]||'', d=';';
    var c={';':(first.match(/;/g)||[]).length,',':(first.match(/,/g)||[]).length,'\t':(first.match(/\t/g)||[]).length};
    if(c[',']>c[d])d=','; if(c['\t']>c[d])d='\t';
    var rows=[],row=[],f='',q=false;
    for(var i=0;i<txt.length;i++){var ch=txt[i];
      if(q){ if(ch==='"'){ if(txt[i+1]==='"'){f+='"';i++;} else q=false; } else f+=ch; }
      else if(ch==='"') q=true;
      else if(ch===d){row.push(f);f='';}
      else if(ch==='\n'||ch==='\r'){ if(ch==='\r'&&txt[i+1]==='\n')i++; row.push(f);rows.push(row);row=[];f=''; }
      else f+=ch;
    }
    if(f!==''||row.length){row.push(f);rows.push(row);}
    return rows;
  }
  function decode(buf){
    var u=new Uint8Array(buf);
    try{ return new TextDecoder('utf-8',{fatal:true}).decode(u); }catch(e){ return new TextDecoder('windows-1252').decode(u); }
  }

  function init(app){
    var st={sheets:null,si:0,head:null,rows:null,map:{},unit:'kg',unitInfo:null,ville:'paris',zone:'ext',prod:'sec',jours:null,joursSrc:null,name:'',file:null,summary:''};
    var opts=''; for(var k in VILLES) opts+='<option value="'+k+'">'+VILLES[k].n+'</option>';
    app.innerHTML=
      '<div class="sim-in">'+
        '<div>'+
          '<label class="sim-f"><span class="sim-k">1 · Votre ville</span><select data-s="ville">'+opts+'</select></label>'+
          '<label class="sim-f" data-s="zf"><span class="sim-k">2 · Zone desservie à vélo</span><select data-s="zone"><option value="ext">Ville et proche banlieue</option><option value="in">Ville seule (intra-muros)</option></select>'+
          '<span class="sim-h" data-s="zh"></span></label>'+
          '<label class="sim-f"><span class="sim-k">3 · Vos produits</span><select data-s="prod"><option value="sec">Secs (température ambiante)</option><option value="frais">Frais (réfrigérés)</option></select>'+
          '<span class="sim-h">Utilisé pour les livraisons dont le fichier ne précise pas la température.</span></label>'+
        '</div>'+
        '<div>'+
          '<p class="sim-k">4 · Vos livraisons</p>'+
          '<label class="sim-drop" data-s="drop"><input type="file" accept=".xlsx,.xls,.xlsm,.ods,.csv,.txt" data-s="file"><b>Déposer un fichier Excel ou CSV</b><span>ou cliquer pour le choisir. Une ligne par livraison, avec au moins le code postal ou l\'adresse.</span></label>'+
          '<div class="sim-links"><button type="button" data-s="tpl">Télécharger le modèle</button><button type="button" data-s="demo">Essayer avec un exemple fictif</button></div>'+
        '</div>'+
      '</div>'+
      '<div class="sim-out" data-s="out" aria-live="polite"><div class="sim-head-row"><p class="sim-empty">Le résultat s\'affiche ici dès que le fichier est lu.</p><span class="chip etu"><i></i>Votre fichier reste sur votre ordinateur, sauf si vous le joignez à votre demande.</span></div></div>';
    function $(n){return app.querySelector('[data-s="'+n+'"]');}
    var out=$('out'), fileIn=$('file'), drop=$('drop');
    function zh(){var V=VILLES[st.ville]; $('zf').style.display=V.cp?'':'none'; $('zh').textContent=V.cp?(st.zone==='ext'?'Proche banlieue comptée : '+V.bn+'.':'Seules les adresses de '+V.n+' intra-muros sont comptées.'):'';}
    zh();
    $('ville').addEventListener('change',function(e){st.ville=e.target.value;zh();render();});
    $('zone').addEventListener('change',function(e){st.zone=e.target.value;zh();render();});
    $('prod').addEventListener('change',function(e){st.prod=e.target.value;render();});
    fileIn.addEventListener('change',function(){ if(fileIn.files[0]) read(fileIn.files[0]); fileIn.value=''; });
    ['dragenter','dragover'].forEach(function(t){drop.addEventListener(t,function(e){e.preventDefault();drop.classList.add('over');});});
    ['dragleave','drop'].forEach(function(t){drop.addEventListener(t,function(e){e.preventDefault();drop.classList.remove('over');});});
    drop.addEventListener('drop',function(e){var f=e.dataTransfer&&e.dataTransfer.files[0]; if(f) read(f);});
    $('tpl').addEventListener('click',template);
    $('demo').addEventListener('click',demo);

    var host=app.parentNode&&app.parentNode.querySelector('#sim-plan'), plan=host?planForm(host,st):null;
    function msg(t,err){out.innerHTML='<p class="'+(err?'sim-err':'sim-empty')+'">'+t+'</p>'; st.summary=''; if(plan)plan.refresh();}
    function read(f){
      st.name=f.name; st.file=f; msg('Lecture de '+esc(f.name)+'…');
      var ext=(f.name.split('.').pop()||'').toLowerCase(), rd=new FileReader();
      if(ext==='csv'||ext==='txt'){
        rd.onload=function(){ setSheets([{n:f.name,rows:parseCSV(decode(rd.result))}]); };
        rd.onerror=function(){msg('Ce fichier n\'a pas pu être lu.',true);};
        rd.readAsArrayBuffer(f);
      } else {
        rd.onload=function(){
          var buf=rd.result;
          loadXLSX().then(function(){
            try{ var wb=XLSX.read(new Uint8Array(buf),{type:'array',cellDates:true});
              setSheets(wb.SheetNames.map(function(n){return {n:n,rows:XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:false,defval:'',dateNF:'yyyy-mm-dd',blankrows:false})};}));
            }catch(e){ msg('Ce fichier n\'a pas pu être lu. Enregistrez-le en CSV (Fichier > Enregistrer sous > CSV) et déposez-le à nouveau.',true); }
          },function(){ msg('Le lecteur Excel n\'a pas pu se charger (connexion ou réseau d\'entreprise). Enregistrez votre fichier en CSV (Fichier > Enregistrer sous > CSV) et déposez-le à nouveau : le CSV se lit sans rien charger.',true); });
        };
        rd.onerror=function(){msg('Ce fichier n\'a pas pu être lu.',true);};
        rd.readAsArrayBuffer(f);
      }
    }
    function clean(rows){return (rows||[]).map(function(rw){return (rw||[]).map(function(c){return c==null?'':c;});}).filter(function(rw){return rw.some(function(c){return String(c).trim()!=='';});});}
    function prep(rows){
      rows=clean(rows); if(!rows.length) return null;
      var hi=headerRow(rows), head, data, w=0;
      rows.forEach(function(rw){for(var c=rw.length-1;c>=0;c--){if(String(rw[c]).trim()!==''){if(c+1>w)w=c+1;break;}}});
      rows=rows.map(function(rw){return rw.slice(0,w);});
      if(hi<0){ head=[]; for(var i=0;i<w;i++) head.push('Colonne '+String.fromCharCode(65+(i%26))+(i>=26?Math.floor(i/26):'')); data=rows; }
      else { head=[]; for(var j=0;j<w;j++) head.push(String(rows[hi][j]==null?'':rows[hi][j]).trim()||('Colonne '+(j+1))); data=rows.slice(hi+1); }
      var map=detect(head,data);
      var cpN=0; data.forEach(function(rw){ if(cpOfRow(rw,map)) cpN++; });
      return {head:head,rows:data,map:map,score:cpN};
    }
    function setSheets(sh){
      st.sheets=sh.map(function(s){var p=prep(s.rows); return {n:s.n,p:p};});
      var best=0,bs=-1; st.sheets.forEach(function(s,i){ var sc=s.p?s.p.score:-1; if(sc>bs){bs=sc;best=i;} });
      useSheet(best);
    }
    function useSheet(i){
      st.si=i; var p=st.sheets[i].p;
      if(!p||!p.rows.length){ st.head=null; st.rows=null; return msg('Aucune ligne de livraison trouvée dans cet onglet.',true); }
      st.head=p.head; st.rows=p.rows; st.map={}; for(var k in p.map) st.map[k]=p.map[k];
      st.unitInfo=unitOf(st.head,st.map.poids,st.rows); st.unit=st.unitInfo.u;
      st.jours=null; st.joursSrc=null;
      render();
    }
    function cpOfRow(row,map){
      var c='';
      if(map.cp!=null) c=cpTxt(row[map.cp]);
      if(!c&&map.adr!=null) c=cpTxt(row[map.adr]);
      return c;
    }
    function inZone(cp,V){
      if(!V.cp) return 'in';
      if(V.cp.indexOf(cp)>-1) return 'in';
      if(st.zone==='ext'){ if(V.ext&&V.ext.indexOf(cp)>-1) return 'ext'; if(V.pre&&V.pre.indexOf(cp.slice(0,2))>-1) return 'ext'; }
      return '';
    }
    function kg(v){var x=num(v); if(isNaN(x)||x<0) return NaN; return st.unit==='g'?x/1000:(st.unit==='t'?x*1000:x);}

    function mapUI(){
      var h='<div class="sim-map">';
      if(st.sheets&&st.sheets.length>1){
        h+='<label>Onglet lu <select data-sheet>'+st.sheets.map(function(s,i){return '<option value="'+i+'"'+(i===st.si?' selected':'')+'>'+esc(s.n)+'</option>';}).join('')+'</select></label>';
      }
      ['cp','adr','poids','temp','date'].forEach(function(k){
        var o='<option value="">—</option>'+st.head.map(function(hh,i){return '<option value="'+i+'"'+(st.map[k]===i?' selected':'')+'>'+esc(hh)+'</option>';}).join('');
        h+='<label>'+LBL[k]+' <select data-col="'+k+'">'+o+'</select></label>';
        if(k==='poids'&&st.map.poids!=null) h+='<label>Unité <select data-unit><option value="kg"'+(st.unit==='kg'?' selected':'')+'>kg</option><option value="g"'+(st.unit==='g'?' selected':'')+'>grammes</option><option value="t"'+(st.unit==='t'?' selected':'')+'>tonnes</option></select></label>';
      });
      return h+'</div>';
    }
    function bind(){
      [].forEach.call(out.querySelectorAll('select[data-col]'),function(s){
        s.addEventListener('change',function(){var k=s.getAttribute('data-col');
          if(s.value===''){delete st.map[k];} else { var v=parseInt(s.value,10); for(var kk in st.map){ if(st.map[kk]===v&&kk!==k) delete st.map[kk]; } st.map[k]=v; }
          if(k==='poids'){st.unitInfo=unitOf(st.head,st.map.poids,st.rows);st.unit=st.unitInfo.u;}
          if(k==='date'){st.jours=null;st.joursSrc=null;}
          render();});
      });
      var u=out.querySelector('select[data-unit]'); if(u) u.addEventListener('change',function(){st.unit=u.value;st.unitInfo={u:u.value,auto:false};render();});
      var sh=out.querySelector('select[data-sheet]'); if(sh) sh.addEventListener('change',function(){useSheet(parseInt(sh.value,10));});
      var jb=out.querySelector('[data-j="ok"]'), ji=out.querySelector('[data-j="in"]');
      function setJ(){var v=parseInt(ji.value,10); if(!(v>0)){ji.focus();ji.setAttribute('aria-invalid','true');return;} st.jours=v; st.joursSrc='user'; render();}
      if(jb){ jb.addEventListener('click',setJ); ji.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();setJ();}}); }
      var jc=out.querySelector('[data-j="chg"]'); if(jc) jc.addEventListener('click',function(){st.joursSrc='edit';render();});
    }

    function render(){
      if(!st.rows) return;
      var V=VILLES[st.ville];
      var dates={}, tot=0, sansCp=0, hors=0, ext=0, lourd=0, etude=0, ok=0, okFrais=0, poidsOk=0, okSansPoids=0, tempLue=0;
      var pc=st.map.poids!=null, tc=st.map.temp!=null, dc=st.map.date!=null;
      st.rows.forEach(function(row){
        tot++;
        if(dc){var d=dateKey(row[st.map.date]); if(d) dates[d]=1;}
        var cp=cpOfRow(row,st.map);
        if(!cp){sansCp++;return;}
        var z=inZone(cp,V); if(!z){hors++;return;}
        var p=pc?kg(row[st.map.poids]):NaN;
        if(!isNaN(p)&&p>K.c){lourd++;return;}
        var t=tc?tcls(row[st.map.temp]):null; if(t) tempLue++; else t=st.prod;
        if(t==='surg'||t==='pharma'){etude++;return;}
        ok++; if(z==='ext') ext++; if(t==='frais') okFrais++; if(!isNaN(p)) poidsOk+=p; else okSansPoids++;
      });
      var head='<p class="sim-fn">'+esc(st.name)+' · '+fr(tot)+' '+pl(tot,'ligne lue','lignes lues')+'. Vérifiez les colonnes reconnues :</p>'+mapUI();
      var nd=Object.keys(dates).length;
      if(dc&&nd>0&&st.joursSrc!=='user'&&st.joursSrc!=='edit'){st.jours=nd;st.joursSrc='date';}
      if(!dc&&st.joursSrc==='date'){st.jours=null;st.joursSrc=null;}

      if(tot===0){ out.innerHTML=head+'<div class="sim-v ko"><h4>Aucune livraison trouvée.</h4><p>Vérifiez que le fichier contient une ligne par livraison, ou choisissez un autre onglet.</p></div>'; return done(''); }
      if(sansCp/tot>0.5){
        out.innerHTML=head+'<div class="sim-v mid"><h4>Nous n\'avons pas trouvé vos codes postaux.</h4><p>'+fr(sansCp)+' '+pl(sansCp,'ligne','lignes')+' sur '+fr(tot)+' sans code postal lisible. Choisissez ci-dessus la colonne qui contient le code postal ou l\'adresse complète. Aucun résultat n\'est calculé tant que les adresses ne sont pas lues.</p></div>';
        return done('');
      }
      if(!(st.jours>0)||st.joursSrc==='edit'){
        out.innerHTML=head+'<div class="sim-v mid sim-ask"><h4>'+(st.joursSrc==='edit'?'Sur combien de jours de livraison porte ce fichier ?':'Votre fichier ne contient pas de date lisible.')+'</h4>'+
          '<p>Pour calculer un volume par jour, indiquez le nombre de jours de livraison couverts par ces '+fr(tot)+' lignes (1 pour une seule tournée, environ 22 pour un mois ouvré).</p>'+
          '<div class="sim-jrow"><input type="number" min="1" step="1" inputmode="numeric" data-j="in" value="'+(st.jours||'')+'" placeholder="Nombre de jours" aria-label="Nombre de jours de livraison"><button type="button" class="btn p" data-j="ok">Afficher le résultat</button></div></div>';
        return done('', true);
      }
      var J=st.jours, okJ=ok/J, totJ=tot/J, pct=ok/tot*100, sp=Math.ceil(poidsOk/J/K.c);
      var poidsFiable=pc&&ok>0&&okSansPoids/ok<=0.5;
      var verdict;
      if(ok===0) verdict='<div class="sim-v ko"><h4>Le vélo-cargo n\'est pas adapté à ce fichier.</h4><p>Aucune livraison ne remplit les conditions : zone desservie, poids par livraison et température. Le camion reste la bonne réponse, et c\'est très bien ainsi.</p></div>';
      else if(okJ<K.s) verdict='<div class="sim-v mid"><h4>Pas encore assez de volume pour une tournée vélo dédiée.</h4><p>Environ '+fr(okJ,1)+' '+pl(Math.round(okJ*10)/10>1?2:1,'livraison','livraisons')+' par jour pourrai'+(Math.round(okJ*10)/10>1?'ent':'t')+' partir en vélo-cargo. C\'est trop peu pour une tournée dédiée. Une mutualisation avec d\'autres flux de la même zone peut changer la donne : parlons-en.</p></div>';
      else verdict='<div class="sim-v"><h4>Votre flux se prête à un premier test.</h4><p>Environ '+fr(okJ,0)+' livraisons par jour peuvent partir en vélo-cargo depuis un lieu de dépôt, soit '+fr(pct,0)+' % de votre fichier. Le reste continue en camion.</p></div>';
      var jl='<p class="sim-jl">'+(st.joursSrc==='date'?fr(J)+' '+pl(J,'jour de livraison détecté','jours de livraison détectés')+' dans la colonne date.':'Fichier compté sur '+fr(J)+' '+pl(J,'jour','jours')+' de livraison.')+' <button type="button" data-j="chg">Modifier</button></p>';
      var tiles='<div class="sim-g">'+
        '<div><span class="n">'+fr(totJ,totJ<10?1:0)+'</span><span class="t">'+(totJ>1?'livraisons':'livraison')+' par jour dans votre fichier ('+fr(tot)+' au total)</span></div>'+
        '<div><span class="n">'+fr(pct,0)+' %</span><span class="t">éligibles au vélo-cargo</span></div>'+
        '<div><span class="n">'+fr(okJ,okJ<10?1:0)+'</span><span class="t">'+(okJ>1?'livraisons':'livraison')+' vélo par jour'+(ext?', dont '+fr(ext/J,ext/J<10?1:0)+' en proche banlieue':'')+'</span></div>'+
        (poidsFiable?'<div><span class="n">'+fr(sp)+'</span><span class="t">'+pl(sp,'chargement','chargements')+' de Delipod par jour ('+fr(poidsOk/J,0)+' kg'+(okSansPoids?', hors '+fr(okSansPoids)+' '+pl(okSansPoids,'livraison','livraisons')+' sans poids':'')+')</span></div>'
          :'<div><span class="n">–</span><span class="t">chargements de Delipod : '+(pc?'trop de poids manquants dans le fichier':'ajoutez une colonne poids')+'</span></div>')+
        '<div><span class="n">'+fr(ok-okFrais)+' / '+fr(okFrais)+'</span><span class="t">livraisons éligibles en sec / en frais (Delipod Standard / Fresh)</span></div>'+
        '<div><span class="n">'+fr(tot-ok)+'</span><span class="t">'+(tot-ok>1?'livraisons qui restent':'livraison qui reste')+' en camion ou à étudier</span></div>'+
      '</div>';
      var why='<ul class="sim-r">'+
        (V.cp?'<li><span>Hors zone desservie ('+(st.zone==='ext'?V.n+' et proche banlieue':V.n+' intra-muros')+')</span><b>'+fr(hors)+'</b></li>':'')+
        '<li><span>Trop lourdes pour un Delipod</span><b>'+(pc?fr(lourd):'poids non renseigné')+'</b></li>'+
        '<li><span>Surgelé ou pharma : à étudier avec nous</span><b>'+fr(etude)+'</b></li>'+
        (sansCp?'<li><span>Sans code postal lisible</span><b>'+fr(sansCp)+'</b></li>':'')+
      '</ul>';
      var notes=[];
      if(!tc) notes.push('Température non précisée dans le fichier : livraisons comptées en <b>'+(st.prod==='frais'?'frais':'sec')+'</b> (réglage 3).');
      else if(tempLue<st.rows.length-sansCp-hors-lourd) notes.push('Température non reconnue sur certaines lignes : comptées en <b>'+(st.prod==='frais'?'frais':'sec')+'</b> (réglage 3).');
      if(pc&&st.unitInfo&&st.unitInfo.why==='big') notes.push('Les poids du fichier sont très élevés : ils sont lus en <b>grammes</b>. Changez l\'unité ci-dessus si ce sont des kilos.');
      if(pc&&st.unit==='kg'&&st.unitInfo&&st.unitInfo.big) notes.push('Poids très élevés : vérifiez l\'unité ci-dessus (kg, grammes ou tonnes).');
      var nt=notes.length?'<ul class="sim-warn">'+notes.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>':'';
      out.innerHTML=head+verdict+jl+tiles+why+nt+
        '<p class="sim-note">Résultat indicatif, issu d\'un premier tri automatique : ce n\'est pas un devis. Les créneaux, les points de ramasse, les lieux de dépôt et les coûts sont étudiés dans votre plan de transport.</p>';
      done('Fichier : '+st.name+(st.sheets&&st.sheets.length>1?' (onglet '+st.sheets[st.si].n+')':'')+'\nVille : '+V.n+(V.cp?' ('+(st.zone==='ext'?'avec proche banlieue':'intra-muros')+')':'')+
        '\nProduits par défaut : '+st.prod+' | Colonne température : '+(tc?st.head[st.map.temp]:'aucune')+
        '\nJours couverts : '+J+' ('+(st.joursSrc==='date'?'détecté':'saisi')+')\nLivraisons analysées : '+tot+' ('+fr(totJ,1)+' par jour)'+
        '\nÉligibles vélo-cargo : '+ok+' ('+fr(pct,0)+' %, '+fr(okJ,1)+' par jour, dont '+ext+' en proche banlieue)'+'\nDont frais : '+okFrais+
        '\nHeures de vélo par jour (interne) : '+fr(okJ/K.h,1)+
        (pc?'\nPoids : colonne '+st.head[st.map.poids]+' en '+st.unit+' | Chargements de Delipod par jour : '+sp+' ('+fr(poidsOk/J,0)+' kg, '+okSansPoids+' sans poids)':'\nPoids : non renseigné')+
        '\nHors zone : '+(V.cp?hors:'sans filtre')+' | Trop lourdes : '+(pc?lourd:'n.r.')+' | Surgelé ou pharma : '+etude+' | Sans code postal : '+sansCp+
        '\nVerdict : '+(ok===0?'vélo non adapté':(okJ<K.s?'pas encore assez de volume':'adapté à un premier test')));
    }
    function done(sum,ask){
      st.summary=sum; bind(); if(plan) plan.refresh();
    }
    function dl(name,txt){
      var b=new Blob(['﻿'+txt],{type:'text/csv;charset=utf-8'}), a=document.createElement('a');
      a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click();
      setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);
    }
    function template(){
      dl('modele-flux-delios.csv','Date;Code postal;Adresse;Poids (kg);Température\n2026-11-02;75011;12 rue de la Roquette;18;ambiant\n2026-11-02;75013;40 avenue d\'Italie;42;frais\n');
    }
    function demo(){
      var seed=7; function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
      var cps=r(75001,75020).concat(['92100','92200','93100','94200','92130','95100','91300']);
      var rows=[['Date','Code postal','Poids (kg)','Température']];
      for(var d=2;d<=6;d++) for(var i=0;i<62;i++){
        var cp=cps[Math.floor(rnd()*cps.length)], p=Math.round(4+rnd()*45);
        if(rnd()<0.04) p=Math.round(180+rnd()*200);
        var t=rnd()<0.35?'frais':(rnd()<0.06?'surgelé':'ambiant');
        rows.push(['2026-11-0'+d,cp,String(p),t]);
      }
      st.name='exemple-fictif.csv'; st.file=null; st.ville='paris'; $('ville').value='paris'; zh();
      setSheets([{n:'exemple',rows:rows}]);
    }
  }

  function planForm(host,st){
    host.innerHTML=
      '<form class="sim-pf" novalidate>'+
        '<p class="sim-hp" aria-hidden="true"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>'+
        '<label class="sim-pl"><span>Email professionnel *</span><input type="email" name="email" required autocomplete="email" placeholder="vous@societe.com"></label>'+
        '<div class="sim-p2"><label class="sim-pl"><span>Nom</span><input type="text" name="nom" autocomplete="name"></label>'+
        '<label class="sim-pl"><span>Société</span><input type="text" name="societe" autocomplete="organization"></label></div>'+
        '<label class="sim-pl"><span>Téléphone</span><input type="tel" name="telephone" autocomplete="tel"></label>'+
        '<label class="sim-ck" data-p="ck" hidden><input type="checkbox" name="joindre"> <span>Joindre mon fichier <b data-p="fn"></b> pour que l\'équipe prépare le plan</span></label>'+
        '<p class="sim-ps" data-p="st">Sans résultat de simulation, décrivez votre flux par retour d\'email.</p>'+
        '<button type="submit" class="btn p">Recevoir mon plan de transport</button>'+
        '<p class="sim-pm">Votre email sert uniquement à vous envoyer votre plan de transport et à en parler avec vous.</p>'+
        '<p class="sim-po" data-p="msg" aria-live="polite"></p>'+
      '</form>';
    var f=host.querySelector('form'); function q(n){return host.querySelector('[data-p="'+n+'"]');}
    function refresh(){
      if(!f.isConnected) return;
      q('st').textContent=st.summary?'Le résultat de votre simulation est joint à la demande.':(st.file?'Simulation non terminée : votre demande partira sans résultat.':'Sans résultat de simulation, décrivez votre flux par retour d\'email.');
      var ck=q('ck'); ck.hidden=!st.file; if(st.file) q('fn').textContent='('+st.file.name+')';
    }
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var em=f.email.value.trim(), m=q('msg');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ m.className='sim-po err'; m.textContent='Indiquez une adresse email valide pour recevoir le plan.'; f.email.focus(); return; }
      var fd=new FormData();
      fd.append('form-name','plan-transport'); fd.append('bot-field',f['bot-field'].value);
      fd.append('email',em); fd.append('nom',f.nom.value.trim()); fd.append('societe',f.societe.value.trim()); fd.append('telephone',f.telephone.value.trim());
      fd.append('ville',(VILLES[st.ville]||{}).n||''); fd.append('resultat',st.summary||'Pas de simulation terminée.');
      var withFile=!!(st.file&&f.joindre.checked); if(withFile) fd.append('fichier',st.file,st.file.name);
      var btn=f.querySelector('button'); btn.disabled=true; m.className='sim-po'; m.textContent='Envoi en cours…';
      var opt={method:'POST',body:withFile?fd:new URLSearchParams(fd).toString()};
      if(!withFile) opt.headers={'Content-Type':'application/x-www-form-urlencoded'};
      fetch('/',opt).then(function(r){
        if(!r.ok) throw new Error(r.status);
        host.innerHTML='<div class="sim-ok"><p class="sim-okt">Demande reçue.</p><p>On vous répond en moins d\'une heure (du lundi au vendredi, de 8 h à 19 h) et votre plan de transport arrive sous 24 h à <b></b>.</p></div>';
        host.querySelector('b').textContent=em;
      }).catch(function(){
        btn.disabled=false; m.className='sim-po err'; m.textContent='L\'envoi n\'a pas abouti. Réessayez, ou écrivez à sales@toncarton.com.';
      });
    });
    refresh();
    return {refresh:refresh};
  }
  function scan(){ var els=document.querySelectorAll('#sim-app'); for(var i=0;i<els.length;i++){ if(!els[i].__sim){ els[i].__sim=true; try{ init(els[i]); }catch(e){ if(window.console)console.warn('sim',e); } } } }
  function boot(){ scan(); try{ new MutationObserver(function(){ scan(); }).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){} var n=0, iv=setInterval(function(){scan(); if(++n>40)clearInterval(iv);},500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
