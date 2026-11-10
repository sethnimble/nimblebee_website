/* Problem: the toggle tidies six scattered notes into "A system.", wires them together with connection lines,
   and sends two dots hopping between the tiles (fixed state only; no dots under reduced motion or off screen) */
(function(){
'use strict';
var NB=window.NB;
var NS='http://www.w3.org/2000/svg';
/* tiles by index: 0 Web, 1 Comms, 2 Agents, 3 Finance, 4 Your own app, 5 Sorted storage.
   Three columns (560px and up): Your own app is the hub; Agents links Comms and storage; Web links Finance and Comms.
   Two columns (phone): a ladder, rows and columns plus two parallel diagonals, so nothing crosses. Both sets have nine lines. */
var WIDE=[[4,0],[4,1],[4,2],[4,3],[4,5],[2,1],[2,5],[0,3],[0,1]];
var NARROW=[[0,1],[2,3],[4,5],[0,2],[2,4],[1,3],[3,5],[1,2],[3,4]];
var wide=matchMedia('(min-width:560px)');
var DRAWN=1250; /* ms after the toggle: the lines are done drawing (500 + 8x47 + 347 = 1223, see site.css) */
var SPEED=0.165; /* px per ms, 50% faster than the first build (.11) */

NB.mods.problem=function(sec){
  var b=NB.$('.toggle',sec),tl=NB.$('.tl',sec),board=NB.$('.board',sec),mess=NB.$('.mess',sec);if(!b||!board||!mess)return;
  var notes=NB.$$('.note',mess),svg=document.createElementNS(NS,'svg'),lines=[],dots=[];
  svg.setAttribute('class','links');svg.setAttribute('aria-hidden','true');
  WIDE.forEach(function(e,i){
    var l=document.createElementNS(NS,'line');l.setAttribute('pathLength','1');l.style.setProperty('--i',i);
    svg.appendChild(l);lines.push(l);
  });
  [0,1].forEach(function(i){
    var c=document.createElementNS(NS,'circle');c.setAttribute('r','5.5');c.setAttribute('class','dot d'+i);c.style.display='none';
    svg.appendChild(c);dots.push({el:c,node:Math.floor(NB.rnd(0,6)),prev:-1,seg:null,t:0,dur:0,wait:0});
  });
  mess.insertBefore(svg,mess.firstChild);

  function edges(){return wide.matches?WIDE:NARROW}
  /* tile centres come from layout (offset*), which ignores the rotate and translate of the scattered state */
  function centre(n){return[n.offsetLeft+n.offsetWidth/2,n.offsetTop+n.offsetHeight/2]}
  function place(){
    edges().forEach(function(e,i){
      var a=centre(notes[e[0]]),c=centre(notes[e[1]]),l=lines[i];
      l.setAttribute('x1',a[0]);l.setAttribute('y1',a[1]);l.setAttribute('x2',c[0]);l.setAttribute('y2',c[1]);
    });
  }
  place();
  if(window.ResizeObserver)new ResizeObserver(place).observe(mess);else addEventListener('resize',place);

  /* the stretch of a line that shows between two tiles: from where it leaves tile a to where it reaches tile b */
  function exitT(n,dx,dy){
    var hw=n.offsetWidth/2+2,hh=n.offsetHeight/2+2;
    return Math.min(dx?hw/Math.abs(dx):Infinity,dy?hh/Math.abs(dy):Infinity);
  }
  function hop(d){
    var near=[];
    edges().forEach(function(e){if(e[0]===d.node)near.push(e[1]);else if(e[1]===d.node)near.push(e[0])});
    var pick=near.filter(function(n){return n!==d.prev});if(!pick.length)pick=near;
    var next=pick[Math.floor(Math.random()*pick.length)];
    var a=notes[d.node],c=notes[next],ca=centre(a),cb=centre(c),dx=cb[0]-ca[0],dy=cb[1]-ca[1];
    var t0=exitT(a,dx,dy),t1=1-exitT(c,dx,dy);if(t1<t0){t0=t1=(t0+t1)/2}
    d.seg=[ca[0]+dx*t0,ca[1]+dy*t0,ca[0]+dx*t1,ca[1]+dy*t1];d.next=next;d.t=0;
    d.dur=Math.max(300,Math.hypot(dx,dy)*(t1-t0)/SPEED);
  }
  function step(d,dt){
    if(d.wait>0){d.wait-=dt;d.el.style.display='none';return}
    if(!d.seg)hop(d);
    d.t+=dt;
    var k=Math.min(d.t/d.dur,1),e=k*k*(3-2*k),s=d.seg;
    d.el.setAttribute('cx',s[0]+(s[2]-s[0])*e);d.el.setAttribute('cy',s[1]+(s[3]-s[1])*e);
    d.el.style.opacity=Math.min(1,k*10,(1-k)*10);d.el.style.display='';
    if(k>=1){d.seg=null;d.prev=d.node;d.node=d.next;d.wait=NB.rnd(170,430);d.el.style.display='none'}
  }

  var raf=0,last=0,vis=false,tidyAt=0;
  function frame(now){
    var dt=Math.min(now-last,50);last=now;
    if(!NB.paused)dots.forEach(function(d){step(d,dt)});
    raf=requestAnimationFrame(frame);
  }
  function sync(){
    var want=board.classList.contains('tidy')&&vis&&!NB.reduce&&!document.hidden;
    if(want&&!raf){
      var base=Math.max(0,tidyAt+DRAWN-performance.now());
      dots.forEach(function(d,i){d.seg=null;d.wait=base+130+i*600});
      last=performance.now();raf=requestAnimationFrame(frame);
    }else if(!want&&raf){
      cancelAnimationFrame(raf);raf=0;
      dots.forEach(function(d){d.seg=null;d.el.style.display='none'});
    }
  }
  if(window.IntersectionObserver)new IntersectionObserver(function(es){vis=es[0].isIntersecting;sync()}).observe(sec);else vis=true;
  document.addEventListener('visibilitychange',sync);

  /* one place for both ways in: the toggle (manual) and the scroll trigger (auto) */
  function setFixed(on){
    board.classList.toggle('tidy',on);b.setAttribute('aria-pressed',on);
    tl.textContent=on?'Break me':'Fix me';
    if(on)tidyAt=performance.now();
    sync();
  }

  var touched=false,autoDone=false,inView=false,timer=0,seen=null;
  b.addEventListener('click',function(){
    touched=true;clearTimeout(timer);
    setFixed(!board.classList.contains('tidy'));
  });

  /* auto-tidy: once per visit, 0.8s after the board is 80% in view (so the mess is seen first).
     On a window too short to ever show 80% of the board (a phone on its side), a board that fills the window counts.
     A manual toggle always wins, and the toggle still works afterwards. Under reduced motion the state
     switches with no motion (the css transitions are off), so the finished state just appears. */
  function fire(){
    if(autoDone||touched||!inView)return;
    if(document.hidden){document.addEventListener('visibilitychange',function(){timer=setTimeout(fire,800)},{once:true});return}
    autoDone=true;if(seen)seen.disconnect();
    setFixed(true);
  }
  if(window.IntersectionObserver){
    seen=new IntersectionObserver(function(es){
      var e=es[es.length-1];
      inView=e.isIntersecting&&(e.intersectionRatio>=0.8||e.intersectionRect.height>=innerHeight*0.95);
      clearTimeout(timer);
      if(inView)timer=setTimeout(fire,800);
    },{threshold:[0,0.2,0.4,0.6,0.8,1]});
    seen.observe(board);
  }
};
})();
