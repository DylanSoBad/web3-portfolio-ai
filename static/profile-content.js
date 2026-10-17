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
  one('.hero-top .eyebrow').lastChild.textContent = ' DYLAN — WEB3 TESTER & RESEARCHER';
  items('h1 .mask-line > span').forEach((el, i) => { el.textContent = ['Test.', 'Research.', 'Build.'][i]; });
  text('.hero-sub', 'I test early Web3 products, research emerging ecosystems, and build tools that make what I learn useful.');
  text('.hero-cue > span', 'Scroll to explore');
  text('.word-fb', 'DYLAN');
  text('.hero-side .v', 'TEST · RESEARCH · BUILD');
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
  text('#gate h2', 'Testing and researching Web3.');
  text('.gate-copy .lead', 'I’m Dylan, a Web3 tester and researcher. I explore early products and ecosystems through hands-on testing, then turn what I learn into practical tools.');
  text('.gate-copy .body', 'My interests include testnets, retroactive campaigns, NFTs, DeFi, and gaming. The public projects below show how I organize research and build around it.');
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
  const recentWork = [
    ['Oct 2026', 'DylanWeb', 'Built this public Web3 profile and its interactive experience.', 'https://github.com/DylanSoBad/web3-portfolio-ai'],
    ['Sep 2026', 'Dylan HQ', 'Built a dashboard for tracking airdrops, mints, targets, notes, and research tasks.', 'https://github.com/DylanSoBad/NoteBook'],
    ['Aug 2026', 'Pact', 'Worked on a Solidity project built on ARC.', 'https://github.com/DylanSoBad/Pact'],
  ];
  const now = document.createElement('div');
  now.className = 'recent-work';
  const nowHeading = document.createElement('div');
  nowHeading.className = 'recent-work-head';
  const nowLabel = document.createElement('span'); nowLabel.textContent = 'NOW & RECENT WORK';
  const nowTitle = document.createElement('h3'); nowTitle.textContent = 'A public record of what I build.';
  nowHeading.append(nowLabel, nowTitle);
  const nowList = document.createElement('div');
  nowList.className = 'recent-work-list';
  recentWork.forEach(([date, name, description, href]) => {
    const link = document.createElement('a');
    link.className = 'recent-work-item';
    link.href = href;
    link.setAttribute('data-cursor', '');
    const time = document.createElement('time'); time.textContent = date;
    const title = document.createElement('strong'); title.textContent = name;
    const detail = document.createElement('span'); detail.textContent = description;
    const arrow = document.createElement('span'); arrow.className = 'recent-work-arrow'; arrow.textContent = 'View code ↗';
    link.append(time, title, detail, arrow);
    nowList.append(link);
  });
  now.append(nowHeading, nowList);
  activityGrid.after(now);
  text('#pathways .sec-head .k', '02 — Areas of focus');
  text('#pathways .sec-head .jp', 'FOCUS');
  items('.card').forEach((el, i) => {
    el.querySelector('.card-lab b').textContent = ['Testnet', 'DeFi & NFT', 'Gaming'][i];
    el.querySelector('.card-lab .jp').textContent = ['EXPLORE', 'LEARN', 'PLAY'][i];
    el.querySelector('.card-meta span').textContent = ['Early ecosystems', 'Protocols & communities', 'Interactive worlds'][i];
  });
  text('#lessons .sec-head .k', '03 — Skills & projects');
  text('#lessons .sec-head .jp', 'SKILLS');
  text('.cur-head h2', 'Skills, with proof.');
  text('.cur-head p', 'Each area links to a public project. I’ll add current testnet and research activity as I document it.');
  const skills = [
    ['Wallet analysis', 'RESEARCH', 'Built an EVM wallet activity and balance scanner.', 'View code ↗', 'https://github.com/DylanSoBad/Wallet-Activity-Scanner'],
    ['Research workflow', 'ORGANIZE', 'Built Dylan HQ to track airdrops, mints, targets, notes, and tasks.', 'View code ↗', 'https://github.com/DylanSoBad/NoteBook'],
    ['Solidity prototyping', 'BUILD', 'Worked on Pact, a Solidity project built on ARC.', 'View code ↗', 'https://github.com/DylanSoBad/Pact'],
    ['Storage tooling', 'BUILD', 'Built a CLI for uploading and retrieving Shelby storage blobs.', 'View code ↗', 'https://github.com/DylanSoBad/shelby-cli'],
    ['Web experience', 'PUBLISH', 'Built DylanWeb with Flask, React, and Three.js.', 'View code ↗', 'https://github.com/DylanSoBad/web3-portfolio-ai'],
  ];
  items('.les').forEach((el, i) => {
    el.querySelector('h3').firstChild.textContent = skills[i][0] + ' ';
    el.querySelector('em').textContent = skills[i][1];
    el.querySelector('p').textContent = skills[i][2];
    el.querySelector('.t').textContent = skills[i][3];
    const a = document.createElement('a');
    a.href = skills[i][4];
    for (const { name, value } of [...el.attributes]) a.setAttribute(name, value);
    a.setAttribute('aria-label', `${skills[i][0]}: view code on GitHub`);
    a.append(...el.childNodes);
    el.replaceWith(a);
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
  text('.foot-brand p', 'Dylan — Web3 tester and researcher. Testing early products, researching ecosystems, and building useful tools.');
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
  items('.foot a[href^="https://"], .contact-options a[href^="https://"], .recent-work-item, .les[href^="https://"]').forEach((link) => {
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
  style.textContent += `.recent-work{margin-top:clamp(62px,10vh,120px);position:relative;z-index:2}.recent-work-head{display:flex;align-items:baseline;justify-content:space-between;gap:20px;padding-bottom:22px;border-bottom:1px solid var(--line-soft)}.recent-work-head span{font-size:10px;font-weight:500;letter-spacing:.22em;color:var(--vermilion)}.recent-work-head h3{font-size:clamp(18px,2vw,26px);font-weight:400;letter-spacing:-.02em;text-align:right}.recent-work-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.recent-work-item{display:flex;flex-direction:column;min-width:0;min-height:190px;padding:25px 25px 22px 0;border-bottom:1px solid var(--line-soft)}.recent-work-item+.recent-work-item{padding-left:25px;border-left:1px solid var(--line-soft)}.recent-work-item time{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.recent-work-item strong{margin-top:12px;font-size:clamp(18px,1.6vw,23px);font-weight:400;color:var(--bone)}.recent-work-item>span:not(.recent-work-arrow){margin-top:8px;font-size:12px;line-height:1.6;color:var(--bone-dim)}.recent-work-arrow{margin-top:auto;padding-top:17px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--vermilion)}.recent-work-item:hover strong,.recent-work-item:hover .recent-work-arrow,.les:hover .t{color:var(--bone)}.les[href]{text-decoration:none}.les .t{color:var(--vermilion)}@media(max-width:820px){.recent-work-head{display:block}.recent-work-head h3{margin-top:12px;text-align:left}.recent-work-list{grid-template-columns:1fr}.recent-work-item,.recent-work-item+.recent-work-item{min-height:0;padding:20px 0;border-left:0}.recent-work-item strong{margin-top:7px}.recent-work-arrow{padding-top:10px}}`;
})();
