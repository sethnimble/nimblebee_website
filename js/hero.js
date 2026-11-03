/* Hero shell: the pause control stops the headline, the bubble and every tile (WCAG 2.2.2). */
(function(){
'use strict';
var NB=window.NB;
NB.mods.hero=function(sec){
  var btn=NB.$('[data-pause]',sec);if(!btn)return;
  btn.addEventListener('click',function(){
    NB.paused=!NB.paused;document.documentElement.classList.toggle('nb-paused',NB.paused);
    btn.setAttribute('aria-pressed',NB.paused);
    btn.setAttribute('aria-label',NB.paused?'Play animation':'Pause animation');
    btn.querySelector('.ic').innerHTML=NB.icon(NB.paused?'play':'pause');
  });
};
})();
