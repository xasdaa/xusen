(() => {
  'use strict';
  const projects=window.portfolioWorks;
  const dialog=document.querySelector('#detail');
  const player=document.querySelector('#detail-video');
  const image=document.querySelector('#detail-image');
  const controls=document.querySelector('#gallery-controls');
  const thumbnails=document.querySelector('#gallery-thumbnails');
  const videoError=document.querySelector('#video-error');
  let activeProject=null, activeImage=0, opener=null;
  const escapeText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const metadata=p=>[p.category,p.year].filter(Boolean).join(' / ');
  const setImage=index=>{
    if(!activeProject?.images)return;
    activeImage=(index+activeProject.images.length)%activeProject.images.length;
    const item=activeProject.images[activeImage];
    document.querySelector('.viewer-media').classList.add('loading');
    image.src=item.src;image.alt=activeProject.title+' · '+item.label;
    image.width=item.width;image.height=item.height;
    document.querySelector('#image-counter').textContent=(activeImage+1)+' / '+activeProject.images.length+' · '+item.label;
    document.querySelector('#original-image').href=item.src;
    thumbnails.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===activeImage)));
  };
  image.addEventListener('load',()=>document.querySelector('.viewer-media').classList.remove('loading'));
  const openProject=(project,button)=>{
    activeProject=project;opener=button;
    player.pause();videoError.hidden=true;
    document.querySelector('#detail-title').textContent=project.title;
    document.querySelector('#detail-meta').textContent=metadata(project);
    document.querySelector('#detail-description').textContent=project.description||(project.images.length+' 张作品 · 横版、竖版及不同画面按原始比例展示。');
    image.hidden=Boolean(project.video);player.hidden=!project.video;
    controls.hidden=Boolean(project.video);thumbnails.hidden=Boolean(project.video)||project.images.length<2;
    thumbnails.replaceChildren();
    if(project.images){
      project.images.forEach((item,i)=>{
        const b=document.createElement('button');b.setAttribute('aria-label','查看第 '+(i+1)+' 张：'+item.label);b.setAttribute('aria-pressed',String(i===0));
        b.innerHTML='<img src="'+item.preview+'" alt="" loading="lazy" decoding="async">';
        b.addEventListener('click',()=>setImage(i));thumbnails.append(b);
      });
      document.querySelector('#previous-image').disabled=project.images.length<2;
      document.querySelector('#next-image').disabled=project.images.length<2;
      setImage(0);
    }
    dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
    if(project.video){player.src=project.video;player.play().catch(()=>{if(player.error)videoError.hidden=false})}
  };
  const columnHeights=[0,0];
  projects.forEach((project,i)=>{
    const button=document.createElement('button');button.className='project'+(project.video?' video-project':'');
    button.setAttribute('aria-label',(project.video?'播放视频作品：':'查看作品：')+project.title);
    button.dataset.projectId=project.id;
    const cover=project.images?.[project.cover||0];
    const media=project.video?'<video src="'+project.video+'#t=0.1" preload="metadata" muted playsinline aria-hidden="true"></video><div class="play-mark"><i>▶</i><small>点击播放</small></div>':'<img src="'+cover.preview+'" alt="'+escapeText(project.title)+'" width="'+cover.width+'" height="'+cover.height+'" loading="'+(i<4?'eager':'lazy')+'" decoding="async">';
    button.innerHTML=media+(project.images?.length>1?'<span class="image-count">'+project.images.length+' 张 ↗</span>':'')+'<div class="caption"><div><b>'+escapeText(project.title)+'</b><small>'+escapeText(metadata(project))+'</small></div><span>'+(project.video?'▶':'↗')+'</span></div>';
    button.addEventListener('click',()=>openProject(project,button));
    const col=i===0?0:i===1?1:columnHeights[0]<=columnHeights[1]?0:1;
    document.querySelector(col?'#right':'#left').append(button);
    columnHeights[col]+=(project.video?4/3:cover.height/cover.width)+.12;
  });
  document.querySelector('#previous-image').addEventListener('click',()=>setImage(activeImage-1));
  document.querySelector('#next-image').addEventListener('click',()=>setImage(activeImage+1));
  document.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',e=>{
    if(e.target.closest('video')||!activeProject?.images)return;
    if(e.key==='ArrowRight'){e.preventDefault();setImage(activeImage+1)}
    if(e.key==='ArrowLeft'){e.preventDefault();setImage(activeImage-1)}
  });
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
  dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();image.removeAttribute('src');document.body.classList.remove('modal-open');opener?.focus()});
  player.addEventListener('error',()=>{if(dialog.open&&!player.hidden)videoError.hidden=false});
  const trailImages=projects.filter(p=>p.images).slice(0,12).map(p=>p.images[p.cover||0].preview);
  const hero=document.querySelector('.hero');let lastX=-999,lastY=-999,count=0,lastTime=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||reduced.matches)return;
    const now=performance.now();if(Math.hypot(e.clientX-lastX,e.clientY-lastY)<65||now-lastTime<85)return;
    lastX=e.clientX;lastY=e.clientY;lastTime=now;
    document.querySelectorAll('.seed').forEach(x=>x.style.opacity=0);
    const img=document.createElement('img');img.src=trailImages[count++%trailImages.length];img.alt='';img.className='trail';
    img.style.left=e.clientX-hero.getBoundingClientRect().left+'px';img.style.top=e.clientY-hero.getBoundingClientRect().top+'px';img.style.setProperty('--r',((count%5)-2)*6+'deg');hero.append(img);
    img.addEventListener('animationend',()=>img.remove());if(hero.querySelectorAll('.trail').length>18)hero.querySelector('.trail').remove();
  });
})();
