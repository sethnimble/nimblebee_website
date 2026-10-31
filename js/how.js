/* How it works: three stages. On desktop the section pins and scrolling steps through them; on a phone the stages swipe sideways.
   The tabs work both ways and move with the arrow keys. Under reduced motion on desktop all three stages sit stacked and the tabs hide. */
(function(){
'use strict';
var NB=window.NB;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
NB.mods.how=function(sec){
  var pin=NB.$('.hwpin',sec),slides=NB.$$('.slide',sec),tabs=NB.$$('.tabpill',sec),track=NB.$('.slides',sec),bar=NB.$('.hwbar i',sec),
      mqD=matchMedia('(min-width:900px)'),cur=-1;
  function desk(){return mqD.matches&&!NB.reduce}
  function setA(k){
    if(k===cur)return;cur=k;
    slides.forEach(function(s,i){s.classList.toggle('on',i===k)});
    tabs.forEach(function(t,i){t.setAttribute('aria-selected',i===k);t.tabIndex=i===k?0:-1});
  }
  function upd(){
    if(desk()){var r=pin.getBoundingClientRect(),tot=r.height-innerHeight,p=clamp(-r.top/tot,0,1);bar.style.transform='scaleX('+p.toFixed(3)+')';setA(p<.34?0:p<.67?1:2)}
    else if(mqD.matches){slides.forEach(function(s){s.classList.add('on')})}
    else{var st=slides[1].getBoundingClientRect().left-slides[0].getBoundingClientRect().left;setA(clamp(Math.round(track.scrollLeft/st),0,2))}
  }
  function go(k){
    if(desk()){var r=pin.getBoundingClientRect(),tot=r.height-innerHeight;scrollTo({top:r.top+scrollY+tot*[.05,.5,.95][k],behavior:NB.reduce?'auto':'smooth'})}
    else{var st=slides[1].getBoundingClientRect().left-slides[0].getBoundingClientRect().left;track.scrollTo({left:k*st,behavior:NB.reduce?'auto':'smooth'})}
  }
  tabs.forEach(function(t,k){
    t.addEventListener('click',function(){go(k)});
    t.addEventListener('keydown',function(e){
      var d=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;if(!d)return;
      e.preventDefault();var n=(k+d+tabs.length)%tabs.length;tabs[n].focus();go(n);
    });
  });
  addEventListener('scroll',upd,{passive:true});track.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);
  setA(0);upd();
};
})();
