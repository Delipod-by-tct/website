/* Accueil V4 : trajet animé + cas d'usage (visée des fonctions), limités aux conteneurs .pha */
(function(){
  var REDUCE=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  function init(root){
    root.classList.add('js');




  /* trajet : le Delipod voyage du quai au client */
  var rt=root.querySelector('#rt'),rp=root.querySelector('#rprt');
  if(rt){ var li=[].slice.call(rt.querySelectorAll('.rts li')),cur=0,timer=null;
  function show(i){cur=i;rt.style.setProperty('--mi',i);li.forEach(function(x,k){x.classList.toggle('on',k<=i)})}
  function stop(){clearInterval(timer);timer=null}
  function play(){stop();show(0);if(REDUCE){show(4);return}
    timer=setInterval(function(){if(cur>=4){stop();return}show(cur+1)},1300)}
  li.forEach(function(x,k){x.style.cursor='pointer';x.addEventListener('click',function(){stop();show(k)})});
  rp.addEventListener('click',play);
  if(REDUCE){show(4);rp.hidden=true}
  else if('IntersectionObserver' in window){var once=false;new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!once){once=true;play()}})},{threshold:.35}).observe(rt)}
  else{show(4)} }
  /* cas d'usage : on vise une fonction */
  var gt=[].slice.call(root.querySelectorAll('.gt')),panels=[].slice.call(root.querySelectorAll('.cs'));
  if(!panels.length) return;
  var touched=false,cur2=0,SVGNS='http://www.w3.org/2000/svg';
  function setOn(p,t){
    var a=p.querySelector('.aim');
    [].forEach.call(p.querySelectorAll('[data-t]'),function(e){e.classList.toggle('on',t!==null&&e.getAttribute('data-t')==t)});
    a.classList.toggle('f',t!==null);
  }
  function lines(p){
    var a=p.querySelector('.aim'),ln=a.querySelector('.ln');
    if(getComputedStyle(ln).display==='none')return;
    var ar=a.getBoundingClientRect();if(!ar.width)return;
    ln.setAttribute('viewBox','0 0 '+ar.width+' '+ar.height);
    ln.innerHTML='';
    [].forEach.call(a.querySelectorAll('.al li'),function(li,i){
      var t=li.getAttribute('data-t'),g=a.querySelector('.tg[data-t="'+t+'"] .dt');if(!g)return;
      var lr=li.getBoundingClientRect(),gr=g.getBoundingClientRect(),left=li.parentNode.classList.contains('l');
      var ax=(left?lr.right:lr.left)-ar.left+(left?4:-4),ay=lr.top+lr.height/2-ar.top;
      var tx=gr.left+gr.width/2-ar.left,ty=gr.top+gr.height/2-ar.top,kx=ax+(left?22:-22);
      var d='M'+ax+' '+ay+'H'+kx+'L'+tx+' '+ty;
      var G=document.createElementNS(SVGNS,'g');G.setAttribute('class','lg '+li.className.replace(/\bon\b/,'').trim());G.setAttribute('data-t',t);
      var o=document.createElementNS(SVGNS,'path'),c=document.createElementNS(SVGNS,'path'),dot=document.createElementNS(SVGNS,'circle');
      o.setAttribute('class','o');c.setAttribute('class','c');o.setAttribute('d',d);c.setAttribute('d',d);
      dot.setAttribute('cx',ax);dot.setAttribute('cy',ay);dot.setAttribute('r',3.5);
      G.appendChild(o);G.appendChild(c);G.appendChild(dot);ln.appendChild(G);
      var L=Math.ceil(c.getTotalLength())+2;G.style.setProperty('--L',L);G.style.setProperty('--d',(i*0.09)+'s');
    });
  }
  function launch(p){
    p.classList.remove('go');lines(p);
    if(REDUCE){p.classList.add('go');return}
    requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('go')})});
  }
  function active(){return panels.filter(function(p){return !p.hidden})[0]}
  function wire(p){
    var a=p.querySelector('.aim');
    [].forEach.call(a.querySelectorAll('.al li'),function(li){
      var t=li.getAttribute('data-t');
      li.addEventListener('mouseenter',function(){touched=true;setOn(p,t)});
      li.addEventListener('focus',function(){touched=true;setOn(p,t)});
      li.addEventListener('click',function(){touched=true;setOn(p,t)});
      li.addEventListener('mouseleave',function(){setOn(p,null)});
      li.addEventListener('blur',function(){setOn(p,null)});
    });
    [].forEach.call(a.querySelectorAll('.tg'),function(g){
      var t=g.getAttribute('data-t');
      g.addEventListener('mouseenter',function(){touched=true;setOn(p,t)});
      g.addEventListener('mouseleave',function(){setOn(p,null)});
      g.addEventListener('click',function(){touched=true;setOn(p,t)});
    });
  }
  panels.forEach(wire);
  gt.forEach(function(b,k){b.addEventListener('click',function(){
    gt.forEach(function(x,j){x.classList.toggle('on',j===k);x.setAttribute('aria-selected',j===k);panels[j].hidden=(j!==k);if(j!==k)setOn(panels[j],null)});
    cur2=-1;launch(panels[k]);
  })});
  /* première apparition : les lignes se tracent quand la section entre à l'écran */
  var first=active(),seen=false;
  lines(first);
  if(REDUCE||!('IntersectionObserver' in window)){first.classList.add('go')}
  else{new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!seen){seen=true;launch(active())}})},{threshold:.3}).observe(first.querySelector('.aim'))}
  /* balayage automatique tant que personne n'a rien touché */
  if(!REDUCE){setInterval(function(){
    var p=active();if(!p||touched||!p.classList.contains('go'))return;
    var r=p.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
    var n=p.querySelectorAll('.al li').length;cur2=(cur2+1)%n;setOn(p,String(cur2));
  },2400)}
  function redo(){var p=active();if(p){var g=p.classList.contains('go');lines(p);if(g)p.classList.add('go')}}
  var rz;window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(redo,120)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(redo);
  window.addEventListener('load',redo);

  }
  function scan(){ var els=document.querySelectorAll('.pha'); for(var i=0;i<els.length;i++){ if(!els[i].__pg){ els[i].__pg=true; try{ init(els[i]); }catch(e){ console.warn('pha',e); } } } }
  var pending=false;
  function boot(){ new MutationObserver(function(){ if(!pending){ pending=true; requestAnimationFrame(function(){ pending=false; scan(); }); } }).observe(document.documentElement,{childList:true,subtree:true}); scan(); setInterval(scan,500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
