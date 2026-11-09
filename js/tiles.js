/* Hero tiles: the six "I need..." needs and the mini picture each one acts out.
   w is what the bubble types after "I need" (solo: true types the whole sentence instead), lab is the tile label,
   f is the pastel fill, ms how long the tile plays, rest the frame (ms) an inactive tile is held on. */
(function(){
'use strict';
var NB=window.NB;
var HXP='M87.01,32.50 Q100.00,25.00 112.99,32.50 L164.95,62.50 Q177.94,70.00 177.94,85.00 L177.94,145.00 Q177.94,160.00 164.95,167.50 L112.99,197.50 Q100.00,205.00 87.01,197.50 L35.05,167.50 Q22.06,160.00 22.06,145.00 L22.06,85.00 Q22.06,70.00 35.05,62.50 Z';
function hex(cls){return'<svg class="hxs'+(cls?' '+cls:'')+'" viewBox="22 25 156 180" aria-hidden="true"><path d="'+HXP+'"/></svg>'}
var TKS='<svg class="tks" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

var STM='<svg viewBox="0 0 10 26" aria-hidden="true"><path d="M5 25C1 20 9 16 5 11 2 7 8 4 5 1"/></svg>';
function stm(c,d){return'<span class="stm '+c+'"'+(d?' style="animation-delay:'+d+'s"':'')+'>'+STM+'</span>'}

NB.TILES=[
  {k:'ag',w:'an AI agent',lab:'AI agent',f:'butter',ms:6000,rest:5000},
  {k:'app',w:'my own app',lab:'Your own app',f:'peach',ms:6000,rest:5000},
  {k:'web',w:'a website',lab:'Website',f:'cyan',ms:6000,rest:3200},
  {k:'wk',w:'training & how-to guides',lab:'Training',f:'mint',ms:6000,rest:4800},
  {k:'ad',w:'my admin sorted',lab:'Admin sorted',f:'pink',ms:6000,rest:5000},
  {k:'tt',w:'to talk it through',lab:'Talk it through',f:'mint',ms:6000,rest:5000}
];

NB.tileHTML=function(k){
  var lb=function(t){return'<div class="nt-lb">'+t+'</div>'},st=function(h){return'<div class="nt-stage">'+h+'</div>'},bar='<i class="nt-bar"></i>';
  var it=NB.TILES.filter(function(x){return x.k===k})[0],cls='nt',h;
  if(k==='web')h=st('<div class="web"><div class="wb-top"><i></i><i></i><i></i></div><div class="wb-body"><i class="wb-h"></i><i class="wb-c"></i><i class="wb-c b"></i><i class="wb-btn"></i></div></div><svg class="wb-cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8-6 1.6L10 19z"/></svg>')+lb(it.lab);
  if(k==='wk')h=st('<div class="wk"><div class="wk-nv"><i></i><i></i><i></i></div><div class="wk-pg"><i class="wk-t"></i><i class="wk-l"></i><i class="wk-l"></i><i class="wk-l"></i><i class="wk-k"></i></div></div>')+lb(it.lab);
  if(k==='app')h=st('<div class="crm"><div class="lane"><i class="hd"></i><i class="sp"></i><div class="cc"><i class="av"></i>'+bar+'</div></div><div class="lane"><i class="hd" style="width:44%"></i><i class="sp"></i><div class="cc"><i class="av" style="background:var(--butter)"></i>'+bar+'</div></div><div class="lane"><i class="hd" style="width:52%"></i><i class="sp"></i></div></div><div class="cc mv"><i class="av"></i>'+bar+'<span class="tk">'+TKS+'</span></div>')+lb(it.lab);
  if(k==='ag')h=st('<div class="ag"><div class="ag-r me"><div class="ag-b me"><i class="nt-bar" style="opacity:.35"></i><i class="nt-bar" style="width:62%;opacity:.35"></i></div><i class="ag-av"></i></div><div class="ag-r"><div class="ag-bt"><i></i><i></i></div><div class="ag-b bot"><span class="ag-dots"><i></i><i></i><i></i></span>'+bar+'<i class="nt-bar" style="width:70%"></i></div></div><div class="ag-tk"><span class="ag-cb"><span class="ag-cf">'+TKS+'</span></span>'+bar+'</div></div>')+lb(it.lab);
  if(k==='ad')h=st('<div class="ad"><i class="ad-f f1"></i><i class="ad-f f2"></i><i class="ad-f f3"></i><i class="ad-f f4"></i><div class="ad-tray"><i></i></div><span class="ad-ok">'+TKS+'</span></div>')+lb(it.lab);
  if(k==='tt')h=st('<div class="tt"><div class="mug l">'+stm('a')+stm('b')+'<i class="hx"></i></div><div class="mug r">'+stm('a',.75)+stm('b',2.25)+'<i class="hx" style="background:var(--butter)"></i></div><span class="tt-sp"><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M12 10V2M5 12 1 7M19 12l4-5"/></svg></span><i class="tt-tb"></i></div>')+lb(it.lab);
  return'<div class="'+cls+'" style="--f:var(--'+it.f+')" data-k="'+k+'">'+h+'</div>';
};
})();
