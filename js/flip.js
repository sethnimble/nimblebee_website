/* Our builds: each card flips to a short showreel. It plays muted on flip; pause, sound and Back are buttons (WCAG 2.2.2).
   Under reduced motion nothing autoplays, the viewer presses play. Only one card is open at a time. */
(function(){
'use strict';
var NB=window.NB,current=null;
NB.mods.flip=function(f){
  var v=NB.$('video',f),front=NB.$('.front',f),back=NB.$('.back',f);
  var go=NB.$('.flipbtn',f),play=NB.$('.vplay',f),snd=NB.$('.vsound',f),bk=NB.$('.vback',f);
  if(!v||!go||!front||!back||f._flip)return;f._flip=1;
  var isOpen=false,want=false; /* want: the card is open and the viewer has not paused it */

  function setPlay(){var on=!v.paused;play.setAttribute('aria-label',on?'Pause video':'Play video');NB.$('.ic',play).innerHTML=NB.icon(on?'pause':'play')}
  function setSnd(){var m=v.muted;snd.setAttribute('aria-pressed',!m);snd.setAttribute('aria-label',m?'Turn sound on':'Turn sound off');NB.$('.ic',snd).innerHTML=NB.icon(m?'volume-x':'volume-2')}
  function run(){var p=v.play();if(p&&p.catch)p.catch(function(){want=false;setPlay()})}

  function open(){
    if(current&&current!==api)current.close(false);
    current=api;isOpen=true;
    f.classList.add('open');go.setAttribute('aria-expanded','true');
    front.inert=true;back.inert=false;
    v.muted=true;setSnd();
    want=!NB.reduce;if(want)run();setPlay();
    setTimeout(function(){bk.focus({preventScroll:true})},NB.reduce?0:350);
  }
  function close(refocus){
    if(!isOpen)return;
    isOpen=false;want=false;v.pause();v.load(); /* load() puts the poster back and fetches nothing (preload none) */
    f.classList.remove('open');go.setAttribute('aria-expanded','false');
    back.inert=true;front.inert=false;
    if(current===api)current=null;
    if(refocus)go.focus({preventScroll:true});
  }
  var api={close:close};

  go.addEventListener('click',open);
  bk.addEventListener('click',function(){close(true)});
  play.addEventListener('click',function(){if(v.paused){want=true;run()}else{want=false;v.pause()}});
  snd.addEventListener('click',function(){v.muted=!v.muted;setSnd()});
  v.addEventListener('play',setPlay);v.addEventListener('pause',setPlay);
  f.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen){e.stopPropagation();close(true)}});

  /* off screen or in a hidden tab: stop playing (and its sound); resume when back if the viewer had not paused it */
  function stop(){if(!v.paused)v.pause()}
  function resume(){if(isOpen&&want&&v.paused)run()}
  if(window.IntersectionObserver)new IntersectionObserver(function(es){es[0].isIntersecting?resume():stop()},{threshold:.25}).observe(f);
  document.addEventListener('visibilitychange',function(){document.hidden?stop():resume()});
};
})();
