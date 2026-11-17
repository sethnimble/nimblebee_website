/* How it works: six stops (Before, Listen, Plan, Set up, Hand over, After) under three tabs (Before, During, After).
   On a wide, tall window the section pins, centred in the window, and scrolling steps through the six stops; elsewhere the cards swipe sideways
   with a dot for each. The tabs work both ways: During is active for the four step cards and jumps to Listen, and the arrow keys move one stop at a time.
   Under reduced motion all six cards sit stacked and the tabs, dots and bar are hidden (the CSS does the layout; here every card is just marked on). */
(function(){
'use strict';
var NB=window.NB;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
var STAGE=[0,1,1,1,1,2];   /* which tab each stop belongs to */
var FIRST=[0,1,5];         /* the stop each tab jumps to */
NB.mods.how=function(sec){
  var pin=NB.$('.hwpin',sec),stick=NB.$('.hwstick',sec),slides=NB.$$('.slide',sec),tabs=NB.$$('.tabpill',sec),dots=NB.$$('.hwdots i',sec),
      track=NB.$('.slides',sec),bar=NB.$('.hwbar i',sec),N=slides.length,
      mqD=matchMedia('(min-width:900px) and (min-height:560px)'),cur=-1,top=110;
  function desk(){return mqD.matches&&!NB.reduce}
  function setA(k){
    if(k===cur)return;cur=k;
    slides.forEach(function(s,i){s.classList.toggle('on',i===k)});
    dots.forEach(function(d,i){d.classList.toggle('on',i===k)});
    tabs.forEach(function(t,i){var on=i===STAGE[k];t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});
  }
  /* centre the pinned content in the window: the stuck box is as tall as its content, so its top is half of what is left over */
  function fit(){
    var h=stick.offsetHeight;top=Math.max(96,Math.round((innerHeight-h)/2));
    pin.style.setProperty('--hwh',h+'px');pin.style.setProperty('--hwt',top+'px');
  }
  function span(){return pin.offsetHeight-stick.offsetHeight}
  function stride(){return slides[1].getBoundingClientRect().left-slides[0].getBoundingClientRect().left}
  function upd(){
    if(NB.reduce){slides.forEach(function(s){s.classList.add('on')});return}
    if(desk()){var p=clamp((top-pin.getBoundingClientRect().top)/span(),0,1);bar.style.transform='scaleX('+p.toFixed(3)+')';setA(Math.min(N-1,Math.floor(p*N)))}
    else{setA(clamp(Math.round(track.scrollLeft/stride()),0,N-1))}
  }
  function go(k){
    if(desk()){scrollTo({top:pin.getBoundingClientRect().top+scrollY-top+span()*(k+.5)/N,behavior:'smooth'})}
    else{track.scrollTo({left:k*stride(),behavior:'smooth'})}
  }
  tabs.forEach(function(t,k){
    t.addEventListener('click',function(){go(FIRST[k])});
    t.addEventListener('keydown',function(e){
      var n=cur<0?0:cur,d=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;
      if(e.key==='Home')n=0;else if(e.key==='End')n=N-1;else if(d)n=(n+d+N)%N;else return;
      e.preventDefault();tabs[STAGE[n]].focus({preventScroll:true});go(n);
    });
  });
  fit();
  if(window.ResizeObserver)new ResizeObserver(function(){fit();upd()}).observe(stick);
  addEventListener('scroll',upd,{passive:true});track.addEventListener('scroll',upd,{passive:true});
  addEventListener('resize',function(){fit();upd()});
  if(mqD.addEventListener)mqD.addEventListener('change',function(){cur=-1;fit();upd()});
  setA(0);upd();
};
})();
