/* Commande Delipod : configuration → coordonnées → récapitulatif et règlement.
   1. La commande est envoyée à Netlify Forms (formulaire « commande ») : elle arrive dans
      Netlify > Forms et par e-mail si la notification est activée.
   2. Carte bancaire : redirection vers Stripe Checkout via /.netlify/functions/checkout
      (clé STRIPE_SECRET_KEY à renseigner dans Netlify). Aucune donnée de carte ne transite par le site.
   3. Virement : la commande est enregistrée, la facture d'acompte part sous 24 h. */
(function(){
  var PAY_ENDPOINT = '/.netlify/functions/checkout';
  var DEPOSIT = 0.5, VAT = 0.2;
  var P={std:2000,fresh:3000},N={std:'Delipod Standard',fresh:'Delipod Fresh'};
  var IMG={std:'assets/v4/pod-neutre.png',fresh:'assets/v4/pod-fresh.png'};
  var st={v:'std',q:1,step:1,info:{},ref:''};
  function $(s){return document.querySelector(s)}
  function eur(n){return n.toLocaleString('fr-FR',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+' €'}
  function rem(q){return q>=11?.10:q>=6?.05:0}
  function sub(q){return q>=50?3.75:q>=21?4:q>=6?4.5:5}
  function unit(){return P[st.v]*(1-rem(st.q))}
  function total(){return unit()*st.q}
  function depTTC(){return Math.round(total()*DEPOSIT*(1+VAT)*100)/100}
  function opts(){return [].slice.call(document.querySelectorAll('#ord input[name="opt"]:checked')).map(function(i){return i.value})}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  function step(n){
    st.step=n; var m=$('#ord'); if(!m) return;
    m.querySelectorAll('.ord-view').forEach(function(v){v.classList.toggle('on',v.getAttribute('data-view')===String(n))});
    m.querySelectorAll('#ord-steps li').forEach(function(l){l.classList.toggle('on',+l.getAttribute('data-s')<=Math.min(n,3))});
    var im=$('#ord-im'); if(im) im.style.display=n===1?'':'none';
    var p=m.querySelector('.ord-p'); if(p) p.scrollTop=0;
    if(n===3) recap();
    var f=m.querySelector('.ord-view.on input:not([type=radio]):not([type=checkbox])'); if(f&&n===2) setTimeout(function(){f.focus()},60);
  }
  function recap(){
    var c=st.info, o=opts();
    var rows=[['Version',N[st.v]+' × '+st.q],['Prix unitaire',eur(unit())+' HT'+(rem(st.q)?' (−'+rem(st.q)*100+' %)':'')],['Total conteneurs',eur(total())+' HT'],['Options',o.length?o.join(', ')+' (sur devis)':'Aucune'],['Abonnement plateforme',eur(sub(st.q)*st.q)+' HT / mois'],['Société',c.societe+' · SIRET '+c.siret],['Livraison',c.adresse+', '+c.cp+' '+c.ville]];
    $('#ord-rc').innerHTML=rows.map(function(r){return '<div><span>'+esc(r[0])+'</span><b>'+esc(r[1])+'</b></div>'}).join('');
    $('#ord-dep').textContent=eur(depTTC())+' TTC';
    $('#ord-dep-n').textContent='soit '+eur(total()*DEPOSIT)+' HT + TVA 20 %. Le solde est réglé à la livraison.';
  }

  function render(){
    var m=$('#ord'); if(!m) return;
    m.querySelectorAll('[data-v]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-v')===st.v))});
    var im=$('#ord-im'); if(im){ im.style.backgroundImage='url('+IMG[st.v]+')'; }
    var fo=m.querySelector('.ord-fo'); if(fo){fo.style.display=st.v==='fresh'?'flex':'none'; if(st.v!=='fresh'){var i=fo.querySelector('input'); if(i) i.checked=false;}}
    var r=rem(st.q),pu=unit();
    $('#ord-n').textContent=st.q;
    $('#ord-tier').textContent=r?'Palier −'+(r*100)+' % appliqué':'Remise dès 6 conteneurs';
    $('#ord-pu').textContent=eur(pu)+' HT';
    $('#ord-rm').textContent=r?'−'+(r*100)+' %':'—';
    $('#ord-tt').textContent=eur(pu*st.q)+' HT';
    $('#ord-ab').textContent=eur(sub(st.q)*st.q)+' HT / mois';
    var fl=m.querySelector('.ord-sum .flag'); if(fl){ fl.textContent='Acompte 50 % · '+eur(pu*st.q*DEPOSIT)+' HT'; }
  }

  /* ---- validation ---- */
  function siretOk(s){ if(!/^\d{14}$/.test(s)) return false; var t=0; for(var i=0;i<14;i++){ var d=+s[i]; if(i%2===0){d*=2;if(d>9)d-=9} t+=d } return t%10===0 || /^356000000/.test(s) }
  function bad(f,name,msg,errEl){var i=f.elements[name]; if(i){ i.setAttribute('aria-invalid','true'); i.focus(); } errEl.textContent=msg; return false}
  function clear(f){[].forEach.call(f.elements,function(i){i.removeAttribute&&i.removeAttribute('aria-invalid')})}
  function check2(f){
    var e=$('#ord-e2'); clear(f); e.textContent='';
    var req=['prenom','nom','societe','siret','email','tel','adresse','cp','ville'];
    for(var k=0;k<req.length;k++){ if(!f.elements[req[k]].value.trim()) return bad(f,req[k],'Merci de renseigner tous les champs obligatoires.',e); }
    var siret=f.elements.siret.value.replace(/\s/g,'');
    if(!siretOk(siret)) return bad(f,'siret','SIRET invalide : 14 chiffres attendus.',e);
    var tva=f.elements.tva.value.replace(/\s/g,'').toUpperCase();
    if(tva && !/^FR[0-9A-Z]{2}\d{9}$/.test(tva)) return bad(f,'tva','N° de TVA au format FR + 11 caractères.',e);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.elements.email.value.trim())) return bad(f,'email','Adresse e-mail invalide.',e);
    if(f.elements.tel.value.replace(/\D/g,'').length<9) return bad(f,'tel','Numéro de téléphone incomplet.',e);
    if(!/^\d{5}$/.test(f.elements.cp.value.trim())) return bad(f,'cp','Code postal à 5 chiffres.',e);
    if(!f.elements.cgv.checked){ e.textContent='Merci d\'accepter les conditions générales de vente.'; return false; }
    req.concat(['tva']).forEach(function(k){st.info[k]=f.elements[k].value.trim()});
    st.info.siret=siret; st.info.tva=tva;
    return true;
  }

  /* ---- envoi ---- */
  function record(pm){
    st.ref=st.ref||('DLP-'+Date.now().toString(36).toUpperCase());
    var c=st.info, d={'form-name':'commande',ref:st.ref,version:N[st.v],quantite:st.q,options:opts().join(', ')||'aucune',total_ht:total().toFixed(2),acompte_ttc:depTTC().toFixed(2),reglement:pm,prenom:c.prenom,nom:c.nom,societe:c.societe,siret:c.siret,tva:c.tva,email:c.email,tel:c.tel,adresse:c.adresse,cp:c.cp,ville:c.ville};
    var body=Object.keys(d).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(d[k])}).join('&');
    return fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body}).then(function(r){ if(!r.ok) throw new Error('form '+r.status); });
  }
  function mailFallback(pm){
    var c=st.info;
    var b='Commande '+st.ref+'\n\n'+N[st.v]+' × '+st.q+'\nOptions : '+(opts().join(', ')||'aucune')+'\nTotal : '+eur(total())+' HT\nAcompte : '+eur(depTTC())+' TTC\nRèglement : '+pm+'\n\n'+c.prenom+' '+c.nom+' · '+c.societe+' (SIRET '+c.siret+(c.tva?', TVA '+c.tva:'')+')\n'+c.email+' · '+c.tel+'\nLivraison : '+c.adresse+', '+c.cp+' '+c.ville+'\n';
    location.href='mailto:contact@delipod.com?subject='+encodeURIComponent('Commande '+st.ref+' · '+N[st.v]+' × '+st.q)+'&body='+encodeURIComponent(b);
  }
  function done(msg){ $('#ord-okt').textContent=msg; step(4); }
  function submit3(f){
    var btn=$('#ord-paybtn'), e=$('#ord-e3'), pm=(f.elements.pm&&f.elements.pm.value)||'carte';
    e.textContent=''; btn.disabled=true; btn.textContent='Envoi en cours…';
    var reset=function(){ btn.disabled=false; btn.textContent='Valider et payer l\'acompte'; };
    record(pm).then(function(){
      if(pm==='virement'){ reset(); done('Commande '+st.ref+' enregistrée. Nous vous envoyons la facture d\'acompte et le RIB à '+st.info.email+' sous 24 heures.'); return; }
      btn.textContent='Redirection vers le paiement…';
      return fetch(PAY_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({v:st.v,q:st.q,options:opts(),client:st.info,ref:st.ref})})
        .then(function(r){ return r.json().then(function(d){ if(r.ok&&d.url){ location.href=d.url; return; } throw new Error((d&&d.error)||'paiement'); }); })
        .catch(function(){ reset(); e.textContent='Votre commande '+st.ref+' est bien enregistrée, mais le paiement par carte est indisponible pour le moment. Choisissez le virement ou réessayez dans quelques minutes.'; });
    }).catch(function(){
      reset(); e.textContent='Envoi impossible depuis cet aperçu. Un e-mail récapitulatif va s\'ouvrir pour transmettre la commande.';
      setTimeout(function(){ mailFallback(pm); },1400);
    });
  }

  function open(v){var m=$('#ord'); if(!m) return; st.v=v==='fresh'?'fresh':'std'; render(); step(1); m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.documentElement.style.overflow='hidden';}
  function close(){var m=$('#ord'); if(!m) return; m.classList.remove('open'); m.setAttribute('aria-hidden','true'); document.documentElement.style.overflow='';}

  /* retour depuis Stripe */
  function landing(){
    var q=new URLSearchParams(location.search), s=q.get('commande'); if(!s) return;
    var tick=function(n){ if(!$('#ord')){ if(n<40) setTimeout(function(){tick(n+1)},150); return; }
      var m=$('#ord'); m.classList.add('open'); m.setAttribute('aria-hidden','false');
      if(s==='ok') done('Paiement de l\'acompte reçu pour la commande '+(q.get('ref')||'')+'. Vous recevez le reçu Stripe par e-mail ; nous revenons vers vous sous 24 heures pour planifier la livraison.');
      else { $('#ord-okt').textContent='Le paiement a été annulé, rien n\'a été débité. Votre commande reste enregistrée : vous pouvez la régler par virement ou nous écrire.'; step(4); }
      history.replaceState(null,'',location.pathname);
    }; tick(0);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',landing); else landing();

  document.addEventListener('click',function(e){
    var t=e.target;
    var o=t.closest&&t.closest('[data-order]');
    if(o){e.preventDefault(); open(o.getAttribute('data-order')); return;}
    var m=$('#ord'); if(!m||!m.classList.contains('open')) return;
    if(t===m||(t.closest&&t.closest('#ord [data-close]'))){close(); return;}
    if(t.closest&&t.closest('#ord [data-cgv]')){ close(); if(window.__nav&&window.__nav.cgv) window.__nav.cgv(); else location.href='cgv'; return; }
    var nx=t.closest&&t.closest('#ord [data-next]'); if(nx){ step(+nx.getAttribute('data-next')); return; }
    var v=t.closest&&t.closest('#ord [data-v]'); if(v){st.v=v.getAttribute('data-v'); render(); return;}
    var q=t.closest&&t.closest('#ord [data-q]'); if(q){st.q=Math.max(1,Math.min(99,st.q+parseInt(q.getAttribute('data-q'),10))); render(); return;}
  });
  document.addEventListener('submit',function(e){
    var f=e.target; if(!f||!f.closest||!f.closest('#ord')) return;
    e.preventDefault();
    if(f.id==='ord-f2'){ if(check2(f)) step(3); }
    if(f.id==='ord-f3'){ submit3(f); }
  });
  document.addEventListener('input',function(e){
    var i=e.target; if(!i||!i.closest||!i.closest('#ord')) return;
    if(i.name==='siret'){ i.value=i.value.replace(/\D/g,'').slice(0,14); }
    if(i.name==='cp'){ i.value=i.value.replace(/\D/g,'').slice(0,5); }
    if(i.name==='tva'){ i.value=i.value.toUpperCase().replace(/[^0-9A-Z]/g,'').slice(0,13); }
    i.removeAttribute('aria-invalid');
  });
  document.addEventListener('change',function(e){ if(e.target&&e.target.name==='opt') render(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
})();
