(()=>{
 const section=document.getElementById('halloween-case'),details=document.getElementById('halloween-details');
 const dialog=document.getElementById('case-zoom'),scroll=document.getElementById('zoom-scroll'),zoomDocument=document.getElementById('zoom-document');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let zoom=1,returnFocus=null,drag=null;
 const minus=document.getElementById('zoom-minus'),plus=document.getElementById('zoom-plus');
 function fit(frame){const width=Number(frame.dataset.nativeWidth),height=Number(frame.dataset.nativeHeight);if(!width||!frame.clientWidth)return;const scale=frame.clientWidth/width;frame.style.height=height*scale+'px';frame.querySelector('.native-page').style.transform='scale('+scale+')';}
 const frames=[...section.querySelectorAll('.native-frame')];
 const resize=new ResizeObserver(entries=>entries.forEach(e=>fit(e.target)));
 frames.forEach(f=>{fit(f);resize.observe(f);});
 details.addEventListener('toggle',()=>{if(details.open)requestAnimationFrame(()=>frames.forEach(fit));});
 function updateZoom(){zoomDocument.style.width=1920*zoom+'px';zoomDocument.style.height=5300*zoom+'px';zoomDocument.querySelector('.native-page').style.transform='scale('+zoom+')';document.getElementById('zoom-value').value=Math.round(zoom*100)+'%';minus.disabled=zoom<=.25;plus.disabled=zoom>=2;}
 function openZoom(opener){returnFocus=opener;zoom=1;zoomDocument.replaceChildren(section.querySelector('.native-case-page').cloneNode(true));dialog.showModal();document.body.classList.add('case-zoom-open');updateZoom();scroll.scrollTop=0;scroll.scrollLeft=0;document.getElementById('zoom-close').focus();}
 section.querySelectorAll('[data-case-zoom]').forEach(el=>el.addEventListener('click',()=>openZoom(el)));
 section.querySelectorAll('[data-case-close]').forEach(el=>el.addEventListener('click',()=>{details.open=false;const summary=details.querySelector('summary');summary.focus();section.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});}));
 minus.addEventListener('click',()=>{zoom=Math.max(.25,zoom-.25);updateZoom();});
 plus.addEventListener('click',()=>{zoom=Math.min(2,zoom+.25);updateZoom();});
 document.getElementById('zoom-fit').addEventListener('click',()=>{zoom=scroll.clientWidth/1920;updateZoom();scroll.scrollLeft=0;});
 document.getElementById('zoom-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('case-zoom-open');returnFocus?.focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 scroll.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('.native-text'))return;drag={x:e.clientX,y:e.clientY,left:scroll.scrollLeft,top:scroll.scrollTop};scroll.setPointerCapture(e.pointerId);scroll.classList.add('dragging');});
 scroll.addEventListener('pointermove',e=>{if(!drag)return;scroll.scrollLeft=drag.left+drag.x-e.clientX;scroll.scrollTop=drag.top+drag.y-e.clientY;});
 const stop=()=>{drag=null;scroll.classList.remove('dragging');};scroll.addEventListener('pointerup',stop);scroll.addEventListener('pointercancel',stop);
})();
