/**
 * DYLAN OS — Web3 Desktop Operating System Engine
 * Faithful to Ryft.fun Design & Mechanics
 */
(() => {
  'use strict';

  // ─── Web Audio Synthesizer ──────────────────────────────────────────
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
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio context silently blocked if no user gesture yet
    }
  };

  // ─── Boot Sequence (Ryft Startup Spinner) ───────────────────────────
  const bootScreen = document.getElementById('boot-screen');
  const bootStatus = document.getElementById('boot-status');
  let bootDone = false;

  const bootPhases = [
    'INITIALIZING WORKSPACE...',
    'LOADING ASSETS & PROTOCOLS',
    'WORKSPACE READY'
  ];

  const finishBoot = () => {
    if (bootDone) return;
    bootDone = true;
    playSound('open');
    if (bootScreen) {
      bootScreen.classList.add('fade-out');
      setTimeout(() => {
        bootScreen.style.display = 'none';
      }, 450);
    }
  };

  if (bootScreen) {
    bootScreen.addEventListener('click', finishBoot);
    window.addEventListener('keydown', (e) => {
      if (!bootDone && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
        finishBoot();
      }
    });

    let phaseIndex = 0;
    const nextPhase = () => {
      if (bootDone) return;
      phaseIndex++;
      if (phaseIndex < bootPhases.length) {
        if (bootStatus) bootStatus.textContent = bootPhases[phaseIndex];
        setTimeout(nextPhase, 200);
      } else {
        setTimeout(finishBoot, 240);
      }
    };
    setTimeout(nextPhase, 180);
  } else {
    bootDone = true;
  }

  // ─── Top Announcement Ticker ─────────────────────────────────────────
  const tickerMessages = [
    'Researching Monad Devnet, Berachain v2, and Arbitrum Nitro',
    'Wallet Activity Scanner: EVM multi-chain tracker live on GitHub',
    'Pact: Decentralized milestone smart contract deployed on ARC Network',
    'Dylan HQ (NoteBook): Web3 personal airdrop & testnet tracking workspace',
    'Active on-chain tester & builder — ready for protocol research'
  ];
  let tickerIdx = 0;
  const tickerText = document.getElementById('ticker-text');
  if (tickerText) {
    setInterval(() => {
      tickerIdx = (tickerIdx + 1) % tickerMessages.length;
      tickerText.style.opacity = '0';
      setTimeout(() => {
        tickerText.textContent = tickerMessages[tickerIdx];
        tickerText.style.opacity = '1';
      }, 250);
    }, 4500);
  }

  // ─── Subtle Canvas Particle Network ─────────────────────────────────
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(255, 31, 168, 0.4)' : 'rgba(114, 232, 240, 0.35)'
    }));

    const render = () => {
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
          if (dist < 120) {
            ctx.strokeStyle = `rgba(136, 117, 143, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(render);
    };
    render();
  }

  // ─── Window Management Engine ───────────────────────────────────────
  let topZ = 100;
  const windows = {};
  const taskTabs = {};
  const taskbarTasks = document.querySelector('.taskbar-tasks');

  const bringToFront = (id) => {
    const win = windows[id];
    if (!win) return;
    topZ += 2;
    win.style.zIndex = topZ;
    document.querySelectorAll('.os-window').forEach((w) => w.classList.remove('focused'));
    win.classList.add('focused');

    document.querySelectorAll('.taskbar-tab').forEach((t) => t.classList.remove('active'));
    if (taskTabs[id]) taskTabs[id].classList.add('active');
  };

  const openWindow = (id) => {
    const win = windows[id];
    if (!win) return;
    playSound('open');
    win.classList.remove('minimized');
    win.classList.add('visible');
    bringToFront(id);

    if (!taskTabs[id] && taskbarTasks) {
      const title = win.querySelector('.window-title-text')?.textContent || id;
      const tab = document.createElement('div');
      tab.className = 'taskbar-tab active';
      tab.innerHTML = `<span>${title}</span>`;
      tab.addEventListener('click', () => {
        if (win.classList.contains('minimized') || !win.classList.contains('focused')) {
          win.classList.remove('minimized');
          win.classList.add('visible');
          bringToFront(id);
        } else {
          minimizeWindow(id);
        }
      });
      taskbarTasks.appendChild(tab);
      taskTabs[id] = tab;
    } else if (taskTabs[id]) {
      taskTabs[id].classList.add('active');
    }
  };

  const closeWindow = (id) => {
    const win = windows[id];
    if (!win) return;
    playSound('click');
    win.classList.remove('visible');
    win.classList.remove('focused');
    if (taskTabs[id]) {
      taskTabs[id].remove();
      delete taskTabs[id];
    }
  };

  const minimizeWindow = (id) => {
    const win = windows[id];
    if (!win) return;
    playSound('click');
    win.classList.add('minimized');
    win.classList.remove('focused');
    if (taskTabs[id]) taskTabs[id].classList.remove('active');
  };

  const toggleMaximize = (id) => {
    const win = windows[id];
    if (!win) return;
    playSound('click');
    win.classList.toggle('maximized');
  };

  const makeDraggable = (win, handle) => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const onMouseDown = (e) => {
      if (win.classList.contains('maximized')) return;
      isDragging = true;
      startX = e.clientX ?? e.touches?.[0]?.clientX;
      startY = e.clientY ?? e.touches?.[0]?.clientY;
      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      bringToFront(win.getAttribute('data-window'));

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove, { passive: false });
      document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable && e.type === 'touchmove') e.preventDefault();
      const curX = e.clientX ?? e.touches?.[0]?.clientX;
      const curY = e.clientY ?? e.touches?.[0]?.clientY;
      const dx = curX - startX;
      const dy = curY - startY;

      const newLeft = Math.max(0, Math.min(window.innerWidth - 80, initialLeft + dx));
      const newTop = Math.max(42, Math.min(window.innerHeight - 80, initialTop + dy));
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
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
  };

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

  // Open default window (Profile) and register its taskbar tab
  const defaultWin = document.querySelector('.os-window[data-window="profile"]');
  if (defaultWin) {
    openWindow('profile');
  }

  // ─── Desktop Icons Triggers ─────────────────────────────────────────
  document.querySelectorAll('.dylan-icon').forEach((icon) => {
    const target = icon.getAttribute('data-target');
    icon.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.dylan-icon').forEach((i) => i.classList.remove('selected'));
      icon.classList.add('selected');
      if (target) openWindow(target);
    });
  });

  // ─── Start Menu ─────────────────────────────────────────────────────
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

  // ─── Tray Clock ─────────────────────────────────────────────────────
  const clockEl = document.getElementById('tray-clock');
  const updateClock = () => {
    if (!clockEl) return;
    clockEl.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  setInterval(updateClock, 1000);
  updateClock();

  // ─── Interactive Terminal ───────────────────────────────────────────
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
        printLine('Dylan — Web3 Tester & Researcher.', 'accent');
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
        printLine('• Telegram: https://t.me/iamdylan2026', 'accent');
        printLine('• X/Twitter: https://x.com/dylan_ngmi', 'cyan');
        printLine('• GitHub:    https://github.com/DylanSoBad', 'success');
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
        setTimeout(() => printLine(`[SCAN COMPLETE] 24 txns found, 3 testnet contracts interacted.`, 'success'), 400);
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
        printLine(`Command not found: "${action}". Type "help" for a list of commands.`, 'dim');
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

  // ─── Copy Email Address ─────────────────────────────────────────────
  document.querySelectorAll('.copy-email-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = 'airdropdylan2@gmail.com';
      const targetEl = btn.querySelector('.contact-action-pill') || btn;
      const originalText = targetEl.innerHTML;
      try {
        await navigator.clipboard.writeText(email);
        targetEl.innerHTML = '<span style="color:var(--ryft-success)">COPIED! ✓</span>';
        setTimeout(() => { targetEl.innerHTML = originalText; }, 2200);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        targetEl.innerHTML = '<span style="color:var(--ryft-success)">COPIED! ✓</span>';
        setTimeout(() => { targetEl.innerHTML = originalText; }, 2200);
      }
    });
  });
})();
