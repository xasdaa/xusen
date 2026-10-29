(()=>{
 const section=document.getElementById('halloween-case'),details=document.getElementById('halloween-details');
 const dialog=document.getElementById('case-zoom'),scroll=document.getElementById('zoom-scroll'),zoomImage=document.getElementById('zoom-image');
 const caseImage=section.querySelector('.original-case-image');
 const mobile=matchMedia('(max-width:767px)');
 const full=()=>mobile.matches?caseImage.dataset.mobile:caseImage.dataset.src;
 const baseWidth=()=>mobile.matches?1200:1920;
 function loadCase(){
  caseImage.width=mobile.matches?1200:3840;caseImage.height=mobile.matches?7733:9327;
  if(mobile.matches)caseImage.removeAttribute('srcset');else caseImage.srcset=caseImage.dataset.srcset;
  if(caseImage.getAttribute('src')!==full())caseImage.src=full();
 }
 details.addEventListener('toggle',()=>{if(details.open)loadCase();});
 if(details.open)loadCase();
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let zoom=1,returnFocus=null,drag=null;
 const minus=document.getElementById('zoom-minus'),plus=document.getElementById('zoom-plus');
 function updateZoom(){zoomImage.width=mobile.matches?1200:3840;zoomImage.height=mobile.matches?7733:9327;zoomImage.style.setProperty('--case-zoom-width',Math.round(baseWidth()*zoom)+'px');document.getElementById('zoom-value').value=Math.round(zoom*100)+'%';minus.disabled=zoom<=.25;plus.disabled=zoom>=2;}
 function openZoom(opener){returnFocus=opener;zoom=1;zoomImage.src=full();dialog.showModal();document.body.classList.add('case-zoom-open');updateZoom();scroll.scrollTop=0;scroll.scrollLeft=0;document.getElementById('zoom-close').focus();}
 mobile.addEventListener('change',()=>{if(details.open)loadCase();if(dialog.open){zoomImage.src=full();updateZoom();}});
 section.querySelectorAll('[data-case-zoom]').forEach(el=>el.addEventListener('click',()=>openZoom(el)));
 section.querySelector('.original-case-image').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openZoom(e.currentTarget);}});
 section.querySelectorAll('[data-case-close]').forEach(el=>el.addEventListener('click',()=>{details.open=false;const summary=details.querySelector('summary');summary.focus();section.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});}));
 minus.addEventListener('click',()=>{zoom=Math.max(.25,zoom-.25);updateZoom();});
 plus.addEventListener('click',()=>{zoom=Math.min(2,zoom+.25);updateZoom();});
 document.getElementById('zoom-fit').addEventListener('click',()=>{zoom=scroll.clientWidth/baseWidth();updateZoom();scroll.scrollLeft=0;});
 document.getElementById('zoom-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('case-zoom-open');returnFocus?.focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 scroll.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:scroll.scrollLeft,top:scroll.scrollTop};scroll.setPointerCapture(e.pointerId);scroll.classList.add('dragging');});
 scroll.addEventListener('pointermove',e=>{if(!drag)return;scroll.scrollLeft=drag.left+drag.x-e.clientX;scroll.scrollTop=drag.top+drag.y-e.clientY;});
 const stop=()=>{drag=null;scroll.classList.remove('dragging');};scroll.addEventListener('pointerup',stop);scroll.addEventListener('pointercancel',stop);
})();
