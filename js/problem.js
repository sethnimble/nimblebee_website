/* Problem: the toggle tidies six scattered notes into "A system." */
(function(){
'use strict';
var NB=window.NB;
NB.mods.problem=function(sec){
  var b=NB.$('.toggle',sec),tl=NB.$('.tl',sec),board=NB.$('.board',sec);if(!b||!board)return;
  b.addEventListener('click',function(){
    var on=!board.classList.contains('tidy');
    board.classList.toggle('tidy',on);b.setAttribute('aria-pressed',on);
    tl.textContent=on?'Show the chaos':'Show it as a system';
  });
};
})();
