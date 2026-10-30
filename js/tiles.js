/* Hero tiles: the six "I need..." needs and the mini picture each one acts out.
   w is what the bubble types after "I need" (solo: true types the whole sentence instead), lab is the tile label,
   f is the pastel fill, ms how long the tile plays, rest the frame (ms) an inactive tile is held on. */
(function(){
'use strict';
var NB=window.NB;
var HXP='M87.01,32.50 Q100.00,25.00 112.99,32.50 L164.95,62.50 Q177.94,70.00 177.94,85.00 L177.94,145.00 Q177.94,160.00 164.95,167.50 L112.99,197.50 Q100.00,205.00 87.01,197.50 L35.05,167.50 Q22.06,160.00 22.06,145.00 L22.06,85.00 Q22.06,70.00 35.05,62.50 Z';
function hex(cls){return'<svg class="hxs'+(cls?' '+cls:'')+'" viewBox="22 25 156 180" aria-hidden="true"><path d="'+HXP+'"/></svg>'}
var TKS='<svg class="tks" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

NB.TILES=[
  {k:'web',w:'a website',lab:'Website',f:'cyan',ms:6000,rest:3200},
  {k:'gl',w:'my Google listing sorted',lab:'Google listing',f:'butter',ms:6000,rest:4600},
  {k:'wk',w:'a wiki',lab:'Wiki',f:'mint',ms:6000,rest:4800},
  {k:'ai',w:'an AI assistant',lab:'AI assistant',f:'pink',ms:6000,rest:4800},
  {k:'app',w:'an app I own',lab:'Your own app',f:'peach',ms:6000,rest:5000},
  {k:'ns',w:'I’m not sure where to start',solo:true,lab:'Not sure',f:'paper',ms:7000,rest:300}
];

NB.tileHTML=function(k){
  var lb=function(t){return'<div class="nt-lb">'+t+'</div>'},st=function(h){return'<div class="nt-stage">'+h+'</div>'},bar='<i class="nt-bar"></i>';
  var it=NB.TILES.filter(function(x){return x.k===k})[0],cls='nt'+(k==='ns'?' moon':''),h;
  if(k==='web')h=st('<div class="web"><div class="wb-top"><i></i><i></i><i></i></div><div class="wb-body"><i class="wb-h"></i><i class="wb-c"></i><i class="wb-c b"></i><i class="wb-btn"></i></div></div><svg class="wb-cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8-6 1.6L10 19z"/></svg>')+lb(it.lab);
  if(k==='gl')h=st('<div class="gl"><div class="gl-top"><span class="gl-pin">'+hex()+'</span><div class="gl-nm"><i></i><i></i></div></div><div class="gl-st">'+hex('sm')+hex('sm')+hex('sm')+hex('sm')+hex('sm')+'</div><div class="gl-bt"><i></i><i></i></div></div>')+lb(it.lab);
  if(k==='wk')h=st('<div class="wk"><div class="wk-nv"><i></i><i></i><i></i></div><div class="wk-pg"><i class="wk-t"></i><i class="wk-l"></i><i class="wk-l"></i><i class="wk-l"></i><i class="wk-k"></i></div></div>')+lb(it.lab);
  if(k==='ai')h=st('<div class="ai"><div class="ai-u">'+bar+'</div><div class="ai-r"><span class="ai-av">'+hex()+'</span><div class="ai-b">'+bar+bar+'<span class="ai-dots"><i></i><i></i><i></i></span><span class="ai-tk">'+TKS+'</span></div></div></div>')+lb(it.lab);
  if(k==='app')h=st('<div class="crm"><div class="lane"><i class="hd"></i><i class="sp"></i><div class="cc"><i class="av"></i>'+bar+'</div></div><div class="lane"><i class="hd" style="width:44%"></i><i class="sp"></i><div class="cc"><i class="av" style="background:var(--butter)"></i>'+bar+'</div></div><div class="lane"><i class="hd" style="width:52%"></i><i class="sp"></i></div></div><div class="cc mv"><i class="av"></i>'+bar+'<span class="tk">'+TKS+'</span></div>')+lb(it.lab);
  if(k==='ns')h='<div class="ms-stage"><i class="ms-sky"></i>'+[[14,16],[78,12],[84,50],[22,48],[60,8]].map(function(p,n){return'<i class="ms-st" style="left:'+p[0]+'%;top:'+p[1]+'%;animation-delay:'+(n*.12).toFixed(2)+'s"></i>'}).join('')+'<i class="ms-blank"></i><i class="ms-pf"></i><i class="ms-pf b"></i><div class="ms-r"><i class="fl"></i><i class="fn l"></i><i class="fn r"></i><i class="bd"></i><i class="wn"></i></div></div><div class="nt-lb ms-lb">Not sure?</div><div class="nt-lb ms-lb b">We’ll guide you</div>';
  return'<div class="'+cls+'" style="--f:var(--'+it.f+')" data-k="'+k+'">'+h+'</div>';
};
})();
