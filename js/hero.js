/* Hero shell: the pause control stops the headline, the bubble and every tile (WCAG 2.2.2). */
(function(){
'use strict';
var NB=window.NB;
NB.mods.hero=function(sec){
  /* two copies of the control: under the lede (desktop) and under the tiles (phone); only one is shown at a time, both stay in step */
  var btns=Array.prototype.slice.call(sec.querySelectorAll('[data-pause]'));if(!btns.length)return;
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      NB.paused=!NB.paused;document.documentElement.classList.toggle('nb-paused',NB.paused);
      btns.forEach(function(b){
        b.setAttribute('aria-pressed',NB.paused);
        b.setAttribute('aria-label',NB.paused?'Play animation':'Pause animation');
        b.querySelector('.ic').innerHTML=NB.icon(NB.paused?'play':'pause');
      });
    });
  });
};
})();
