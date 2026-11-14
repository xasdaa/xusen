(()=>{
 const hero=document.querySelector('.gallery-cover'),stage=hero.querySelector('.poster-tunnel'),button=hero.querySelector('.hero-pause');
 const names=['christmas-02','vacation-01','full-home-blue-01','football-02','school-02','halloween-02','summer-wave-02','solarcam-02'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,visible=true,raf=0,last=0,phase=0,w=innerWidth;
 const cards=[];
 for(let side of [-1,1])for(let i=0;i<10;i++){
  const el=document.createElement('div');el.className='tunnel-poster';
  const img=new Image();img.src='assets/works/cards/'+names[i%names.length]+'-400.webp';img.alt='';img.decoding='async';el.append(img);stage.append(el);cards.push({el,side,i});
 }
 function render(){
  const mobile=w<768,base=mobile?160:240;
  for(const {el,side,i} of cards){
   const depth=((i-phase+10)%10),scale=1/(.7+depth*.48);
   const x=side*(mobile?164:480)*scale,y=(mobile?12:16)*scale;
   el.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale}) rotateY(${side*-12}deg)`;
   el.style.zIndex=String(100-Math.round(depth*8));el.style.opacity=String(Math.min(1,depth*2,(10-depth)*2));
  }
 }
 function tick(now){raf=0;if(last)phase=(phase+Math.min(now-last,50)*.00022)%10;last=now;render();if(!paused&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(!paused&&visible&&!document.hidden)raf=requestAnimationFrame(tick);button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'播放首页动画':'暂停首页动画');button.setAttribute('aria-pressed',String(paused))}
 button.addEventListener('click',()=>{paused=!paused;sync()});
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:0}).observe(hero);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{paused=reduced.matches;sync()});
 addEventListener('resize',()=>{w=innerWidth;render()});render();sync();
})();
