/* Hero bubble: types out each need after "I need" and lights the matching tile. Click the bubble or a tile to skip ahead. */
(function(){
'use strict';
var NB=window.NB,$=NB.$,$$=NB.$$;
NB.mods.bubble=function(w){
  var wd=$('.w',w),pre=$('.pre',w),slots=$$('.slot',w),bub=$('.bub',w),box=$('.tiles',w),IT=NB.TILES;
  var ts=IT.map(function(it,k){slots[k].innerHTML=NB.tileHTML(it.k);return slots[k].firstChild});
  if(NB.reduce){box.classList.add('all');wd.textContent='a website, a wiki, an AI assistant…';return}
  var an=function(t){return t.getAnimations?t.getAnimations({subtree:true}):[]};
  var cur=-1,gen=0,idx=0,SP=1.25;
  function rest(k){ts[k].classList.remove('on');an(ts[k]).forEach(function(a){a.pause();a.currentTime=IT[k].rest})}
  function lit(k){cur=k;ts[k].classList.add('on');an(ts[k]).forEach(function(a){a.playbackRate=SP;a.currentTime=0;if(!NB.paused)a.play()})}
  new MutationObserver(function(){if(cur<0)return;an(ts[cur]).forEach(function(a){NB.paused?a.pause():a.play()})}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  requestAnimationFrame(function(){ts.forEach(function(t,k){rest(k)})});
  function wait(f,ms,g){setTimeout(function(){if(g===gen)f()},ms)}
  function hold(ms,f,g){var t=0;(function tick(){if(g!==gen)return;if(NB.live(w))t+=200;if(t>=ms)f();else setTimeout(tick,200)})()}
  function go(g){
    if(g!==gen)return;
    if(!NB.live(w)){wait(function(){go(g)},500,g);return}
    var k=idx++%IT.length,word=IT[k].w,i=0;
    pre.hidden=!!IT[k].solo;
    (function ty(){
      if(!NB.live(w)){wait(ty,400,g);return}
      i++;wd.textContent=word.slice(0,i);
      if(i<word.length)wait(ty,NB.rnd(36,64),g);
      else{lit(k);hold((IT[k].ms+300)/SP,function(){(function del(){wd.textContent=word.slice(0,--i);if(i>0)wait(del,16,g);else{rest(k);cur=-1;wait(function(){go(g)},240,g)}})()},g)}
    })();
  }
  function restart(){gen++;if(cur>-1){rest(cur);cur=-1}wd.textContent='';pre.hidden=false;go(gen)}
  function jump(k){idx=k;restart()}
  box.removeAttribute('aria-hidden');
  slots.forEach(function(s,k){
    s.setAttribute('role','button');s.tabIndex=0;s.setAttribute('aria-label','Show: '+(IT[k].solo?'':'I need ')+IT[k].w);ts[k].setAttribute('aria-hidden','true');
    s.addEventListener('click',function(){jump(k)});
    s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();jump(k)}});
  });
  setTimeout(function(){go(gen)},120);
  bub.addEventListener('click',restart);
  w.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var rc=w.getBoundingClientRect();bub.style.translate=(((e.clientX-rc.left)/rc.width-.5)*10).toFixed(1)+'px '+(((e.clientY-rc.top)/rc.height-.5)*6).toFixed(1)+'px'});
  w.addEventListener('pointerleave',function(){bub.style.translate=''});
};
})();
