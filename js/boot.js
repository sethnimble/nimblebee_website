/* Wires every section once the DOM is ready. Ports 2 and 3 add their section ids to the list. */
(function(){
  var IDS=['nb-nav','nb-hero','nb-problem','how','cases'];
  function go(){IDS.forEach(function(id){var el=document.getElementById(id);if(el&&window.NB)NB.mount(el)});if(window.NB)NB.idle('.hero,.tapewrap,.deco,.board')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
