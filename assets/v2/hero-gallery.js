(()=>{
 const hero=document.querySelector('.gallery-cover'),stage=hero.querySelector('.poster-tunnel');
 const names=['christmas-02','vacation-01','full-home-blue-01','football-02','school-02','halloween-02','summer-wave-02','solarcam-02'];
 let visible=true,raf=0,last=0,phase=0,w=innerWidth;
 const count=names.length,cards=[];
 for(const side of [-1,1])for(let i=0;i<count;i++){
  const el=document.createElement('div');el.className='tunnel-poster';
  const img=new Image();img.src='assets/works/cards/'+names[(i+(side===1?3:0))%names.length]+'-400.webp';img.alt='';img.decoding='async';el.append(img);stage.append(el);cards.push({el,side,i});
 }
 function render(){
  const mobile=w<768,base=mobile?w*.48:w*.23,extent=w*.57;
  for(const {el,side,i} of cards){
   const depth=(i-phase+count)%count,scale=Math.pow(.80,depth);
   // Keep the farthest posters legible and overlapping at a shared vanishing point.
   const x=side*(extent*(scale-.16)/.84+base*scale*.12);
   el.style.width=base+'px';
   el.style.transform=`translate(-50%,-50%) translateX(${x}px) scale(${scale}) perspective(${base*4}px) rotateY(${side*-12}deg)`;
   el.style.zIndex=String(200-Math.round(depth*10));
   el.style.opacity=String(Math.min(1,(count-depth)*3));
  }
 }
 function tick(now){raf=0;if(last)phase=(phase+Math.min(now-last,50)*.00030)%count;last=now;render();if(visible&&!document.hidden)raf=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(visible&&!document.hidden)raf=requestAnimationFrame(tick)}
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()}).observe(hero);
 document.addEventListener('visibilitychange',sync);addEventListener('resize',()=>{w=innerWidth;render()});render();sync();
})();
