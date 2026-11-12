(()=>{
 const track=document.getElementById('motion-track');if(!track)return;
 const videos=[...track.querySelectorAll('video')],cards=[...track.querySelectorAll('.motion-project')];
 const previous=document.getElementById('previous-motion'),next=document.getElementById('next-motion');
 const mobile=matchMedia('(max-width:767px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let active=null,timer,transitioning=false;
 function configure(v){
  v.loop=false;v.removeAttribute('loop');v.muted=true;v.playsInline=true;v.controls=!mobile.matches;
  const source=mobile.matches?v.dataset.mobile:v.dataset.desktop;
  v.poster=mobile.matches?v.dataset.posterMobile:v.dataset.posterDesktop;
  if(v.getAttribute('src')&&v.getAttribute('src')!==source){v.pause();v.removeAttribute('src');v.load()}
  return source;
 }
 function visible(v){const r=v.getBoundingClientRect();return Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))/Math.min(r.height,innerHeight)>.3}
 function nearest(){const left=track.getBoundingClientRect().left+parseFloat(getComputedStyle(track).paddingLeft);return videos.reduce((a,v)=>Math.abs(v.getBoundingClientRect().left-left)<Math.abs(a.getBoundingClientRect().left-left)?v:a,videos[0])}
 function update(){previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2}
 function sync(){
  update();if(transitioning)return;
  const chosen=nearest();
  if(document.hidden||!visible(chosen)){videos.forEach(v=>v.pause());return}
  videos.forEach(v=>{if(v!==chosen)v.pause()});
  const changed=active!==chosen;active=chosen;
  if(!chosen.getAttribute('src')){chosen.src=configure(chosen);chosen.load()}
  if(changed||chosen.ended){try{chosen.currentTime=0}catch(e){}}
  if(chosen.paused)chosen.play().catch(()=>{});
 }
 function moveTo(i){
  const padding=parseFloat(getComputedStyle(track).paddingLeft);
  const left=track.scrollLeft+cards[i].getBoundingClientRect().left-track.getBoundingClientRect().left-padding;
  videos.forEach(v=>v.pause());transitioning=true;
  track.scrollTo({left,behavior:reduced.matches?'instant':'smooth'});
  clearTimeout(timer);timer=setTimeout(()=>{transitioning=false;sync()},450);
 }
 videos.forEach((v,i)=>{configure(v);v.addEventListener('ended',()=>{if(v===active&&!document.hidden&&visible(v))moveTo((i+1)%videos.length)});v.addEventListener('play',()=>videos.forEach(o=>{if(o!==v)o.pause()}))});
 previous.addEventListener('click',()=>moveTo(Math.max(0,videos.indexOf(nearest())-1)));
 next.addEventListener('click',()=>moveTo(Math.min(videos.length-1,videos.indexOf(nearest())+1)));
 track.addEventListener('scroll',()=>{update();if(transitioning)return;clearTimeout(timer);timer=setTimeout(sync,140)},{passive:true});
 track.addEventListener('touchstart',()=>{transitioning=false;clearTimeout(timer)},{passive:true});
 window.addEventListener('scroll',sync,{passive:true});
 new ResizeObserver(sync).observe(track);mobile.addEventListener('change',()=>{videos.forEach(configure);active=null;sync()});
 document.addEventListener('visibilitychange',sync);sync();
})();
