/* Hero headline: "Ready to go. Built to ___." The last word swaps, with a marker swipe drawn under it. Edit WORDS to change the list. */
(function(){
'use strict';
var NB=window.NB,$=NB.$,$$=NB.$$;
var WORDS=['grow','stick','last','adapt','change'];
var MC=['var(--mint)','var(--butter)','var(--cyan)','var(--peach)','var(--pink)'];
var PATHS=[[.03,.56,.25,.40,.45,.64,.65,.50,.90,.42,.99,.48],[.02,.46,.20,.62,.50,.40,.72,.56,.92,.46,.99,.40],[.04,.52,.30,.38,.55,.62,.78,.46,.96,.60,.99,.50]];
NB.mods.kin=function(h){
  var i=0;
  function chars(t){return t.split(' ').map(function(w){return'<span class="wd">'+w.split('').map(function(c){return'<span class="ch" style="--i:'+(i++)+'">'+c+'</span>'}).join('')+'</span>'}).join(' ')}
  var l1=chars('Ready to go.'),b=chars('Built to');
  var sw=WORDS.map(function(w,k){return'<span class="sw'+(k?'':' on init')+'">'+w.split('').map(function(c,j){return'<span class="ch" style="--i:'+(i+j)+';--j:'+j+'">'+c+'</span>'}).join('')+'</span>'}).join('');
  h.innerHTML='<span class="ln">'+l1+'</span><span class="ln">'+b+' <span class="hlw"><svg class="mk hid" aria-hidden="true"><g><path class="p1" pathLength="1"/><path class="p2" pathLength="1"/></g></svg><span class="sws">'+sw+'</span></span></span>';
  var mk=$('.mk',h),p1=$('.p1',h),p2=$('.p2',h),sws=$$('.sw',h),cur=0;
  var pv=0,rot=-1;
  function build(){
    var w=mk.clientWidth||mk.getBoundingClientRect().width,hh=mk.clientHeight||mk.getBoundingClientRect().height,fs=parseFloat(getComputedStyle(h).fontSize);
    if(!w)return;
    mk.setAttribute('viewBox','0 0 '+w+' '+hh);
    mk.style.setProperty('--sw',(fs*.46).toFixed(1)+'px');
    var a=PATHS[pv],f=function(k){return(a[k]*(k%2?hh:w)).toFixed(1)};
    p1.setAttribute('d','M'+f(0)+','+f(1)+' C'+f(2)+','+f(3)+' '+f(4)+','+f(5)+' '+f(6)+','+f(7)+' S'+f(8)+','+f(9)+' '+f(10)+','+f(11));
    var y=.72*hh,y2=.76*hh;
    p2.setAttribute('d','M'+(w*.9).toFixed(1)+','+y.toFixed(1)+' C'+(w*.7).toFixed(1)+','+(y+hh*.07).toFixed(1)+' '+(w*.42).toFixed(1)+','+(y-hh*.04).toFixed(1)+' '+(w*.16).toFixed(1)+','+y2.toFixed(1));
  }
  function draw(k){
    pv=(pv+1+Math.floor(Math.random()*2))%PATHS.length;rot=(rot>0?-1:1)*NB.rnd(.6,1.8);
    mk.style.setProperty('--hc',MC[k]);mk.style.setProperty('--mr',rot.toFixed(2)+'deg');
    mk.classList.remove('erase','hid','draw');build();void mk.getBoundingClientRect();mk.classList.add('draw');
  }
  mk.style.setProperty('--hc',MC[0]);
  if(NB.reduce){sws.forEach(function(s){s.classList.remove('init')});mk.classList.remove('hid');requestAnimationFrame(build)}
  else{setTimeout(function(){draw(0)},1000)}
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(!mk.classList.contains('hid'))build()},120)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!mk.classList.contains('hid'))build()});
  function next(){
    mk.classList.remove('draw');void mk.getBoundingClientRect();mk.classList.add('erase');
    setTimeout(function(){
      var old=sws[cur];cur=(cur+1)%sws.length;
      old.classList.remove('on','init');old.classList.add('out');setTimeout(function(){old.classList.remove('out')},300);
      sws[cur].classList.add('on');
    },150);
    setTimeout(function(){draw(cur)},150+130+WORDS[(cur+1)%WORDS.length].length*34+120);
  }
  if(!NB.reduce)setInterval(function(){if(!NB.paused&&!document.hidden&&NB.live(h))next()},3800);
};
})();
