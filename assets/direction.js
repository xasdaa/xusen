(() => {
  'use strict';
  const evolutions = [
    {image:'assets/works/previews/one-app-02.webp',project:'one-app',media:1,title:'先让用户知道，最值得关注的是什么。',text:'思路草稿：围绕一个核心利益点安排标题、产品与行动入口，减少信息之间的竞争。实际问题、调整过程与效果，待补充真实案例后完善。'},
    {image:'assets/works/previews/labor-family-02.webp',project:'labor-family',media:1,title:'让功能，有一个可以代入的生活情境。',text:'思路草稿：从产品展示延伸到家庭生活的具体场景，帮助用户理解产品与自己的关系。场景选择的真实依据与升级前后变化，待补充确认。'},
    {image:'assets/works/previews/summer-last-call-01.webp',project:'summer-last-call',media:0,title:'保留核心主张，重组不同屏幕的阅读节奏。',text:'思路草稿：围绕相同活动信息，调整横竖版的构图、文字层级和产品占比。当前展示现有竖版作品，旧版适配方案与实际调整记录后续补充。'}
  ];
  const journeys = [
    {stage:'01 / 吸引点击',title:['用清楚的利益点，','换来第一次关注。'],text:'设计思路草稿：在有限的曝光中突出产品、场景与活动利益，帮助目标用户快速判断内容是否与自己有关。',measure:'观察方向 / CTR、不同创意素材的点击表现',image:'assets/works/previews/summer-last-call-02.webp',alt:'广告阶段的营销视觉素材示例'},
    {stage:'02 / 首屏承接',title:['把广告里的期待，','接到官网的第一屏。'],text:'设计思路草稿：让活动主题、主张和核心产品在广告与官网之间保持连贯；首屏先回答用户是否到达了自己想看的地方。',measure:'观察方向 / 首屏继续浏览、核心入口点击',image:'assets/works/web/website-home-desktop-1600.webp',alt:'官网首屏阶段的设计素材示例'},
    {stage:'03 / 理解价值',title:['让产品信息，','回应具体的使用需求。'],text:'设计思路草稿：把功能、使用场景与产品细节组织成有顺序的内容，帮助用户判断产品是否适合自己。',measure:'观察方向 / 卖点内容互动、产品页继续浏览',image:'assets/works/web/website-product-desktop-800.webp',alt:'产品信息阶段的页面设计素材示例'},
    {stage:'04 / 建立行动',title:['把行动的理由，','放在用户看得懂的位置。'],text:'设计思路草稿：清楚表达活动利益与下一步入口，结合用户的疑虑组织信任信息，让点击建立在充分理解之上。',measure:'观察方向 / CTA 点击、后续购买路径表现',image:'assets/works/web/website-campaign-desktop-800.webp',alt:'活动页面行动入口的设计素材示例'},
    {stage:'05 / 反馈迭代',title:['把这次的反馈，','带进下一次设计。'],text:'工作方法：基于经验提出 A/B 测试方向，分析测试结果、总结方法，再应用于下一轮测试。具体活动的实验记录与结论后续补充。',measure:'已有经历参考 / 广告图对比 ROI +27%、CTR +19%，非本示例活动归因',image:'assets/works/previews/full-home-blue-02.webp',alt:'用于说明素材迭代的现有作品'}
  ];
  function bindTabs(selector, render) {
    const tabs = Array.from(document.querySelectorAll(selector));
    if (!tabs.length) return;
    function activate(index, focus) {
      tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      render(index);
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab,index) => {
      tab.addEventListener('click',() => activate(index,false));
      tab.addEventListener('keydown',event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(next,true); }
      });
    });
  }
  bindTabs('[data-evolution]',index => {
    const entry = evolutions[index], panel = document.querySelector('#evolution-content'), image = document.querySelector('#evolution-image');
    panel.setAttribute('aria-labelledby','evolution-tab-' + index);
    panel.querySelector('h3').textContent = entry.title; panel.querySelector('p').textContent = entry.text;
    image.src = entry.image; image.alt = '现有作品示例：' + entry.title;
    const button = image.closest('button'); button.dataset.openProject = entry.project; button.dataset.media = entry.media; button.setAttribute('aria-label','查看现有作品：' + entry.title);
  });
  bindTabs('[data-journey]',index => {
    const entry = journeys[index], panel = document.querySelector('#journey-panel'), title = document.querySelector('#journey-title');
    panel.setAttribute('aria-labelledby','journey-tab-' + index);
    document.querySelector('#journey-stage').textContent = entry.stage;
    title.replaceChildren(document.createTextNode(entry.title[0]),document.createElement('br'),document.createTextNode(entry.title[1]));
    document.querySelector('#journey-text').textContent = entry.text; document.querySelector('#journey-measure').textContent = entry.measure;
    const image = document.querySelector('#journey-image'); image.src = entry.image; image.alt = entry.alt;
  });
  const library = document.querySelector('.work-library');
  if (library) {
    const label = library.querySelector('.library-action');
    library.addEventListener('toggle',() => { label.firstChild.textContent = library.open ? '收起作品库 ' : '展开作品库 '; });
    function revealLibrary() { if (['#works','#web-design','#graphic-design'].includes(location.hash)) library.open = true; }
    revealLibrary(); window.addEventListener('hashchange',revealLibrary);
  }
  const chapters = Array.from(document.querySelectorAll('.case-chapters a'));
  if (chapters.length) {
    let queued = false;
    const update = () => {
      queued = false;
      let current = chapters[0];
      chapters.forEach(link => { const section = document.querySelector(link.hash); if (section && section.getBoundingClientRect().top <= 165) current = link; });
      chapters.forEach(link => { const on = link === current; link.classList.toggle('active',on); if(on)link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    };
    const requestUpdate = () => { if(!queued){ queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate);
    window.addEventListener('load',requestUpdate,{once:true});
    requestUpdate();
  }
})();
