(()=>{
  const track=document.getElementById('motion-track');
  if(!track)return;
  const videos=[...track.querySelectorAll('video')];
  const previous=document.getElementById('previous-motion');
  const next=document.getElementById('next-motion');
  const mobile=matchMedia('(max-width:767px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const visible=new Set();
  const shouldAutoPlay=()=>!reduced.matches&&!navigator.connection?.saveData&&!document.hidden;
  function configure(video){
    const src=mobile.matches?video.dataset.mobile:video.dataset.desktop;
    const poster=mobile.matches?video.dataset.posterMobile:video.dataset.posterDesktop;
    video.poster=poster;
    if(video.getAttribute('src')&&video.getAttribute('src')!==src){video.pause();video.removeAttribute('src');video.load();}
    return src;
  }
  function activate(video){
    if(!video.getAttribute('src')){video.src=configure(video);video.load();}
    if(shouldAutoPlay())video.play().catch(()=>{});
  }
  videos.forEach(video=>{
    configure(video);
    // User-initiated playback also works when automatic playback is disabled.
    video.addEventListener('pointerdown',()=>{if(!video.getAttribute('src'))activate(video);},{once:true});
    video.addEventListener('play',()=>videos.forEach(other=>{if(other!==video)other.pause();}));
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(({target,intersectionRatio})=>{
        if(intersectionRatio>=.55){visible.add(target);activate(target);}
        else{visible.delete(target);target.pause();}
      });
    },{threshold:[0,.55]});
    videos.forEach(v=>observer.observe(v));
  }else{videos.forEach(v=>{v.src=configure(v);});}
  mobile.addEventListener('change',()=>videos.forEach(v=>{configure(v);if(visible.has(v))activate(v);}));
  reduced.addEventListener('change',()=>{if(reduced.matches)videos.forEach(v=>v.pause());});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());});
  function update(){previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;}
  function move(direction){const step=track.querySelector('.motion-project').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);track.scrollBy({left:direction*step,behavior:reduced.matches?'instant':'smooth'});}
  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
  track.addEventListener('scroll',update,{passive:true});
  new ResizeObserver(update).observe(track);
  update();
})();
