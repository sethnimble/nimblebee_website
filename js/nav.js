/* Nav: burger toggles the mobile menu; Escape closes it from anywhere and returns focus to the burger; choosing a link closes it. */
(function(){
'use strict';
var NB=window.NB;
NB.mods.nav=function(n){
  var b=NB.$('.burger',n),m=NB.$('.menu',n);if(!b||!m)return;
  function set(o){m.hidden=!o;b.setAttribute('aria-expanded',o);b.querySelector('.ic').innerHTML=NB.icon(o?'x':'menu');b.setAttribute('aria-label',o?'Close menu':'Open menu')}
  m.hidden=true;
  b.addEventListener('click',function(){set(m.hidden)});
  m.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden){set(false);b.focus()}});
};
})();
