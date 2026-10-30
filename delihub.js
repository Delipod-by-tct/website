/* Delihub : page intégrée dans la V4, scripts limités au conteneur .pdh */
(function(){
  function init(root){
    function __id(i){ return root.querySelector('[id="'+i+'"]'); }

/* Scène isométrique du Delihub : un seul moteur, deux usages (hero animé, visite par fonctionnalité). */
(function(){
var NS='http://www.w3.org/2000/svg', S=26, K=0.8660254;
function P(x,y,z){return [(x-y)*K*S,(x+y)*0.5*S-z*S];}
function pt(p){var q=P(p[0],p[1],p[2]);return q[0].toFixed(1)+','+q[1].toFixed(1);}
function pts(a){return a.map(pt).join(' ');}
function poly(a,fill,stroke,sw,extra){return '<polygon points="'+pts(a)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linejoin="round"'+(extra||'')+'/>';}
function line(a,b,stroke,sw,extra){var p=P(a[0],a[1],a[2]),q=P(b[0],b[1],b[2]);return '<line x1="'+p[0].toFixed(1)+'" y1="'+p[1].toFixed(1)+'" x2="'+q[0].toFixed(1)+'" y2="'+q[1].toFixed(1)+'" stroke="'+stroke+'" stroke-width="'+sw+'"'+(extra||'')+'/>';}
var INK='#0C0C0B',PAPER='#FFFCFC',MUTE='#C4C4BE',HUB='#B3FF89',TRONIC='#9BFCFF',IOS='#863BBB';

/* styles de boîtes */
var ST={
  pod:{t:PAPER,l:'#D3CFCA',r:'#A9A5A0',s:'rgba(12,12,11,.6)',w:.8},
  dark:{t:'#2d2d2b',l:'#1f1f1e',r:'#151514',s:'rgba(196,196,190,.55)',w:.8},
  ouv:{t:'#2a3326',l:'#1d241b',r:'#141a12',s:'rgba(179,255,137,.85)',w:1},
  ghost:{t:'rgba(255,252,252,.05)',l:'rgba(255,252,252,.03)',r:'rgba(255,252,252,.02)',s:'rgba(196,196,190,.6)',w:1,d:'3 4'},
  cargo:{t:'rgba(255,252,252,.10)',l:'rgba(255,252,252,.06)',r:'rgba(255,252,252,.04)',s:'rgba(255,252,252,.85)',w:1.1},
  cab:{t:'#1c1c1b',l:'#141413',r:'#0C0C0B',s:PAPER,w:1.1},
  bike:{t:'#1c1c1b',l:'#141413',r:'#0C0C0B',s:PAPER,w:1.1}
};
function box(x,y,z,w,d,h,st){
  var da=st.d?' stroke-dasharray="'+st.d+'"':'';
  var t=[[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]];
  var l=[[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x,y+d,z]];
  var r=[[x+w,y,z+h],[x+w,y+d,z+h],[x+w,y+d,z],[x+w,y,z]];
  return poly(l,st.l,st.s,st.w,da)+poly(r,st.r,st.s,st.w,da)+poly(t,st.t,st.s,st.w,da);
}
function wrap(cls,f,st,inner){return '<g class="o '+cls+'" data-f="'+f+'" data-st="'+st+'">'+inner+'</g>';}

/* géométrie du lieu (unités ~ mètres, schématiques) */
var BAYX=[8.8,11.3,13.8,16.3], PODW=1.8, PODD=1.1, PODH=1.7;
var ROWS={b1:4.0,f1:8.0,b2:2.2,f2:9.7};
var TRK={w:2.2,cargoL:4.4,cabL:1.6,yc:6.5};
var AIS=6.55;
var DYN=[]; /* baies dynamiques : 0-3 rang arrière, 4-7 rang avant */
for(var i=0;i<4;i++){DYN.push({x:BAYX[i],y:ROWS.b1});}
for(var j=0;j<4;j++){DYN.push({x:BAYX[j],y:ROWS.f1});}
var DECOR=[{x:BAYX[0],y:ROWS.b2,fresh:0},{x:BAYX[1],y:ROWS.b2,fresh:1},{x:BAYX[2],y:ROWS.b2,fresh:1},{x:BAYX[1],y:ROWS.f2,fresh:0},{x:BAYX[2],y:ROWS.f2,fresh:0},{x:BAYX[3],y:ROWS.f2,fresh:1}];
var FRESH_DYN={1:1,2:1,5:1,6:1};
function rampZ(xc){return Math.max(0,Math.min(3,3*(-xc/9)));}

function pod(x,y,z,fresh,mode){
  var feat='verrou suivi'+(fresh?' froid':'');
  var s=wrap('pod',feat,'service',box(x,y,z,PODW,PODD,PODH,ST.pod));
  var m=.28, tz=z+PODH;
  var pv=[[x+PODW*m,y+PODD*.18,tz],[x+PODW*(1-m),y+PODD*.18,tz],[x+PODW*(1-m),y+PODD*.82,tz],[x+PODW*m,y+PODD*.82,tz]];
  s+=wrap('pv','energie','etude',poly(pv,'#27386B','rgba(12,12,11,.5)',.6));
  if(fresh){
    var f=[[x,y+PODD,z+PODH*.52],[x+PODW,y+PODD,z+PODH*.52],[x+PODW,y+PODD,z+PODH*.66],[x,y+PODD,z+PODH*.66]];
    s+=wrap('fr','froid verrou suivi','service',poly(f,TRONIC,'none',0,' fill-opacity=".9"'));
  }
  return s;
}
function podRaw(x,y,z,fresh){ /* pour la scène animée (sans classes de fonction) */
  var s=box(x,y,z,PODW,PODD,PODH,ST.pod);
  var m=.28,tz=z+PODH;
  s+=poly([[x+PODW*m,y+PODD*.18,tz],[x+PODW*(1-m),y+PODD*.18,tz],[x+PODW*(1-m),y+PODD*.82,tz],[x+PODW*m,y+PODD*.82,tz]],'#27386B','rgba(12,12,11,.5)',.6);
  if(fresh) s+=poly([[x,y+PODD,z+PODH*.52],[x+PODW,y+PODD,z+PODH*.52],[x+PODW,y+PODD,z+PODH*.66],[x,y+PODD,z+PODH*.66]],TRONIC,'none',0,' fill-opacity=".9"');
  return s;
}

/* ---------- couche sol (statique) ---------- */
function floorLayer(){
  var s='';
  /* rue en surface (z=3) et mur de soutènement */
  s+=poly([[-15,3.4,3],[-9,3.4,3],[-9,9.6,3],[-15,9.6,3]],'#121211','rgba(196,196,190,.28)',1);
  s+=poly([[-15,9.6,3],[-9,9.6,3],[-9,9.6,.4],[-15,9.6,.4]],'#0F0F0E','rgba(196,196,190,.2)',1);
  s+=poly([[-9,3.4,3],[-9,9.6,3],[-9,9.6,.4],[-9,3.4,.4]],'#0A0A09','rgba(196,196,190,.2)',1);
  s+=line([-15,6.5,3],[-9,6.5,3],'rgba(196,196,190,.35)',1,' stroke-dasharray="5 6"');
  /* dalle du niveau -1 */
  s+=poly([[0,12,0],[20,12,0],[20,12,-1],[0,12,-1]],'#0F0F0E','rgba(196,196,190,.3)',1);
  s+=poly([[20,0,0],[20,12,0],[20,12,-1],[20,0,-1]],'#0A0A09','rgba(196,196,190,.3)',1);
  s+=poly([[0,0,0],[20,0,0],[20,12,0],[0,12,0]],'#111110','rgba(196,196,190,.4)',1);
  var g='';
  for(var gx=2;gx<20;gx+=2){g+=line([gx,0,0],[gx,12,0],'rgba(196,196,190,.07)',1);}
  for(var gy=2;gy<12;gy+=2){g+=line([0,gy,0],[20,gy,0],'rgba(196,196,190,.07)',1);}
  s+=g;
  /* rampe */
  s+=poly([[-9,4.6,3],[0,4.6,0],[0,8.4,0],[-9,8.4,3]],'#161615','rgba(196,196,190,.45)',1);
  for(var k=1;k<9;k++){var xx=-9+k;var zz=rampZ(xx);s+=line([xx,4.6,zz],[xx,8.4,zz],'rgba(196,196,190,.16)',1);}
  s+=poly([[-9,8.4,3],[0,8.4,0],[0,8.4,-1],[-9,8.4,-1]],'#0F0F0E','rgba(196,196,190,.3)',1);
  s+=line([-9,6.5,3],[0,6.5,0],'rgba(196,196,190,.35)',1,' stroke-dasharray="5 6"');
  /* marquage des baies */
  var all=DYN.concat(DECOR);
  all.forEach(function(b){s+=poly([[b.x-.1,b.y-.1,0],[b.x+PODW+.1,b.y-.1,0],[b.x+PODW+.1,b.y+PODD+.1,0],[b.x-.1,b.y+PODD+.1,0]],'none','rgba(179,255,137,.35)',.8,' stroke-dasharray="3 3"');});
  /* aire de recharge (vélos) */
  var rc='';
  [3.6,4.4].forEach(function(yy){rc+=poly([[17.4+.9,yy-.3,0],[19.6,yy-.3,0],[19.6,yy+.3,0],[17.4+.9,yy+.3,0]],'none','rgba(179,255,137,.8)',1);});
  s+=wrap('flr','recharge','ouverture',rc);
  /* lieu de vie à l'étude : emprise au sol */
  s+=wrap('flr','pause','etude',poly([[.4,.4,0],[5.6,.4,0],[5.6,4.4,0],[.4,4.4,0]],'rgba(255,252,252,.03)','rgba(196,196,190,.6)',1,' stroke-dasharray="4 4"'));
  /* casiers batterie : emprise */
  s+=wrap('flr','batterie','etude',poly([[18,8.0,0],[19.8,8.0,0],[19.8,11.4,0],[18,11.4,0]],'rgba(255,252,252,.03)','rgba(196,196,190,.6)',1,' stroke-dasharray="4 4"'));
  /* restitution d'énergie : flux pods vers bornes */
  s+=wrap('flr','energie','etude','<g class="flow">'+line([14.6,3.5,0],[19,3.5,0],HUB,1.4,' stroke-dasharray="4 5"')+line([13,5.3,0],[18.3,5.3,0],HUB,1.4,' stroke-dasharray="4 5"')+'</g>');
  /* seuil du portail */
  s+=wrap('flr','portail','ouverture',line([0,4.6,0],[0,8.4,0],HUB,2.2));
  return s;
}

/* ---------- couche objets hauts statiques (triés avec le dynamique) ---------- */
function tallStatic(){
  var L=[];
  function add(key,svg){L.push([key,svg]);}
  /* chambres froides mobiles (à l'ouverture) */
  [[13.4,.3],[16.8,.3]].forEach(function(c){add(c[0]+c[1]+1,wrap('eq','froidmobile','ouverture',box(c[0],c[1],0,3.0,1.7,2.3,ST.ouv)+poly([[c[0]+.5,c[1]+1.7,1.9],[c[0]+2.5,c[1]+1.7,1.9],[c[0]+2.5,c[1]+1.7,1.55],[c[0]+.5,c[1]+1.7,1.55]],TRONIC,'none',0,' fill-opacity=".85"')));});
  /* bornes de recharge */
  [3.6,4.4].forEach(function(yy){add(19.2+yy,wrap('eq','recharge','ouverture',box(19.2,yy-.18,0,.36,.36,1.3,ST.ouv)));});
  /* casiers batterie (à l'étude) */
  [8.1,9.1,10.1].forEach(function(yy){add(18.4+yy,wrap('eq','batterie','etude',box(18.4,yy,0,1.2,.8,1.3,ST.ghost)));});
  /* espace de pause (à l'étude) */
  add(2.4+1.9,wrap('eq','pause','etude',box(.8,.8,0,3.8,2.8,2.4,ST.ghost)));
  /* caméras */
  [[.5,.5],[19.5,.5],[19.5,11.5],[.5,11.5]].forEach(function(c){add(c[0]+c[1],wrap('eq','surveillance','ouverture',box(c[0]-.12,c[1]-.12,0,.24,.24,3.1,ST.ouv)+box(c[0]-.3,c[1]-.3,3.1,.6,.6,.35,ST.ouv)));});
  /* poteaux du portail (côté rampe) */
  [4.35,8.45].forEach(function(yy){add(.1+yy,wrap('eq','portail','ouverture',box(-.15,yy-.15,0,.3,.3,1.7,ST.ouv)));});
  return L;
}
/* clôture et cônes de vue (au-dessus) */
function overLayer(){
  var s='',f='';
  var rails=[[[0,0],[0,4.6]],[[0,8.4],[0,12]],[[0,0],[20,0]],[[20,0],[20,5.4]],[[20,7.6],[20,12]],[[0,12],[20,12]]];
  rails.forEach(function(r){
    var a=r[0],b=r[1];
    f+=line([a[0],a[1],1.4],[b[0],b[1],1.4],HUB,1.2,' stroke-opacity=".8"');
    f+=line([a[0],a[1],.15],[b[0],b[1],.15],HUB,.8,' stroke-opacity=".4"');
    var n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/1.6));
    for(var i=0;i<=n;i++){var px=a[0]+(b[0]-a[0])*i/n,py=a[1]+(b[1]-a[1])*i/n;f+=line([px,py,0],[px,py,1.4],HUB,.8,' stroke-opacity=".5"');}
  });
  s+=wrap('fence','surveillance','ouverture',f);
  /* cônes de vidéosurveillance */
  var cones='';
  cones+=poly([[.5,.5,0],[9,1.2,0],[1.2,9,0]],'rgba(179,255,137,.07)','rgba(179,255,137,.35)',.8,' stroke-dasharray="3 4"');
  cones+=poly([[19.5,.5,0],[11,1.2,0],[18.8,9,0]],'rgba(179,255,137,.07)','rgba(179,255,137,.35)',.8,' stroke-dasharray="3 4"');
  cones+=poly([[19.5,11.5,0],[11,10.8,0],[18.8,3,0]],'rgba(179,255,137,.05)','rgba(179,255,137,.3)',.8,' stroke-dasharray="3 4"');
  cones+=poly([[.5,11.5,0],[9,10.8,0],[1.2,3,0]],'rgba(179,255,137,.05)','rgba(179,255,137,.3)',.8,' stroke-dasharray="3 4"');
  return {fence:s,cones:wrap('cone','surveillance','ouverture',cones)};
}

/* ---------- constructeur ---------- */
function Scene(root,opts){
  opts=opts||{};
  var mode=opts.mode||'tour';
  var svg=root;
  svg.setAttribute('class',(svg.getAttribute('class')||'')+' scene');
  var tall=tallStatic();
  var over=overLayer();
  /* cadrage */
  var crop=(mode==='tour');
  var ref=crop?[[0,0,4],[20,0,4],[20,12,0],[0,12,-1],[-3.2,4.6,2.2],[-3.2,8.4,2.2]]:[[-15,3.4,3.5],[-15,9.6,3.5],[20,0,4],[20,12,0],[0,12,-1],[24,0,0],[24,12,0],[0,0,3.3],[-9,9.6,0]];
  var minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  ref.forEach(function(r){var p=P(r[0],r[1],r[2]);minx=Math.min(minx,p[0]);maxx=Math.max(maxx,p[0]);miny=Math.min(miny,p[1]);maxy=Math.max(maxy,p[1]);});
  var hubTop=P(10,6,0);
  var node=crop?{w:176,h:54}:{w:150,h:48};
  var nodeC=[maxx-node.w/2-(crop?0:26), miny-6+node.h/2+10];
  miny=Math.min(miny,nodeC[1]-node.h/2-14);
  var pad=26; var vx=minx-pad,vy=miny-pad,vw=(maxx-minx)+pad*2,vh=(maxy-miny)+pad*2;
  svg.setAttribute('viewBox',vx.toFixed(0)+' '+vy.toFixed(0)+' '+vw.toFixed(0)+' '+vh.toFixed(0));
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  var gFloor=document.createElementNS(NS,'g'),gDyn=document.createElementNS(NS,'g'),gOver=document.createElementNS(NS,'g'),gHud=document.createElementNS(NS,'g');
  svg.appendChild(gFloor);svg.appendChild(gDyn);svg.appendChild(gOver);svg.appendChild(gHud);
  gFloor.innerHTML=floorLayer();
  gOver.innerHTML=over.cones+over.fence;
  /* nœud TMS et liaison */
  var tmsLink='M '+hubTop[0].toFixed(1)+' '+(hubTop[1]-20).toFixed(1)+' L '+nodeC[0].toFixed(1)+' '+(nodeC[1]+node.h/2).toFixed(1);
  gHud.innerHTML=
   '<g class="o" data-f="suivi" data-st="service"><path id="tmslink" d="'+tmsLink+'" fill="none" stroke="'+IOS+'" stroke-width="1.4" stroke-dasharray="4 5" stroke-opacity=".9"/>'+
   '<rect x="'+(nodeC[0]-node.w/2).toFixed(1)+'" y="'+(nodeC[1]-node.h/2).toFixed(1)+'" width="'+node.w+'" height="'+node.h+'" rx="5" fill="'+IOS+'"/>'+
   '<text x="'+nodeC[0].toFixed(1)+'" y="'+(nodeC[1]-3).toFixed(1)+'" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="700" font-size="'+(crop?17:14)+'" letter-spacing="1.8" fill="'+PAPER+'">VOS OUTILS</text>'+
   '<text x="'+nodeC[0].toFixed(1)+'" y="'+(nodeC[1]+15).toFixed(1)+'" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="500" font-size="'+(crop?14:12)+'" letter-spacing="1.4" fill="'+PAPER+'" fill-opacity=".9">TMS · ERP</text></g>'+
   '<circle id="ping" r="5" fill="'+TRONIC+'" opacity="0"/>'+
   '<circle id="gring" r="10" fill="none" stroke="'+HUB+'" stroke-width="1.6" opacity="0"/>';
  var ping=svg.querySelector('#ping'),tlink=svg.querySelector('#tmslink'),gring=svg.querySelector('#gring');
  var linkLen=tlink.getTotalLength();
  /* étiquettes (visite) */
  var LABELS=[
    ['verrou',[13.8,3.9,1.7],[-30,-100],'Verrou connecté'],
    ['suivi',[16.3,3.9,1.7],[-40,-120],'Suivi dans vos outils'],
    ['froid',[11.3,2.2,1.7],[-60,-90],'Delipod Fresh'],
    ['portail',[0,6.5,1.7],[40,-90],'Accès par l’app chauffeur'],
    ['surveillance',[19.5,11.5,3.4],[-40,-70],'Caméras'],
    ['recharge',[19.2,4,1.3],[-90,-100],'Recharge vélos'],
    ['froidmobile',[16.8,1,2.3],[-40,-70],'Chambres froides mobiles'],
    ['energie',[16,4.1,1.8],[-60,-110],'Énergie solaire'],
    ['batterie',[19,9,1.3],[-60,50],'Échange de batterie'],
    ['pause',[2.8,2.2,2.4],[70,-50],'Pause, sanitaires, vestiaires']
  ];
  var labHtml='';
  LABELS.forEach(function(l){
    var a=P(l[1][0],l[1][1],l[1][2]),b=[a[0]+l[2][0],a[1]+l[2][1]];
    var anchor=l[2][0]<0?'end':'start';
    labHtml+='<g class="lab" data-f="'+l[0]+'"><line x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'" stroke="'+HUB+'" stroke-width="1.2"/><circle cx="'+a[0].toFixed(1)+'" cy="'+a[1].toFixed(1)+'" r="3.2" fill="'+HUB+'"/><text x="'+(b[0]+(anchor==='end'?-8:8)).toFixed(1)+'" y="'+(b[1]+4).toFixed(1)+'" text-anchor="'+anchor+'" font-family="Archivo,Arial,sans-serif" font-weight="700" font-size="18" letter-spacing="1.8" fill="'+PAPER+'" stroke="'+INK+'" stroke-width="7" paint-order="stroke" stroke-linejoin="round">'+l[3].toUpperCase()+'</text></g>';
  });
  if(mode==='tour'){var gl=document.createElementNS(NS,'g');gl.innerHTML=labHtml;svg.appendChild(gl);}

  /* ---- état des baies ---- */
  var fill=[1,1,0,1,1,0,1,0];
  function dynBoxes(t,plan,loop){
    var L=tall.slice();
    DECOR.forEach(function(b,i){L.push([b.x+b.y+PODW/2+PODD/2,podFor(b.x,b.y,0,b.fresh)]);});
    return L;
  }
  function podFor(x,y,z,fresh){return mode==='tour'?pod(x,y,z,fresh):wrap('pod','','service',podRaw(x,y,z,fresh));}
  function sorted(L){L.sort(function(a,b){return a[0]-b[0];});return L.map(function(e){return e[1];}).join('');}

  /* ---- mode visite : tout est statique ---- */
  function renderTour(){
    var L=tall.slice();
    DECOR.forEach(function(b){L.push([b.x+b.y+(PODW+PODD)/2,podFor(b.x,b.y,0,b.fresh)]);});
    DYN.forEach(function(b,i){if(fill[i])L.push([b.x+b.y+(PODW+PODD)/2,podFor(b.x,b.y,0,FRESH_DYN[i])]);});
    gDyn.innerHTML=sorted(L);
  }

  /* ---- mode hero : boucle animée ---- */
  var LOOP=16000, plan=null, lastLoop=-1;
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
  function seg(t,a,b){return Math.max(0,Math.min(1,(t-a)/(b-a)));}
  function mkPlan(){
    var empty=[],full=[];
    for(var i=0;i<8;i++){(fill[i]?full:empty).push(i);}
    empty.sort(function(a,b){return DYN[a].x-DYN[b].x;});
    full.sort(function(a,b){return DYN[b].x-DYN[a].x;});
    var drops=empty.slice(0,2), takes=full.filter(function(i){return drops.indexOf(i)<0;}).slice(0,2);
    return {drops:drops,takes:takes};
  }
  function frame(ms,hooks){
    var loop=Math.floor(ms/LOOP), t=(ms%LOOP)/1000;
    if(loop!==lastLoop){
      if(plan){plan.drops.forEach(function(i){fill[i]=1;});plan.takes.forEach(function(i){fill[i]=0;});}
      plan=mkPlan();lastLoop=loop;
    }
    var L=tall.slice();
    DECOR.forEach(function(b){L.push([b.x+b.y+(PODW+PODD)/2,podFor(b.x,b.y,0,b.fresh)]);});
    /* camion */
    var rear;
    if(t<3.4) rear=-14+ease(seg(t,0,3.4))*(0.8+14);
    else if(t<6.4) rear=0.8;
    else if(t<9.6) rear=0.8-ease(seg(t,6.4,9.6))*(0.8+14);
    else rear=-14.2;
    var xc=rear+TRK.cargoL/2, z=rampZ(xc);
    var tkY=TRK.yc-TRK.w/2;
    var showTruck=rear>-14.1;
    if(showTruck){
      var tk=box(rear,tkY,z,TRK.cargoL,TRK.w,2.5,ST.cargo)+box(rear+TRK.cargoL+.1,tkY,z,TRK.cabL,TRK.w,1.8,ST.cab);
      /* pods dans le camion avant le dépôt */
      var inTruck=[];
      plan.drops.forEach(function(bi,k){
        var t0=3.8+k*1.0,t1=t0+1.5;
        if(t<t0){inTruck.push({x:rear+.6+k*2.0,y:TRK.yc-PODD/2,z:z+.3});}
      });
      inTruck.forEach(function(p){L.push([p.x+p.y+(PODW+PODD)/2-.3,podRaw(p.x,p.y,p.z,0)]);});
      L.push([rear+TRK.cargoL+TRK.yc+TRK.w/2,tk]);
    }
    /* pods en transit (dépôt) */
    plan.drops.forEach(function(bi,k){
      var t0=3.8+k*1.0,t1=t0+1.5,b=DYN[bi];
      if(t>=t1){L.push([b.x+b.y+(PODW+PODD)/2,podRaw(b.x,b.y,0,FRESH_DYN[bi])]);}
      else if(t>=t0){
        var u=ease(seg(t,t0,t1));
        var sx=.8+.6+k*2.0,sy=TRK.yc-PODD/2,sz=.3;
        var x=sx+(b.x-sx)*u,y=sy+(b.y-sy)*u,zz=sz+(0-sz)*u+Math.sin(Math.PI*u)*2.6;
        L.push([x+y+(PODW+PODD)/2+2,podRaw(x,y,zz,FRESH_DYN[bi])]);
      }
    });
    /* pods restés en baie (hors retraits) */
    DYN.forEach(function(b,i){
      if(plan.drops.indexOf(i)>=0) return;
      if(!fill[i]) return;
      var tk=plan.takes.indexOf(i);
      if(tk>=0){
        var t0=9.8+tk*3.0; if(t>=t0) return;
      }
      L.push([b.x+b.y+(PODW+PODD)/2,podRaw(b.x,b.y,0,FRESH_DYN[i])]);
    });
    /* vélos-cargos */
    plan.takes.forEach(function(bi,k){
      var b=DYN[bi],base=7.0+k*3.0; /* arrivée */
      var tA0=base, tA1=base+2.4, tL0=tA1+.3, tL1=tL0+1.3, tD0=tL1+.5, tD1=tD0+2.4;
      var stopX=b.x+PODW/2-.9, bx, dir=-1;
      if(t<tA0) return;
      if(t<tA1){bx=27+(stopX-27)*ease(seg(t,tA0,tA1));}
      else if(t<tD0){bx=stopX;}
      else if(t<tD1){bx=stopX+(27-stopX)*ease(seg(t,tD0,tD1));dir=1;}
      else return;
      var bk=bikeBox(bx,AIS,dir);
      var loaded=t>=tL1;
      var key=bx+AIS+1.2;
      var s=bk;
      if(t>=tL0&&t<tL1){
        var u=ease(seg(t,tL0,tL1));
        var tx=bx+1.0,ty=AIS-PODD/2;
        var px=b.x+(tx-b.x)*u,py=b.y+(ty-b.y)*u,pz=.35*u+Math.sin(Math.PI*u)*1.6;
        L.push([px+py+(PODW+PODD)/2+1,podRaw(px,py,pz,FRESH_DYN[bi])]);
      }else if(loaded){
        L.push([bx+1.0+AIS+1,podRaw(bx+.1,AIS-PODD/2,.35,FRESH_DYN[bi])]);
      }
      L.push([key,s]);
    });
    gDyn.innerHTML=sorted(L);
    /* événements : pastille cyan vers les outils */
    var evs=[5.3,6.3,11.1,14.1],pv=0,pp=null;
    for(var e=0;e<evs.length;e++){var q=(t-evs[e])/1.1;if(q>0&&q<1){pv=1;pp=tlink.getPointAtLength(linkLen*(1-ease(q)));} }
    ping.setAttribute('opacity',pv);
    if(pp){ping.setAttribute('cx',pp.x.toFixed(1));ping.setAttribute('cy',pp.y.toFixed(1));}
    /* anneau du portail */
    var gp=P(0,6.5,1.8);
    var gq=(t-2.6)/1.3;
    if(gq>0&&gq<1){gring.setAttribute('cx',gp[0].toFixed(1));gring.setAttribute('cy',gp[1].toFixed(1));gring.setAttribute('r',(8+26*gq).toFixed(1));gring.setAttribute('opacity',(1-gq).toFixed(2));}else{gring.setAttribute('opacity',0);}
    if(hooks&&hooks.onEvent){
      var types=[[5.3,'Dépôt'],[6.3,'Dépôt'],[11.1,'Retrait'],[14.1,'Retrait']];
      types.forEach(function(ty,ix){var id=loop*10+ix;if(t>=ty[0]&&hooks._last!==id&&(hooks._last===undefined||id>hooks._last)){hooks._last=id;hooks.onEvent(ty[1],loop,ix);}});
    }
  }
  function bikeBox(x,y,dir){
    var fr=dir<0?x-.05:x+1.25;
    return box(x,y-.25,.15,1.3,.5,.55,ST.bike)+box(x+(dir<0?1.3:-1.05),y-.45,.05,1.05,.9,.28,ST.bike)+box(fr,y-.12,.15,.1,.24,.7,ST.bike);
  }

  /* ---- API de visite ---- */
  var state={active:null,filter:'all'};
  function apply(){
    var os=svg.querySelectorAll('.o'),ls=svg.querySelectorAll('.lab');
    for(var i=0;i<os.length;i++){
      var o=os[i],f=(o.getAttribute('data-f')||'').split(' '),st=o.getAttribute('data-st');
      var hit=state.active&&f.indexOf(state.active)>=0;
      var dim=false;
      if(state.active){dim=!hit;}
      else if(state.filter!=='all'){dim=(st!==state.filter);}
      o.classList.toggle('dim',dim);o.classList.toggle('hl',!!hit);
    }
    for(var j=0;j<ls.length;j++){ls[j].classList.toggle('on',ls[j].getAttribute('data-f')===state.active);}
    var fl=svg.querySelector('.flow');if(fl)fl.classList.toggle('run',state.active==='energie');
  }
  var api={
    setActive:function(id){state.active=id;apply();},
    setFilter:function(f){state.filter=f;apply();},
    start:function(hooks){
      if(mode==='tour'){renderTour();apply();
        var t0=performance.now(),stopped=false;
        var loopT=function(now){ if(stopped)return;
          var t=((now-t0)/1000);
          if(state.active==='suivi'||state.active==='verrou'||state.active==='portail'){
            var q=(t%2.4)/2.4,p2=tlink.getPointAtLength(linkLen*(1-ease(Math.min(1,q*1.3))));
            if(state.active==='suivi'){ping.setAttribute('opacity',q<.77?1:0);ping.setAttribute('cx',p2.x.toFixed(1));ping.setAttribute('cy',p2.y.toFixed(1));}else ping.setAttribute('opacity',0);
            if(state.active==='portail'){var gp=P(0,6.5,1.8);gring.setAttribute('cx',gp[0].toFixed(1));gring.setAttribute('cy',gp[1].toFixed(1));gring.setAttribute('r',(8+26*q).toFixed(1));gring.setAttribute('opacity',(1-q).toFixed(2));}else gring.setAttribute('opacity',0);
          }else{ping.setAttribute('opacity',0);gring.setAttribute('opacity',0);}
          requestAnimationFrame(loopT);
        };
        requestAnimationFrame(loopT);
        return;}
      var t0h=performance.now();
      var run=function(now){ if(!(hooks&&hooks.paused&&hooks.paused())) frame(now-t0h+1200,hooks); requestAnimationFrame(run);};
      requestAnimationFrame(run);
    },
    still:function(){ if(mode==='tour'){renderTour();apply();} else {fill=[1,1,0,1,1,0,1,0];lastLoop=-1;plan=null;frame(LOOP*0+1500+16000*0+4900,null);} }
  };
  return api;
}
window.HubScene=Scene;
})();

(function(){
   root.classList.add('js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.querySelector('header');
  function setNav(){ if(nav) root.style.setProperty('--navh', nav.offsetHeight+'px'); }
  setNav(); window.addEventListener('resize',setNav);

  /* hero : scène animée + journal d'événements (simulation) */
  var hero=__id('scene-hero');
  var heroOn=true;
  if(hero){
    var hs=HubScene(hero,{mode:'hero'});
    var hud=__id('hud'), ids=[17,21,9,14,3,26,11,19], n=0;
    var hooks={paused:function(){return !heroOn;},onEvent:function(type){
      if(!hud) return;
      var li=document.createElement('li'); li.innerHTML='<i></i>'+type+' <span>Delipod '+('0'+ids[n%ids.length]).slice(-3)+'</span>'; n++;
      hud.insertBefore(li,hud.firstChild); while(hud.children.length>4) hud.removeChild(hud.lastChild);
    }};
    if(reduce){ hs.still(); } else { hs.start(hooks); }
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){heroOn=es[0].isIntersecting;},{threshold:0}).observe(hero); }
  }

  /* visite des modules */
  var tourSvg=__id('scene-tour');
  if(tourSvg){
    var ts=HubScene(tourSvg,{mode:'tour'}); ts.start();
    var cards=[].slice.call(root.querySelectorAll('.fcard'));
    var capN=__id('tc-n'), capT=__id('tc-t');
    var stage=root.querySelector('.tour-stage');
    var current=null, filter='all', pinned=null, pinTimer=null;
    function visible(){return cards.filter(function(c){return !c.hidden;});}
    function setActive(c){
      if(!c||c===current) return; current=c;
      cards.forEach(function(x){x.classList.toggle('on',x===c);});
      ts.setActive(c.getAttribute('data-f'));
      capN.textContent=c.querySelector('.fn').textContent;
      capT.textContent=c.querySelector('h3').textContent;
    }
    function pick(){
      var vs=visible(); if(!vs.length) return;
      var narrow=window.innerWidth<=900, sb=stage.getBoundingClientRect();
      var target=narrow?(sb.bottom+90):(window.innerHeight*0.5);
      var best=null,bd=1e9;
      vs.forEach(function(c){var r=c.getBoundingClientRect(),d=Math.abs((r.top+r.height/2)-target);if(d<bd){bd=d;best=c;}});
      var first=vs[0].getBoundingClientRect(), last=vs[vs.length-1].getBoundingClientRect();
      if(first.top>target) best=vs[0];
      setActive(best);
    }
    var tk=false; function onS(){ if(pinned) return; if(!tk){tk=true;requestAnimationFrame(function(){tk=false;pick();});} }
    window.addEventListener('scroll',onS,{passive:true}); window.addEventListener('resize',onS);
    cards.forEach(function(c){
      c.addEventListener('click',function(){ pinned=true; setActive(c); clearTimeout(pinTimer); pinTimer=setTimeout(function(){pinned=null;},1600); });
      c.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();} });
      c.addEventListener('mouseenter',function(){ if(window.innerWidth>900){ setActive(c); } });
    });
    var fbs=[].slice.call(root.querySelectorAll('.fb'));
    fbs.forEach(function(b){ b.addEventListener('click',function(){
      filter=b.getAttribute('data-filter');
      fbs.forEach(function(x){x.classList.toggle('on',x===b);});
      cards.forEach(function(c){c.hidden=(filter!=='all'&&c.getAttribute('data-st')!==filter);});
      current=null; ts.setFilter(filter); ts.setActive(null);
      var vs=visible(); if(vs.length) setActive(vs[0]);
    });});
    setActive(cards[0]); pick();
  }

  /* barres de comparaison */
  var size=root.querySelector('.size');
  if(size){ if('IntersectionObserver' in window&&!reduce){ var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){size.classList.add('in');io.disconnect();}});},{threshold:.4}); io.observe(size);} else size.classList.add('in'); }
})();


  }
  function scan(){ var els=document.querySelectorAll('.pdh'); for(var i=0;i<els.length;i++){ if(!els[i].__pg){ els[i].__pg=true; try{ init(els[i]); }catch(e){ console.warn('pdh',e); } } } }
  var pending=false;
  function boot(){ new MutationObserver(function(){ if(!pending){ pending=true; requestAnimationFrame(function(){ pending=false; scan(); }); } }).observe(document.documentElement,{childList:true,subtree:true}); scan(); setInterval(scan,500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
