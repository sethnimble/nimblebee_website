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
};
})();
