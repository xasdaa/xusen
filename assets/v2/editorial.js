(()=>{
 const archive=n=>'assets/works/previews/archive-2025-'+String(n).padStart(3,'0')+'.webp';
 const groups=[
  {id:'brand-overview',title:'品牌与营销视觉概览',tag:'01 / BRAND & CAMPAIGN',description:'两组项目概览，查看完整展示页。',pages:[3,4],cover:[3]},
  {id:'product-visual',title:'产品与场景视觉',tag:'02 / PRODUCT & SCENE',description:'汽车场景与黑金产品系列，分组浏览。',pages:[43,44,45,5,6,7,8,9,10,11,12,13,14,15],cover:[43]},
  {id:'wine-brand',title:'葡萄酒品牌视觉系统',tag:'03 / BRAND SYSTEM',description:'从品牌字体规范，到产品与营销应用。',pages:[100,101,102,103,104,105,106,107,108,72,73,82,86,70],cover:[100,108],feature:true},
  {id:'campaign-collection',title:'多品类营销视觉',tag:'04 / CAMPAIGN COLLECTION',description:'不同产品与传播场景中的系列设计。',pages:[50,51,63,64,65,67,68],cover:[51]},
  {id:'design-process',title:'设计思考与项目流程',tag:'05 / DESIGN PROCESS',description:'需求梳理、排期与项目管理等过程记录。',pages:[95,96,97,98,99],cover:[96]}
 ];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const work=document.getElementById('work-groups');
 work.innerHTML=groups.map(g=>`<button class="work-card${g.feature?' feature':''}" type="button" data-open-group="${g.id}" aria-label="查看${g.title}"><span class="work-cover">${g.cover.map(p=>`<img src="${archive(p)}" width="1600" height="900" alt="${esc(g.title)}展示页" loading="lazy">`).join('')}<span class="open-badge" aria-hidden="true">↗</span></span><span class="work-card-meta"><span>${g.tag}</span><span>${String(g.pages.length).padStart(2,'0')} PAGES</span></span><h3>${g.title}</h3><p>${g.description}</p></button>`).join('');
 const gallery=new Map(groups.map(g=>[g.id,{title:g.title,tag:g.tag,images:g.pages.map(n=>({src:archive(n),alt:g.title+' · 第 '+n+' 页'}))}]));
 gallery.set('presentation',{title:'小院智饮 · 自助设备',tag:'PRESENTATION / 25 PAGES',images:Array.from({length:25},(_,i)=>({src:'assets/v2/content/presentation-'+String(i+1).padStart(2,'0')+'.webp',alt:'小院智饮演示文稿第 '+(i+1)+' 页'}))});
 const dialog=document.getElementById('work-viewer'),image=document.getElementById('viewer-image'),thumbs=document.getElementById('viewer-thumbs');
 let active=null,index=0,opener=null,slide=0;
 const prev=document.getElementById('viewer-prev'),next=document.getElementById('viewer-next');
 function show(i){index=Math.max(0,Math.min(active.images.length-1,i));const item=active.images[index];image.src=item.src;image.alt=item.alt;document.getElementById('viewer-counter').textContent=String(index+1).padStart(2,'0')+' / '+String(active.images.length).padStart(2,'0');prev.disabled=index===0;next.disabled=index===active.images.length-1;[...thumbs.children].forEach((b,n)=>b.setAttribute('aria-pressed',String(n===index)));thumbs.children[index]?.scrollIntoView({block:'nearest',inline:'nearest'});}
 document.addEventListener('click',e=>{
  const open=e.target.closest('[data-open-group]');if(open){active=gallery.get(open.dataset.openGroup);if(!active)return;opener=open;document.getElementById('viewer-title').textContent=active.title;document.getElementById('viewer-kicker').textContent=active.tag;thumbs.innerHTML=active.images.map((im,n)=>`<button type="button" data-view-index="${n}" aria-label="查看第 ${n+1} 页" aria-pressed="false"><img src="${im.src}" alt="" loading="lazy"></button>`).join('');dialog.showModal();document.body.classList.add('viewer-open');show(open.dataset.openGroup==='presentation'?slide:0);document.getElementById('viewer-close').focus();}
  const thumb=e.target.closest('[data-view-index]');if(thumb)show(Number(thumb.dataset.viewIndex));
  const collapse=e.target.closest('[data-collapse]');if(collapse){const details=collapse.closest('details');const summary=details.querySelector('summary');details.open=false;summary.focus();summary.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
 });
 document.getElementById('viewer-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');opener?.focus();image.removeAttribute('src');});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
 const slideImg=document.getElementById('presentation-image'),slidePrev=document.getElementById('presentation-prev'),slideNext=document.getElementById('presentation-next');
 function showSlide(n){slide=Math.max(0,Math.min(24,n));const item=gallery.get('presentation').images[slide];slideImg.src=item.src;slideImg.alt=item.alt;document.getElementById('presentation-counter').textContent=String(slide+1).padStart(2,'0')+' / 25';slidePrev.disabled=slide===0;slideNext.disabled=slide===24;}
 slidePrev.addEventListener('click',()=>showSlide(slide-1));slideNext.addEventListener('click',()=>showSlide(slide+1));
 const long=document.getElementById('c9x-project'),tiles=document.getElementById('long-page-tiles');
 let manifest=null,device=matchMedia('(max-width:767px)').matches?'mobile':'pc',request=null;
 async function showLong(){if(!manifest){try{request??=fetch('assets/v2/content/long-pages.json').then(r=>{if(!r.ok)throw Error('load');return r.json()});manifest=await request;}catch{tiles.innerHTML='<p class="muted-copy">页面暂时未能加载，请收起后重新展开。</p>';request=null;return;}}if(!long.open)return;tiles.className='long-tiles';tiles.dataset.device=device;tiles.innerHTML=manifest[device].map((im,i)=>`<img src="${im.src}" width="${im.width}" height="${im.height}" alt="C9X ${device==='pc'?'PC':'移动端'}页面，第 ${i+1} 段" loading="${i===0?'eager':'lazy'}" decoding="async">`).join('');long.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===device)));}
 long.addEventListener('toggle',()=>{if(long.open)showLong();});
 long.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',()=>{device=b.dataset.device;showLong();}));
})();
