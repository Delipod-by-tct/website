/* Delitronic : page intégrée dans la V4, scripts limités au conteneur .pdt */
(function(){
  function init(root){
    function __id(i){ return root.querySelector('[id="'+i+'"]'); }

(function(){
   root.classList.add('js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.querySelector('header');
  function setNav(){ if(nav) root.style.setProperty('--navh', nav.offsetHeight+'px'); }
  setNav(); window.addEventListener('resize',setNav);

  /* hero : le mot du titre change */
  var rw=__id('rw');
  if(rw&&!reduce){
    var ws=[].slice.call(rw.children), wi=0, wt=null, wv=true;
    function wnext(){
      if(!wv) return;
      var o=ws[wi]; wi=(wi+1)%ws.length; var n=ws[wi];
      o.classList.remove('on'); o.classList.add('out');
      n.classList.remove('out'); n.classList.add('on');
      setTimeout(function(){ o.classList.remove('out'); },700);
    }
    wt=setInterval(wnext,2300);
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ wv=es[0].isIntersecting; },{threshold:0}).observe(rw); }
  }

  /* hero : points sur la photo, liés à la légende */
  var hs=[].slice.call(root.querySelectorAll('#stg .hs')), lg=[].slice.call(root.querySelectorAll('#stg .lgd li'));
  function heroSet(i){
    hs.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-i')===i); });
    lg.forEach(function(l){ l.classList.toggle('on', l.getAttribute('data-i')===i); });
  }
  var heroPin=null;
  hs.concat(lg).forEach(function(el){
    var i=el.getAttribute('data-i');
    el.addEventListener('mouseenter',function(){ heroSet(i); });
    el.addEventListener('mouseleave',function(){ heroSet(heroPin); });
    el.addEventListener('focus',function(){ heroSet(i); });
    el.addEventListener('blur',function(){ heroSet(heroPin); });
    el.addEventListener('click',function(){ heroPin=(heroPin===i)?null:i; heroSet(heroPin); });
  });
  hs.forEach(function(b){ b.setAttribute('aria-pressed','false'); });

  /* schéma éclaté : projection isométrique, écrite à la main */
  var svg=__id('dg'), wrap=__id('dgw'), tagBox=__id('tags');
  if(svg&&wrap&&tagBox){
    var NS='http://www.w3.org/2000/svg', S=30;
    var PRE={xl9:[10,7,7],sec:[8,4,8],own:[9,6,5]};
    var DW=15, DD=9, DZ0=1.2, DZ1=1.7, ZB=2.2, ZT=3.2;
    var DZC=3.6, DZ1X=1.8, DPV=2.2, DY=3.4;
    var NAMES={deck:'Remorque',chassis:'Châssis',cont:'Conteneur',box:'Boîtier',pv:'Panneau'};
    var NUM={deck:1,cont:2,chassis:3,box:4,pv:5};
    var ORDER=['deck','chassis','cont','box','pv'];
    function P(x,y,z){ return [(x-y)*0.866*S,(x+y)*0.5*S - z*S]; }
    function el(n,a,p){ var e=document.createElementNS(NS,n); for(var k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e; }
    function poly(g,pts,cls,closed){
      var s=pts.map(function(p){ var q=P(p[0],p[1],p[2]); return q[0].toFixed(1)+','+q[1].toFixed(1); }).join(' ');
      el(closed===false?'polyline':'polygon',{points:s,'class':cls},g);
      return pts;
    }
    function box(g,x,y,z,w,d,h,fl,fr,ft,ed){
      poly(g,[[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],fl+' '+ed);
      poly(g,[[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],fr+' '+ed);
      poly(g,[[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],ft+' '+ed);
    }
    function circ(g,xc,y,zc,r,cls){
      var pts=[]; for(var i=0;i<24;i++){ var t=i/24*Math.PI*2; pts.push([xc+r*Math.cos(t),y,zc+r*Math.sin(t)]); }
      poly(g,pts,cls);
    }
    function line(g,a,b,cls){ poly(g,[a,b],cls,false); }

    var cur=null, ext=null, exploded=false, t=0, anim=null, active=null, pinned=null, userTouched=false;
    var groups={}, tags={}, cab=null, prog={};

    function geom(k){
      var c=PRE[k], cx=c[0], cy=c[1], cz=c[2];
      var cx0=(DW-cx)/2+0.4, cy0=(DD-cy)/2;
      return {cx:cx,cy:cy,cz:cz,cx0:cx0,cy0:cy0,
        bx:cx0+cx*0.5-1.1, by:cy0+cy, bz:ZT+cz-2.3, bw:2.2, bd:0.7, bh:1.5,
        px:cx0+cx*0.1, py:cy0+cy*0.1, pw:cx*0.8, pd:cy*0.8, pz:ZT+cz};
    }
    function offsets(g,p){
      return {deck:[0,0,0],chassis:[0,0,p.chassis*DZ1X],cont:[0,0,p.cont*DZC],box:[0,p.box*DY,p.cont*DZC],pv:[0,0,p.cont*DZC+p.pv*DPV]};
    }
    function pOf(tt){
      function seg(a,b){ var v=(tt-a)/(b-a); v=Math.max(0,Math.min(1,v)); return v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2; }
      return {chassis:seg(0,.7),cont:seg(.12,.82),box:seg(.3,1),pv:seg(.3,1)};
    }
    function build(k){
      var g=geom(k); cur=k;
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      tagBox.innerHTML=''; groups={}; tags={};
      var G={};
      ORDER.forEach(function(n){ G[n]=el('g',{'class':'o '+n,'data-l':n},null); groups[n]=G[n]; });
      /* remorque */
      var d=G.deck;
      circ(d,9.5,-0.3,DZ0,1.2,'wh'); circ(d,9.5,-0.3,DZ0,0.35,'hub');
      box(d,0,0,DZ0,DW,DD,DZ1-DZ0,'fl','fr','ft','ed');
      line(d,[0,DD/2,1.45],[-5,DD/2,1.45],'db');
      circ(d,9.5,DD+0.3,DZ0,1.2,'wh'); circ(d,9.5,DD+0.3,DZ0,0.35,'hub');
      /* châssis */
      var c=G.chassis, x0=g.cx0-0.3, y0=g.cy0-0.3, w=g.cx+0.6, dd=g.cy+0.6;
      [[x0+w-.4,y0+.4],[x0+.4,y0+.4],[x0+w-.4,y0+dd-.4],[x0+.4,y0+dd-.4]].forEach(function(q){
        line(c,[q[0],q[1],ZB],[q[0],q[1],DZ1+0.38],'ew'); circ(c,q[0],q[1],DZ1+0.38,0.38,'cs');
      });
      poly(c,[[x0,y0,ZT],[x0+w,y0,ZT],[x0+w,y0+dd,ZT],[x0,y0+dd,ZT]],'ftop');
      poly(c,[[x0,y0,ZB],[x0+w,y0,ZB],[x0+w,y0+dd,ZB],[x0,y0+dd,ZB]],'ew');
      [[x0,y0],[x0+w,y0],[x0+w,y0+dd],[x0,y0+dd]].forEach(function(q){ line(c,[q[0],q[1],ZB],[q[0],q[1],ZT],'ew'); });
      poly(c,[[x0,y0,ZT],[x0+w,y0,ZT],[x0+w,y0+dd,ZT],[x0,y0+dd,ZT]],'ew');
      [0.3,0.7].forEach(function(f){ line(c,[x0+w*f,y0,ZB],[x0+w*f,y0+dd,ZB],'bar'); });
      /* conteneur */
      var k2=G.cont;
      box(k2,g.cx0,g.cy0,ZT,g.cx,g.cy,g.cz,'fl','fr','ft','ed');
      var xr=g.cx0+g.cx, ym=g.cy0+g.cy*0.5;
      line(k2,[xr,ym,ZT+.2],[xr,ym,ZT+g.cz],'dr');
      line(k2,[xr,ym+.5,ZT+g.cz*.42],[xr,ym+.5,ZT+g.cz*.6],'hd');
      /* boîtier */
      var b=G.box;
      box(b,g.bx,g.by,g.bz,g.bw,g.bd,g.bh,'fl','fr','ft','ed');
      var yb=g.by+g.bd;
      poly(b,[[g.bx+.35,yb,g.bz+g.bh-.55],[g.bx+.65,yb,g.bz+g.bh-.55],[g.bx+.65,yb,g.bz+g.bh-.25],[g.bx+.35,yb,g.bz+g.bh-.25]],'led');
      /* panneau */
      var v=G.pv;
      box(v,g.px,g.py,g.pz,g.pw,g.pd,0.2,'fl','fr','ft','ed');
      var zt=g.pz+0.2;
      for(var i=1;i<4;i++) line(v,[g.px+g.pw*i/4,g.py,zt],[g.px+g.pw*i/4,g.py+g.pd,zt],'cell');
      for(var j=1;j<3;j++) line(v,[g.px,g.py+g.pd*j/3,zt],[g.px+g.pw,g.py+g.pd*j/3,zt],'cell');
      /* ordre de peinture */
      cab=el('line',{'class':'cab'},null);
      [G.deck,G.chassis,G.cont,G.box,G.pv].forEach(function(n){ svg.appendChild(n); });
      svg.appendChild(cab);
      g._anchors={
        deck:[4.5,DD,1.45], chassis:[x0+w*0.12,y0+dd,2.7], cont:[g.cx0+g.cx*0.86,g.cy0+g.cy,ZT+g.cz*0.42],
        box:[g.bx-0.2,g.by+g.bd,g.bz+g.bh*0.5], pv:[g.px+g.pw*0.5,g.py+g.pd*0.5,g.pz+0.2]
      };
      g._rt={deck:false,chassis:false,cont:false,box:false,pv:false};
      ORDER.forEach(function(n){
        var tg=document.createElement('button'); tg.type='button'; tg.className='tg'; tg.setAttribute('data-l',n); tg.setAttribute('tabindex','-1');
        tg.innerHTML='<b>'+NUM[n]+'</b><span>'+NAMES[n]+'</span>';
        tagBox.appendChild(tg); tags[n]=tg; bindTag(tg,n);
      });
      svg.__g=g;
      computeExtent(); render(t); applyActive();
    }
    function computeExtent(){
      var xs=[],ys=[];
      var all=[0,1];
      var keys=['xl9','sec','own'];
      keys.forEach(function(k){
        var g=geom(k);
        all.forEach(function(tt){
          var pr=(tt===0)?{chassis:0,cont:0,box:0,pv:0}:{chassis:1,cont:1,box:1,pv:1};
          var o=offsets(g,pr);
          var pts=[[-5,DD/2,1.45,'deck'],[0,0,DZ0-1.2,'deck'],[DW,DD+1.5,0,'deck'],[DW+.2,-1.5,0,'deck'],
            [g.cx0-.3,g.cy0-.3,0,'chassis'],[g.cx0+g.cx+.3,g.cy0+g.cy+.3,0,'chassis'],
            [g.cx0,g.cy0,ZT,'cont'],[g.cx0+g.cx,g.cy0+g.cy,ZT+g.cz,'cont'],[g.cx0,g.cy0+g.cy,ZT+g.cz,'cont'],[g.cx0+g.cx,g.cy0,ZT,'cont'],
            [g.bx-1.4,g.by+g.bd,g.bz,'box'],[g.bx+g.bw,g.by+g.bd,g.bz+g.bh,'box'],
            [g.px,g.py,g.pz+.2,'pv'],[g.px+g.pw,g.py+g.pd,g.pz+.2,'pv'],[g.px,g.py+g.pd,g.pz+.2,'pv'],[g.px+g.pw,g.py,g.pz+.2,'pv']];
          pts.forEach(function(p){ var of=o[p[3]]; var q=P(p[0]+of[0],p[1]+of[1],p[2]+of[2]); xs.push(q[0]); ys.push(q[1]); });
        });
      });
      var padx=60, pady=34;
      var x0=Math.min.apply(null,xs)-padx, x1=Math.max.apply(null,xs)+padx, y0=Math.min.apply(null,ys)-pady, y1=Math.max.apply(null,ys)+pady;
      ext={x:x0,y:y0,w:x1-x0,h:y1-y0};
      svg.setAttribute('viewBox',ext.x.toFixed(0)+' '+ext.y.toFixed(0)+' '+ext.w.toFixed(0)+' '+ext.h.toFixed(0));
      wrap.style.setProperty('--ar',(ext.w/ext.h).toFixed(3));
    }
    function render(tt){
      var g=svg.__g, p=pOf(tt), o=offsets(g,p), o0=P(0,0,0);
      ORDER.forEach(function(n){
        var q=P(o[n][0],o[n][1],o[n][2]);
        groups[n].setAttribute('transform','translate('+(q[0]-o0[0]).toFixed(1)+' '+(q[1]-o0[1]).toFixed(1)+')');
        var a=g._anchors[n], s=P(a[0]+o[n][0],a[1]+o[n][1],a[2]+o[n][2]);
        tags[n].style.left=((s[0]-ext.x)/ext.w*100).toFixed(2)+'%';
        tags[n].style.top=((s[1]-ext.y)/ext.h*100).toFixed(2)+'%';
      });
      /* câble : du haut du boîtier au bord du panneau */
      var a=P(g.bx+g.bw/2+o.box[0],g.by+g.bd/2+o.box[1],g.bz+g.bh+o.box[2]);
      var b=P(g.bx+g.bw/2+o.pv[0],g.py+g.pd+o.pv[1],g.pz+0.1+o.pv[2]);
      cab.setAttribute('x1',a[0].toFixed(1));cab.setAttribute('y1',a[1].toFixed(1));cab.setAttribute('x2',b[0].toFixed(1));cab.setAttribute('y2',b[1].toFixed(1));
      cab.style.opacity=tt>0.02?1:0;
    }
    function go(target,done){
      if(anim) cancelAnimationFrame(anim);
      exploded=target>0.5; syncBtn();
      wrap.classList.toggle('expd',exploded);
      if(reduce){ t=target; render(t); if(done) done(); return; }
      var from=t, dur=1500*Math.abs(target-from)+1, start=null;
      function step(ts){
        if(start===null) start=ts;
        var u=Math.min(1,(ts-start)/dur); t=from+(target-from)*u; render(t);
        if(u<1) anim=requestAnimationFrame(step); else { anim=null; if(done) done(); }
      }
      anim=requestAnimationFrame(step);
    }
    var btn=__id('expl');
    function syncBtn(){ btn.setAttribute('aria-pressed',exploded?'true':'false'); btn.textContent=exploded?'Assembler':'Éclater'; cab&&cab.classList.toggle('run',exploded&&!reduce); }

    /* surbrillance couche / carte / étiquette */
    var cards=[].slice.call(root.querySelectorAll('.lc'));
    function applyActive(){
      ORDER.forEach(function(n){
        var on=active===n;
        groups[n].classList.toggle('dim',!!active&&!on);
        groups[n].classList.toggle('hl',on);
        tags[n].classList.toggle('on',on);
      });
      cab.style.opacity=(t>0.02&&(!active||active==='box'||active==='pv'))?1:(t>0.02?0.15:0);
      cards.forEach(function(c){ c.classList.toggle('on',c.getAttribute('data-l')===active); });
    }
    function setActive(n){ active=n; applyActive(); }
    function bindTag(tg,n){
      tg.addEventListener('mouseenter',function(){ userTouched=true; setActive(n); });
      tg.addEventListener('mouseleave',function(){ setActive(pinned); });
      tg.addEventListener('click',function(){ userTouched=true; pinned=(pinned===n)?null:n; setActive(pinned); });
    }
    cards.forEach(function(c){
      var n=c.getAttribute('data-l');
      c.addEventListener('mouseenter',function(){ userTouched=true; setActive(n); });
      c.addEventListener('mouseleave',function(){ setActive(pinned); });
      c.addEventListener('focus',function(){ userTouched=true; setActive(n); });
      c.addEventListener('blur',function(){ setActive(pinned); });
      c.addEventListener('click',function(){ userTouched=true; pinned=(pinned===n)?null:n; setActive(pinned); });
      c.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); c.click(); } });
    });
    btn.addEventListener('click',function(){ userTouched=true; go(exploded?0:1); });
    [].slice.call(root.querySelectorAll('.pre button')).forEach(function(b){
      b.addEventListener('click',function(){
        [].slice.call(root.querySelectorAll('.pre button')).forEach(function(x){ x.classList.toggle('on',x===b); });
        userTouched=true; build(b.getAttribute('data-p'));
      });
    });

    build('xl9');
    /* défilement : la carte la plus proche du centre de l'écran s'allume, le schéma suit */
    var lst=root.querySelector('.lay-list');
    function scrollPick(){
      if(!lst||pinned||!cards.length||window.innerWidth<900) return;
      var vh=window.innerHeight, r=lst.getBoundingClientRect(); if(r.bottom<0||r.top>vh) return;
      var best=null, bd=1e9;
      cards.forEach(function(c){ var b=c.getBoundingClientRect(), d=Math.abs((b.top+b.height/2)-vh*0.55); if(d<bd){ bd=d; best=c; } });
      var n=best&&best.getAttribute('data-l'); if(n&&n!==active){ userTouched=true; if(!exploded) go(1); setActive(n); }
    }
    window.addEventListener('scroll',function(){ requestAnimationFrame(scrollPick); },{passive:true});

    /* entrée à l'écran : le schéma s'assemble puis s'éclate, puis un passage sur les couches */
    function tour(){
      var i=0;
      (function next(){
        if(userTouched||i>=ORDER.length){ if(!userTouched&&!pinned) setActive(null); return; }
        setActive(ORDER[i++]); setTimeout(next,1300);
      })();
    }
    if(reduce){ go(1); }
    else if('IntersectionObserver' in window){
      var seen=false;
      new IntersectionObserver(function(es,ob){
        if(es[0].isIntersecting&&!seen){ seen=true; ob.disconnect(); setTimeout(function(){ go(1,tour); },350); }
      },{threshold:0.45}).observe(wrap);
    } else { go(1); }
  }

  /* fabrication : bande d'étapes */
  var fs=__id('fs');
  if(fs){
    var ch=[].slice.call(fs.querySelectorAll('.fch')), nEl=__id('fsn'), bp=__id('fsp'), bx=__id('fsx'), idx=0;
    function pad(){ return parseFloat(getComputedStyle(fs).paddingLeft)||0; }
    function curIdx(){
      var l=fs.getBoundingClientRect().left+pad(), best=0, bd=1e9;
      ch.forEach(function(c,i){ var d=Math.abs(c.getBoundingClientRect().left-l); if(d<bd){bd=d;best=i;} });
      return best;
    }
    function upd(){
      idx=curIdx();
      nEl.textContent='0'+(idx+1)+' / 0'+ch.length;
      bp.disabled=idx<=0; bx.disabled=idx>=ch.length-1;
    }
    function to(i){
      i=Math.max(0,Math.min(ch.length-1,i));
      fs.scrollTo({left:ch[i].offsetLeft-pad(),behavior:reduce?'auto':'smooth'});
    }
    bp.addEventListener('click',function(){ to(idx-1); });
    bx.addEventListener('click',function(){ to(idx+1); });
    var tm=null; fs.addEventListener('scroll',function(){ clearTimeout(tm); tm=setTimeout(upd,60); },{passive:true});
    window.addEventListener('resize',upd); upd();
  }
})();


  }
  function scan(){ var els=document.querySelectorAll('.pdt'); for(var i=0;i<els.length;i++){ if(!els[i].__pg){ els[i].__pg=true; try{ init(els[i]); }catch(e){ console.warn('pdt',e); } } } }
  var pending=false;
  function boot(){ new MutationObserver(function(){ if(!pending){ pending=true; requestAnimationFrame(function(){ pending=false; scan(); }); } }).observe(document.documentElement,{childList:true,subtree:true}); scan(); setInterval(scan,500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
