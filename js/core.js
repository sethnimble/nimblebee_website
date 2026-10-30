/* NimbleBee site core: plain JS, no dependencies. Sections register a module on NB.mods and are wired by NB.mount(root).
   Load order: core.js, then the section files (nav.js, headline.js, tiles.js, bubble.js, hero.js), then boot.js last. */
(function(){
'use strict';
var NB=window.NB=window.NB||{};NB.mods=NB.mods||{};
var mq=matchMedia('(prefers-reduced-motion:reduce)');NB.reduce=mq.matches;
if(mq.addEventListener)mq.addEventListener('change',function(e){NB.reduce=e.matches});
NB.paused=false;
document.documentElement.classList.add('nbjs');

NB.$=function(s,r){return(r||document).querySelector(s)};
NB.$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
NB.rnd=function(a,b){return a+Math.random()*(b-a)};

/* icons live in the inline sprite at the top of the page (symbols named i-<name>) */
NB.icon=function(name){return'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-'+name+'"/></svg>'};
NB.icons=function(root){NB.$$('[data-ic]',root).forEach(function(i){if(i.firstChild)return;i.classList.add('ic');i.setAttribute('aria-hidden','true');i.innerHTML=NB.icon(i.dataset.ic)})};

/* true while an element is on screen, the tab is visible and the pause control is off */
NB.live=function(el){
  if(NB.paused||document.hidden||el.offsetParent===null)return false;
  if(!el._io){el._vis=true;el._io=new IntersectionObserver(function(es){el._vis=es[0].isIntersecting});el._io.observe(el)}
  return el._vis!==false;
};

NB.mount=function(root){
  if(!root||root._nb)return;root._nb=1;
  NB.icons(root);
  var els=NB.$$('[data-mod]',root);if(root.dataset&&root.dataset.mod)els.unshift(root);
  els.forEach(function(el){el.dataset.mod.split(' ').forEach(function(m){if(NB.mods[m])NB.mods[m](el)})});
};
})();
