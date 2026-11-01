/* Proof: the tool ticker loops its items and has a pause control (WCAG 2.2.2). The page-wide hero pause also stops it. */
(function(){
'use strict';
var NB=window.NB;
NB.mods.tape=function(t){
  var tr=NB.$('.track',t);if(!tr||tr._dup)return;tr._dup=1;
  tr.insertAdjacentHTML('beforeend',tr.innerHTML);
  var n=tr.children.length/2;
  [].slice.call(tr.children,n).forEach(function(c){
    c.setAttribute('aria-hidden','true');
    NB.$$('a',c).forEach(function(a){a.tabIndex=-1});
  });
  var sec=t.closest('section'),b=sec&&NB.$('[data-tape]',sec);
  if(b&&!b._bound){b._bound=1;b.addEventListener('click',function(){
    var s=!t.classList.contains('stop');t.classList.toggle('stop',s);
    b.setAttribute('aria-pressed',s);
    NB.$('span:not(.ic)',b).textContent=s?'Play ticker':'Pause ticker';
    NB.$('.ic',b).innerHTML=NB.icon(s?'play':'pause');
  })}
  /* Touch screens: a CSS transform cannot be swiped, so the ticker scrolls itself instead and a finger takes over (CSS: pointer:coarse). */
  if(matchMedia('(pointer:coarse)').matches&&!NB.reduce){
    var x=0,held=false,wait=0,last=0,half=0;
    var hold=function(){held=true};
    var free=function(){held=false;wait=Date.now()+3000};
    t.addEventListener('touchstart',hold,{passive:true});
    t.addEventListener('touchend',free,{passive:true});
    t.addEventListener('touchcancel',free,{passive:true});
    t.addEventListener('scroll',function(){
      half=tr.scrollWidth/2;
      if(t.scrollLeft>=half)t.scrollLeft-=half;
      else if(held&&t.scrollLeft<=0)t.scrollLeft+=half;
    },{passive:true});
    (function run(now){
      var dt=Math.min(now-last,100);last=now;
      if(held||Date.now()<wait||t.classList.contains('stop')||!NB.live(t))x=t.scrollLeft;
      else{half=tr.scrollWidth/2;x+=dt*0.035;if(x>=half)x-=half;t.scrollLeft=x}
      requestAnimationFrame(run);
    })(0);
  }
};
})();
