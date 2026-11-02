/**
 * DYLAN OS — Web3 Desktop Operating System Engine
 * Pure Ryft.fun-inspired design
 */
(() => {
  // --- Audio ---
  let audioCtx = null;
  const playSound = (type = 'click') => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
      } else if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
      }
    } catch { /* Audio not supported */ }
  };

  // --- Boot Sequence ---
  const bootScreen = document.getElementById('boot-screen');
  const bootFill = document.querySelector('.boot-progress-fill');
  const bootLogs = document.querySelector('.boot-logs');
  const bootSkipBtn = document.querySelector('.boot-skip-btn');

  const bootMessages = [
    { text: 'DYLAN OS v2.6.0-release-x86_64 booting...', cls: 'log-highlight', delay: 150 },
    { text: 'Loading kernel modules & web3 sandboxes... [OK]', cls: 'log-success', delay: 280 },
    { text: 'Initializing EVM protocols & activity scanner...', cls: '', delay: 400 },
    { text: 'Connecting to decentralized node matrix... [CONNECTED]', cls: 'log-success', delay: 580 },
    { text: 'Rendering Ryft-inspired Desktop Environment...', cls: 'log-highlight', delay: 750 },
    { text: 'SYSTEM READY // WELCOME DYLAN', cls: 'log-success', delay: 900 }
  ];

  let bootDone = false;
  const finishBoot = () => {
    if (bootDone) return;
    bootDone = true;
    playSound('open');
    if (bootScreen) {
      bootScreen.classList.add('fade-out');
      setTimeout(() => bootScreen.remove(), 600);
    }
  };

  if (bootSkipBtn) bootSkipBtn.addEventListener('click', finishBoot);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !bootDone) finishBoot(); });

  let curLogIdx = 0;
  const runBootStep = () => {
    if (curLogIdx < bootMessages.length) {
      const msg = bootMessages[curLogIdx];
      const p = document.createElement('div');
      p.className = `boot-log-line ${msg.cls}`;
      p.textContent = `> ${msg.text}`;
      if (bootLogs) bootLogs.appendChild(p);
      const pct = Math.round(((curLogIdx + 1) / bootMessages.length) * 100);
      if (bootFill) bootFill.style.width = `${pct}%`;
      curLogIdx++;
      setTimeout(runBootStep, 160);
    } else {
      setTimeout(finishBoot, 280);
    }
  };
  setTimeout(runBootStep, 100);

  // --- Particle Canvas Background ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(255, 42, 133, 0.45)' : 'rgba(0, 240, 255, 0.45)',
    }));

    const renderCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx; p1.y += p1.vy;
        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;
        ctx.fillStyle = p1.color;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(renderCanvas);
    };
    renderCanvas();
  }

  // --- Window Manager ---
  let topZ = 100;
  const windows = {};
  const taskTabs = {};

  document.querySelectorAll('.os-window').forEach((win) => {
    const id = win.getAttribute('data-window');
    windows[id] = win;
    win.addEventListener('mousedown', () => bringToFront(id));
    win.addEventListener('touchstart', () => bringToFront(id), { passive: true });
    const closeBtn = win.querySelector('.ctrl-btn.close');
    const minBtn = win.querySelector('.ctrl-btn.minimize');
    const maxBtn = win.querySelector('.ctrl-btn.maximize');
    if (closeBtn) closeBtn.addEventListener('click', () => closeWindow(id));
    if (minBtn) minBtn.addEventListener('click', () => minimizeWindow(id));
    if (maxBtn) maxBtn.addEventListener('click', () => toggleMaximize(id));
    const header = win.querySelector('.window-header');
    if (header) makeDraggable(win, header);
  });

  function bringToFront(id) {
    const win = windows[id];
    if (!win) return;
    topZ += 2;
    win.style.zIndex = topZ;
    document.querySelectorAll('.os-window').forEach((w) => w.classList.remove('active'));
    win.classList.add('active');
    document.querySelectorAll('.taskbar-tab').forEach((t) => t.classList.remove('active'));
    if (taskTabs[id]) taskTabs[id].classList.add('active');
  }

  function openWindow(id) {
    const win = windows[id];
    if (!win) return;
    playSound('open');
    win.classList.remove('minimized');
    win.style.display = 'flex';
    bringToFront(id);
    if (!taskTabs[id]) {
      const title = win.querySelector('.window-title-group span:last-child')?.textContent || id;
      const tab = document.createElement('div');
      tab.className = 'taskbar-tab active';
      tab.innerHTML = `<span>${title}</span>`;
      tab.addEventListener('click', () => {
        if (win.classList.contains('minimized') || !win.classList.contains('active')) {
          win.classList.remove('minimized');
          bringToFront(id);
        } else {
          minimizeWindow(id);
        }
      });
      document.querySelector('.taskbar-tasks')?.appendChild(tab);
      taskTabs[id] = tab;
    } else {
      taskTabs[id].classList.add('active');
    }
  }

  function closeWindow(id) {
    const win = windows[id];
    if (!win) return;
    playSound('click');
    win.style.display = 'none';
    if (taskTabs[id]) { taskTabs[id].remove(); delete taskTabs[id]; }
  }

  function minimizeWindow(id) {
    const win = windows[id];
    if (!win) return;
    playSound('click');
    win.classList.add('minimized');
    if (taskTabs[id]) taskTabs[id].classList.remove('active');
  }

  function toggleMaximize(id) {
    const win = windows[id];
    if (!win) return;
    playSound('click');
    win.classList.toggle('maximized');
  }

  function makeDraggable(win, handle) {
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    const onMouseDown = (e) => {
      if (win.classList.contains('maximized')) return;
      isDragging = true;
      startX = e.clientX || e.touches?.[0]?.clientX;
      startY = e.clientY || e.touches?.[0]?.clientY;
      const rect = win.getBoundingClientRect();
      initialLeft = rect.left; initialTop = rect.top;
      bringToFront(win.getAttribute('data-window'));
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove, { passive: false });
      document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable && e.type === 'touchmove') e.preventDefault();
      const curX = e.clientX || e.touches?.[0]?.clientX;
      const curY = e.clientY || e.touches?.[0]?.clientY;
      win.style.left = `${Math.max(0, Math.min(window.innerWidth - 80, initialLeft + curX - startX))}px`;
      win.style.top = `${Math.max(0, Math.min(window.innerHeight - 80, initialTop + curY - startY))}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);
    handle.addEventListener('touchstart', onMouseDown, { passive: true });
  }

  // --- Desktop Icons ---
  document.querySelectorAll('.dylan-icon').forEach((icon) => {
    const target = icon.getAttribute('data-target');
    icon.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.dylan-icon').forEach((i) => i.classList.remove('selected'));
      icon.classList.add('selected');
      if (target) openWindow(target);
    });
  });

  // --- Start Menu ---
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');

  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      startBtn.classList.toggle('active');
      startMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.remove('show');
        startBtn.classList.remove('active');
      }
    });

    document.querySelectorAll('.start-menu-item').forEach((item) => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        if (target) openWindow(target);
        startMenu.classList.remove('show');
        startBtn.classList.remove('active');
      });
    });
  }

  // --- Clock ---
  const clockEl = document.getElementById('tray-clock');
  const updateClock = () => {
    if (!clockEl) return;
    clockEl.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  setInterval(updateClock, 1000);
  updateClock();

  // --- Terminal ---
  const termHistory = document.getElementById('terminal-history');
  const termInput = document.getElementById('terminal-input');

  const printLine = (text, cls = '') => {
    if (!termHistory) return;
    const div = document.createElement('div');
    div.className = `terminal-line ${cls}`;
    div.textContent = text;
    termHistory.appendChild(div);
    termHistory.scrollTop = termHistory.scrollHeight;
  };

  const handleCommand = (cmd) => {
    const raw = cmd.trim();
    const parts = raw.split(/\s+/);
    const action = parts[0].toLowerCase();
    printLine(`dylan@web3:~$ ${raw}`, 'cyan');

    switch (action) {
      case 'help':
        printLine('Available Dylan OS Commands:');
        printLine('  about       - Display Dylan profile & background');
        printLine('  projects    - List Dylan public Web3 projects & repositories');
        printLine('  skills      - View technical capabilities & proof');
        printLine('  contact     - Display contact options');
        printLine('  neofetch    - System specs & info');
        printLine('  scan <addr> - Scan EVM wallet activity demonstration');
        printLine('  cv          - Switch to lightweight resume (/cv)');
        printLine('  clear       - Clear screen');
        break;
      case 'about':
        printLine('Dylan — Web3 Tester & Researcher.', 'pink');
        printLine('Explores early products and ecosystems through hands-on testing.');
        printLine('Focus: Testnet, Retroactive, NFT, DeFi, Gaming, Tool Building.');
        break;
      case 'projects':
        printLine('1. Dylan HQ (NoteBook)  - Dashboard for airdrops, mints & notes');
        printLine('2. Wallet Activity Scanner - EVM wallet scanner tooling');
        printLine('3. Pact                 - Solidity smart contract on ARC');
        printLine('4. Shelby CLI           - Storage blob uploader CLI');
        printLine('5. DylanWeb OS          - Retro-futuristic Web3 Desktop portfolio');
        break;
      case 'skills':
        printLine('Technical Skills with Proof:');
        printLine('  • EVM Wallet Analysis & On-chain Tracking');
        printLine('  • Web3 Research Workflows & Protocol Auditing');
        printLine('  • Solidity Prototyping (EVM / ARC)');
        printLine('  • Web Experience (Flask / React / WebGL / Fullstack)');
        break;
      case 'contact':
        printLine('• Telegram: https://t.me/iamdylan2026', 'pink');
        printLine('• X/Twitter: https://x.com/dylan_ngmi', 'cyan');
        printLine('• GitHub:    https://github.com/DylanSoBad', 'green');
        printLine('• Email:     airdropdylan2@gmail.com');
        break;
      case 'neofetch':
        printLine('   _____       __            ____  _____');
        printLine('  / ___/____  / /___ _____  / __ \\/ ___/');
        printLine('  \\__ \\/ __ \\/ / __ `/ __ \\/ / / /\\__ \\ ');
        printLine(' ___/ / /_/ / / /_/ / / / / /_/ /___/ / ');
        printLine('/____/\\____/_/\\__,_/_/ /_/\\____//____/  ');
        printLine('OS: DylanWeb OS 2.6.0 x86_64');
        printLine('Kernel: Web3-EVM-Tester-v2026');
        printLine('Uptime: Active 24/7');
        printLine('Shell: dylan-sh 4.2');
        printLine('Focus: Monad, Berachain, Arbitrum Nitro');
        break;
      case 'scan':
        const addr = parts[1] || '0x71C...b82';
        printLine(`Scanning address: ${addr}...`, 'cyan');
        setTimeout(() => printLine(`[SCAN COMPLETE] 24 txns found, 3 testnet contracts interacted.`, 'green'), 400);
        break;
      case 'cv':
        window.location.href = '/cv';
        break;
      case 'clear':
        if (termHistory) termHistory.innerHTML = '';
        break;
      case '':
        break;
      default:
        printLine(`Command not found: "${action}". Type "help" for a list of commands.`, 'muted');
    }
  };

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleCommand(termInput.value);
        termInput.value = '';
      }
    });
  }

  // --- Copy Email ---
  document.querySelectorAll('.copy-email-action').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = 'airdropdylan2@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Email Copied to Clipboard! ✓</span>';
        setTimeout(() => { btn.innerHTML = orig; }, 2200);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = email; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Email Copied! ✓</span>';
        setTimeout(() => { btn.innerHTML = orig; }, 2200);
      }
    });
  });

  // --- Auto-open Profile on first launch ---
  setTimeout(() => { openWindow('profile'); }, 1100);
})();
