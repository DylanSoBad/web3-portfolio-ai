// Personal content layer. Runs before Kage initializes reveals, navigation and
// the scene; the authored geometry, shaders, camera and interactions stay intact.
(() => {
  const one = (selector) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Profile selector missing: ${selector}`);
    return el;
  };
  const text = (selector, value) => { one(selector).textContent = value; };
  const items = (selector) => [...document.querySelectorAll(selector)];
  text('.brand-tx b', 'DYLAN');
  text('.brand-tx i', 'PERSONAL PROFILE');
  text('.pre-jp', 'DYLAN');
  one('.nav-burger').setAttribute('aria-label', 'Open menu');
  text('.pre-meta span', 'Opening the experience');
  const sections = [
    ['About', 'ABOUT', '#gate'],
    ['Focus', 'FOCUS', '#pathways'],
    ['Skills', 'SKILLS', '#lessons'],
    ['Contact', 'CONTACT', '#eternity'],
  ];
  items('.nav-link').forEach((el, i) => {
    el.querySelector('span').textContent = sections[i][0];
    el.querySelector('.alt').textContent = sections[i][1];
    el.setAttribute('href', sections[i][2]);
    el.querySelector('.alt').setAttribute('aria-hidden', 'true');
  });
  one('.hero-top .eyebrow').lastChild.textContent = ' DYLAN — WEB3 BUILDER';
  items('h1 .mask-line > span').forEach((el, i) => { el.textContent = ['Explore.', 'Build.', 'Keep learning.'][i]; });
  text('.hero-sub', 'I’m Dylan. I explore Web3 through testnets, retroactive campaigns, NFTs, DeFi, gaming, and building.');
  text('.hero-cue > span', 'Scroll to explore');
  text('.word-fb', 'DYLAN');
  text('.hero-side .v', 'BUILD · LEARN · REPEAT');
  const descriptions = ['A little about me and how I work.', 'The Web3 areas I actively explore.', 'What I work on and build.', 'Start with a hello.'];
  items('.chip').forEach((el, i) => {
    el.querySelector('b').textContent = sections[i][0];
    el.querySelector('p').textContent = descriptions[i];
    el.setAttribute('role', 'link');
    el.tabIndex = 0;
    const go = () => one(sections[i][2]).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
  one('.peek').setAttribute('aria-label', 'Explore what I focus on');
  text('.peek-cap b', 'EXPLORE');
  text('.peek-cap i', 'A closer look');
  text('#gate .sec-head .k', '01 — About');
  text('#gate .sec-head .jp', 'ABOUT');
  text('#gate h2', 'Exploring Web3 by doing.');
  text('.gate-copy .lead', 'My Web3 work spans testnets, retroactive campaigns, NFTs, DeFi, gaming, and building. I explore new ecosystems hands-on and turn what I learn into useful projects.');
  text('.gate-copy .body', 'I enjoy testing products early, learning how communities and protocols work, and building alongside them. These are the areas you’ll find me working in.');
  text('.gate-copy .arrowlink > span', 'Explore my focus');
  const web3Activities = [
    ['Testnet', 'Trying new networks and early products'],
    ['Retroactive', 'Exploring protocols and user campaigns'],
    ['NFT', 'Following collections and communities'],
    ['DeFi', 'Learning through decentralized finance'],
    ['Gaming', 'Exploring Web3 games and ecosystems'],
    ['Building', 'Turning ideas into working projects'],
  ];
  const activityGrid = one('.gate-stats');
  activityGrid.replaceChildren(...web3Activities.map(([name, description], i) => {
    const card = document.createElement('div');
    card.className = 'web3-activity';
    const number = document.createElement('small'); number.textContent = String(i + 1).padStart(2, '0');
    const title = document.createElement('b'); title.textContent = name;
    const detail = document.createElement('span'); detail.textContent = description;
    card.append(number, title, detail);
    return card;
  }));
  text('#pathways .sec-head .k', '02 — Areas of focus');
  text('#pathways .sec-head .jp', 'FOCUS');
  items('.card').forEach((el, i) => {
    el.querySelector('.card-lab b').textContent = ['Testnet', 'DeFi & NFT', 'Gaming'][i];
    el.querySelector('.card-lab .jp').textContent = ['EXPLORE', 'LEARN', 'PLAY'][i];
    el.querySelector('.card-meta span').textContent = ['Early ecosystems', 'Protocols & communities', 'Interactive worlds'][i];
  });
  text('#lessons .sec-head .k', '03 — Skills & projects');
  text('#lessons .sec-head .jp', 'SKILLS');
  text('.cur-head h2', 'From exploration to building.');
  text('.cur-head p', 'These are the Web3 activities I focus on. The source code for this portfolio is available on GitHub.');
  const skills = [
    ['Testnets & Retroactive', 'EXPLORE', 'Trying early networks and participating in protocol campaigns.', 'Web3'],
    ['NFT & DeFi', 'DISCOVER', 'Following collections, communities, and decentralized products.', 'Ecosystems'],
    ['Gaming', 'PLAY', 'Exploring games and experiences built for Web3.', 'Games'],
    ['Building', 'CREATE', 'Making useful tools and interactive web experiences.', 'Projects'],
    ['Personal Portfolio', 'PROJECT', 'Personal portfolio built with Flask, React, and Three.js. View source ↗', 'GitHub'],
  ];
  items('.les').forEach((el, i) => {
    el.querySelector('h3').firstChild.textContent = skills[i][0] + ' ';
    el.querySelector('em').textContent = skills[i][1];
    el.querySelector('p').textContent = skills[i][2];
    el.querySelector('.t').textContent = skills[i][3];
    if (i === 4) {
      const a = document.createElement('a');
      a.href = 'https://github.com/DylanSoBad/web3-portfolio-ai';
      a.className = el.className;
      for (const { name, value } of [...el.attributes]) a.setAttribute(name, value);
      a.append(...el.childNodes);
      el.replaceWith(a);
    }
  });
  text('#eternity .eyebrow', '04 — Contact');
  text('#eternity h2', 'Get in touch');
  text('#eternity p', 'Have an idea to discuss, a project to collaborate on, or just want to talk about technology? Send me a hello.');
  const email = 'airdropdylan2@gmail.com';
  const contactLink = one('#eternity .cta');
  contactLink.href = 'https://t.me/iamdylan2026';
  contactLink.target = '_blank';
  contactLink.rel = 'noopener noreferrer';
  text('#eternity .cta span', 'Message on Telegram');
  contactLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.parent.postMessage({ type: 'dylan-external-link', url: contactLink.href }, window.location.origin);
  });
  const contactOptions = document.createElement('div');
  contactOptions.className = 'contact-options';
  const emailAddress = document.createElement('a');
  emailAddress.href = `mailto:${email}`;
  emailAddress.target = '_top';
  emailAddress.textContent = email;
  const xLink = document.createElement('a');
  xLink.href = 'https://x.com/dylan_ngmi';
  xLink.target = '_blank';
  xLink.rel = 'noopener noreferrer';
  xLink.textContent = 'X / Twitter ↗';
  contactOptions.append(emailAddress, xLink);
  contactLink.after(contactOptions);
  text('.foot-brand p', 'Dylan — exploring testnets, retroactive campaigns, NFTs, DeFi, gaming, and building in Web3.');
  const footerColumns = items('.foot-grid > div').slice(1);
  footerColumns[1].remove();
  const footerLinks = [
    ['Explore', sections.map(([name, , href]) => [name, href])],
    ['Connect', [['Telegram ↗', 'https://t.me/iamdylan2026'], ['X / Twitter ↗', 'https://x.com/dylan_ngmi'], ['GitHub ↗', 'https://github.com/DylanSoBad'], ['airdropdylan2@gmail.com', 'mailto:airdropdylan2@gmail.com']]],
  ];
  [footerColumns[0], footerColumns[2]].forEach((el, i) => {
    el.querySelector('h4').textContent = footerLinks[i][0];
    const ul = el.querySelector('ul'); ul.replaceChildren();
    footerLinks[i][1].forEach(([label, href]) => {
      const li = document.createElement('li'), a = document.createElement('a');
      a.href = href; a.textContent = label; a.setAttribute('data-cursor', '');
      if (href === '/cv') a.target = '_top';
      li.append(a); ul.append(li);
    });
  });
  items('.foot a[href^="https://"], .contact-options a[href^="https://"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.parent.postMessage({ type: 'dylan-external-link', url: link.href }, window.location.origin);
    });
  });
  items('.foot-base > span').forEach((el, i) => { el.textContent = ['© Dylan', 'Build · Learn · Repeat', 'Scene: Kage / ThreeUI'][i]; });
  const style = document.createElement('style');
  style.textContent = `a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:2px solid #e0231c;outline-offset:6px}.foot a{overflow-wrap:anywhere}.les h3 em{font-family:inherit;font-size:10px;letter-spacing:.1em}.hero-side .v{font-family:inherit;font-size:11px;letter-spacing:.25em}@media(min-width:821px){.nav-burger{display:none}}.gate-stats{grid-column:1/-1;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0!important;padding-top:0!important;margin-top:clamp(46px,8vh,96px)!important}.gate-stats .web3-activity{min-width:0;min-height:150px;padding:22px 24px!important;border-left:1px solid var(--line-soft);border-bottom:1px solid var(--line-soft)}.gate-stats .web3-activity:nth-child(3n){border-right:1px solid var(--line-soft)}.gate-stats .web3-activity small{display:block;font-size:10px;letter-spacing:.18em;color:var(--vermilion);margin-bottom:8px}.gate-stats .web3-activity b{font-size:clamp(21px,2.1vw,30px);line-height:1.2}.gate-stats .web3-activity span{display:block;font-size:11px;letter-spacing:.02em;text-transform:none;line-height:1.5;margin-top:10px;color:var(--bone-dim)}@media(max-width:820px){.gate-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}.gate-stats .web3-activity{min-height:150px;padding:18px!important}.gate-stats .web3-activity:nth-child(3n){border-right:0}.gate-stats .web3-activity:nth-child(2n){border-right:1px solid var(--line-soft)}}@media(max-width:420px){.gate-stats .web3-activity{min-height:165px;padding:15px!important}.gate-stats .web3-activity b{font-size:20px}}`;
  document.head.append(style);
  style.textContent += `.foot-grid{grid-template-columns:minmax(0,1.4fr) repeat(2,minmax(0,.6fr))}body[data-layout-footer="b"] .foot-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:1080px){.foot-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:820px){.foot-grid,body[data-layout-footer="b"] .foot-grid{grid-template-columns:1fr}}.contact-options{display:flex;justify-content:center;align-items:center;gap:12px 20px;flex-wrap:wrap;margin-top:22px;position:relative;z-index:2}.contact-options span{color:var(--bone);font-size:13px}.contact-options a,.contact-options button{font:inherit;font-size:11px;letter-spacing:.1em;color:var(--bone);background:transparent;border:0;border-bottom:1px solid var(--line);padding:5px 0;cursor:pointer}.contact-options a:hover,.contact-options button:hover{border-color:var(--vermilion);color:var(--vermilion)}`;
})();
