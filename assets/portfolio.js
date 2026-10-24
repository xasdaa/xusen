(() => {
  'use strict';
  const projects=window.portfolioWorks;
  const homeProjects=projects.filter(p=>p.showOnHome!==false);
  document.querySelector('.section-top h2 small').textContent='('+homeProjects.length+')';
  const dialog=document.querySelector('#detail'),player=document.querySelector('#detail-video'),image=document.querySelector('#detail-image');
  const longPage=document.querySelector('#long-page'),mediaBox=document.querySelector('.viewer-media'),thumbnails=document.querySelector('#gallery-thumbnails');
  const videoError=document.querySelector('#video-error'),original=document.querySelector('#original-image'),pageSelect=document.querySelector('#page-select');
  let activeProject=null,activeMedia=0,media=[],opener=null;
  const escapeText=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const metadata=p=>[p.category,p.year].filter(Boolean).join(' / ');
  const stopVideo=()=>{player.pause();player.removeAttribute('src');player.load()};
  const setMedia=index=>{
    if(!media.length)return;
    stopVideo();videoError.hidden=true;image.removeAttribute('src');longPage.replaceChildren();
    activeMedia=(index+media.length)%media.length;
    const item=media[activeMedia];image.hidden=!!item.video||!!item.tiles;player.hidden=!item.video;longPage.hidden=!item.tiles;
    mediaBox.classList.toggle('loading',!item.video&&!item.tiles);
    if(item.video){
      player.setAttribute('aria-label',activeProject.title+' · '+item.label);player.poster=item.poster;player.src=item.src;
      player.play().catch(()=>{if(player.error)videoError.hidden=false});videoError.querySelector('a').href=item.src;
    }else if(item.tiles){
      const inner=document.createElement('div');inner.className='long-page-inner';inner.style.maxWidth=item.tiles[0].width+'px';
      item.tiles.forEach((tile,i)=>{
        const img=document.createElement('img');img.src=tile.src;img.width=tile.width;img.height=tile.height;
        img.alt=activeProject.title+' · '+item.label+' · 第 '+(i+1)+' 段';img.loading=i===0?'eager':'lazy';img.decoding='async';inner.append(img);
      });longPage.append(inner);longPage.scrollTop=0;
    }else{
      image.fetchPriority='high';image.width=item.width;image.height=item.height;image.alt=activeProject.title+' · '+item.label;image.src=item.preview;
    }
    document.querySelector('#image-counter').textContent=(activeMedia+1)+' / '+media.length+' · '+item.label;
    original.href=item.src;original.textContent=item.video?'单独打开视频 ↗':item.kind==='pdf'?'查看 PDF ↗':'查看原图 ↗';pageSelect.value=String(activeMedia);
    thumbnails.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===activeMedia)));
  };
  image.addEventListener('load',()=>mediaBox.classList.remove('loading'));image.addEventListener('error',()=>mediaBox.classList.remove('loading'));
  const openProject=(project,button)=>{
    activeProject=project;opener=button;
    media=[...(project.videos||(project.video?[{src:project.video,poster:project.poster,label:'视频'}]:[])).map(v=>({...v,video:true})),...(project.images||[])];
    document.querySelector('#detail-title').textContent=project.title;document.querySelector('#detail-meta').textContent=metadata(project);
    document.querySelector('#detail-description').textContent=project.description||(media.length+' 张作品 · 点击“查看原图”可打开高清版本。');
    thumbnails.hidden=media.length<2;thumbnails.replaceChildren();pageSelect.replaceChildren();pageSelect.hidden=!project.archive;
    media.forEach((item,i)=>{
      const b=document.createElement('button');b.setAttribute('aria-label','查看第 '+(i+1)+' 项：'+item.label);
      b.innerHTML='<img src="'+(item.thumb||item.poster||item.preview)+'" alt="" loading="lazy" decoding="async">'+(item.video?'<span aria-hidden="true">▶</span>':'');
      b.addEventListener('click',()=>setMedia(i));thumbnails.append(b);
      if(project.archive){const option=document.createElement('option');option.value=i;option.textContent=item.label;pageSelect.append(option)}
    });
    document.querySelector('#previous-image').disabled=media.length<2;document.querySelector('#next-image').disabled=media.length<2;
    dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');setMedia(project.videos||project.video?0:project.pageProject?(matchMedia('(max-width:700px)').matches?1:0):project.cover||0);
  };
  const loadCard=img=>{
    if(!img.dataset.src)return;
    img.addEventListener('load',()=>img.classList.remove('pending'),{once:true});img.addEventListener('error',()=>{img.classList.remove('pending');img.alt+='（点击查看）'},{once:true});
    if(img.dataset.srcset)img.srcset=img.dataset.srcset;img.src=img.dataset.src;delete img.dataset.src;delete img.dataset.srcset;
  };
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){loadCard(entry.target);observer.unobserve(entry.target)}});
  },{rootMargin:'300px 0px'}):null;
  homeProjects.forEach((p,i)=>{
    const video=!!(p.video||p.videos?.length);
    const cover=p.coverImage||p.images?.[p.cover||0]||{width:1200,height:1600,preview:p.poster,cardSmall:p.posterSmall,cardMedium:p.posterMedium||p.poster};
    const button=document.createElement('button');button.className='project'+(video?' video-project':'');
    button.setAttribute('aria-label',(video?'播放视频作品：':'查看作品：')+p.title);button.dataset.projectId=p.id;
    const count=(p.videos?.length||0)+(p.images?.length||0);
    const badge=p.archive?'109 页旧作 ↗':video?(p.videos?.length>1?'横 / 竖 · 视频':'视频'):count>1?count+' 张 ↗':'';
    const responsive=cover.cardSmall+' 400w, '+cover.cardMedium+' 800w, '+cover.preview+' '+Math.min(1280,cover.width)+'w';
    button.innerHTML='<img class="pending" data-src="'+cover.cardSmall+'" data-srcset="'+responsive+'" sizes="(min-width: 701px) min(calc(50vw - 47px), calc(75svh - 156px)), calc(50vw - 6px)" alt="'+escapeText(p.title)+'" width="'+cover.width+'" height="'+cover.height+'" style="aspect-ratio:3/4" loading="lazy" decoding="async">'+(video?'<div class="play-mark"><i>▶</i><small>点击播放</small></div>':'')+(badge?'<span class="image-count">'+badge+'</span>':'')+'<div class="caption"><div><b>'+escapeText(p.title)+'</b><small>'+escapeText(metadata(p))+'</small></div><span>'+(video?'▶':'↗')+'</span></div>';
    button.addEventListener('click',()=>openProject(p,button));document.querySelector(i%2?'#right':'#left').append(button);
    const img=button.querySelector('img');if(observer)observer.observe(img);else loadCard(img);
  });
  document.querySelector('#previous-image').addEventListener('click',()=>setMedia(activeMedia-1));document.querySelector('#next-image').addEventListener('click',()=>setMedia(activeMedia+1));
  pageSelect.addEventListener('change',()=>setMedia(Number(pageSelect.value)));document.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',e=>{
    if(e.target.closest('video,select')||!media.length)return;
    if(e.key==='ArrowRight'){e.preventDefault();setMedia(activeMedia+1)}if(e.key==='ArrowLeft'){e.preventDefault();setMedia(activeMedia-1)}
  });
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
  dialog.addEventListener('close',()=>{stopVideo();image.removeAttribute('src');longPage.replaceChildren();document.body.classList.remove('modal-open');opener?.focus()});
  player.addEventListener('error',()=>{if(dialog.open&&!player.hidden)videoError.hidden=false});
  const trailImages=homeProjects.filter(p=>p.hero).slice(0,6).map(p=>p.hero),hero=document.querySelector('.hero');let lastX=-999,lastY=-999,count=0,lastTime=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||reduced.matches||navigator.connection?.saveData||!trailImages.length)return;
    const now=performance.now();if(Math.hypot(e.clientX-lastX,e.clientY-lastY)<65||now-lastTime<85)return;
    lastX=e.clientX;lastY=e.clientY;lastTime=now;document.querySelectorAll('.seed').forEach(x=>x.style.opacity=0);
    const img=document.createElement('img');img.src=trailImages[count++%trailImages.length];img.alt='';img.className='trail';
    img.style.left=e.clientX-hero.getBoundingClientRect().left+'px';img.style.top=e.clientY-hero.getBoundingClientRect().top+'px';img.style.setProperty('--r',((count%5)-2)*6+'deg');hero.append(img);
    img.addEventListener('animationend',()=>img.remove());if(hero.querySelectorAll('.trail').length>18)hero.querySelector('.trail').remove();
  });
})();
