(() => {
  'use strict';
  const cover = document.querySelector('.cover');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0;
  function animate() {
    x += (targetX - x) * .065;
    y += (targetY - y) * .065;
    cover.style.setProperty('--portrait-x',x.toFixed(2) + 'px');
    cover.style.setProperty('--portrait-y',y.toFixed(2) + 'px');
    if (Math.abs(targetX-x) + Math.abs(targetY-y) > .05) frame = requestAnimationFrame(animate);
    else frame = 0;
  }
  function start() { if(!frame) frame = requestAnimationFrame(animate); }
  function reset() { targetX = 0; targetY = 0; start(); }
  cover.addEventListener('pointermove',event => {
    if(reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
    const rect = cover.getBoundingClientRect();
    targetX = ((event.clientX-rect.left)/rect.width - .5) * 14;
    targetY = ((event.clientY-rect.top)/rect.height - .5) * 10;
    start();
  });
  cover.addEventListener('pointerleave',reset);
  reduced.addEventListener('change',reset);
  document.addEventListener('visibilitychange',() => { if(document.hidden){ cancelAnimationFrame(frame); frame = 0; } });
})();
