// Stars background animation
import confetti from 'canvas-confetti';
import Slot from '@js/Slot';
import SoundEffects from '@js/SoundEffects';
import PrizeManager from '@js/PrizeManager';

const initStars = () => {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const COLORS = ['#ffffff', '#FFD700', '#ff9ef5', '#9ef5ff', '#a0ff9e', '#ffb347', '#ff8800', '#aa44ff'];
  type Star = { x: number; y: number; r: number; color: string; speed: number; phase: number; alpha: number };

  const stars: Star[] = Array.from({ length: 75 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 0.8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: Math.random() * 0.012 + 0.004,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random()
  }));

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const draw = (t: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.alpha = 0.15 + 0.85 * Math.abs(Math.sin(t * s.speed + s.phase));
      ctx.save();
      ctx.globalAlpha = s.alpha * 0.9;
      ctx.shadowBlur = 6;
      ctx.shadowColor = s.color;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
};

initStars();

(() => {
  const drawButton = document.getElementById('draw-button') as HTMLButtonElement | null;
  const fullscreenButton = document.getElementById('fullscreen-button') as HTMLButtonElement | null;
  const settingsButton = document.getElementById('settings-button') as HTMLButtonElement | null;
  const settingsWrapper = document.getElementById('settings') as HTMLDivElement | null;
  const settingsContent = document.getElementById('settings-panel') as HTMLDivElement | null;
  const settingsSaveButton = document.getElementById('settings-save') as HTMLButtonElement | null;
  const settingsCloseButton = document.getElementById('settings-close') as HTMLButtonElement | null;
  const sunburstSvg = document.getElementById('sunburst') as HTMLImageElement | null;
  const confettiCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
  const nameListTextArea = document.getElementById('name-list') as HTMLTextAreaElement | null;
  const removeNameFromListCheckbox = document.getElementById('remove-from-list') as HTMLInputElement | null;
  const enableSoundCheckbox = document.getElementById('enable-sound') as HTMLInputElement | null;
  const prizeButtonsContainer = document.getElementById('prize-buttons') as HTMLDivElement | null;
  const currentPrizeLabel = document.getElementById('current-prize-label') as HTMLDivElement | null;
  const recordsPanel = document.getElementById('records-panel') as HTMLDivElement | null;
  const recordsToggle = document.getElementById('records-toggle') as HTMLButtonElement | null;
  const recordsClose = document.getElementById('records-close') as HTMLButtonElement | null;
  const recordsBody = document.getElementById('records-body') as HTMLDivElement | null;
  const exportCsvButton = document.getElementById('export-csv') as HTMLButtonElement | null;
  const clearRecordsButton = document.getElementById('clear-records') as HTMLButtonElement | null;
  const prizeConfigList = document.getElementById('prize-config-list') as HTMLDivElement | null;
  const addPrizeRowButton = document.getElementById('add-prize-row') as HTMLButtonElement | null;
  const csvUpload = document.getElementById('csv-upload') as HTMLInputElement | null;
  const participantCountEl = document.getElementById('participant-count') as HTMLDivElement | null;
  const drawSeedEl = document.getElementById('draw-seed') as HTMLDivElement | null;
  const dedupeNoticeEl = document.getElementById('dedupe-notice') as HTMLDivElement | null;

  if (!(
    drawButton && fullscreenButton && settingsButton
    && settingsWrapper && settingsContent && settingsSaveButton
    && settingsCloseButton && sunburstSvg && confettiCanvas
    && nameListTextArea && removeNameFromListCheckbox && enableSoundCheckbox
    && prizeButtonsContainer && currentPrizeLabel
    && recordsPanel && recordsToggle && recordsClose && recordsBody
    && exportCsvButton && clearRecordsButton
    && prizeConfigList && addPrizeRowButton
  )) {
    console.error('One or more Element ID is invalid.');
    return;
  }

  const soundEffects = new SoundEffects();
  const MAX_REEL_ITEMS = 40;
  const CONFETTI_COLORS = [
    '#26ccff', '#a25afd', '#ff5e7e', '#88ff5a',
    '#fcff42', '#ffa62d', '#ff36ff'
  ];
  const prizeManager = new PrizeManager();
  let confettiAnimationId: number;
  let slot: Slot;

  // ── Per-prize countdown bar ───────────────────────────────────
  const countdownBarEl = document.getElementById('countdown-bar') as HTMLDivElement | null;
  const countdownBarTimeEl = document.getElementById('countdown-bar-time') as HTMLDivElement | null;
  const countdownToggleBtn = document.getElementById('countdown-toggle') as HTMLButtonElement | null;
  const countdownResetBtn = document.getElementById('countdown-reset') as HTMLButtonElement | null;
  let countdownTimerId: number | null = null;
  let countdownSecsLeft = 0;
  let countdownRunning = false;

  const fmtSecs = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const refreshCountdownDisplay = () => {
    if (!countdownBarTimeEl) return;
    countdownBarTimeEl.textContent = fmtSecs(Math.max(0, countdownSecsLeft));
    countdownBarTimeEl.classList.toggle('urgent', countdownSecsLeft <= 30 && countdownSecsLeft > 0);
  };

  const stopCountdownTimer = () => {
    if (countdownTimerId !== null) { clearInterval(countdownTimerId); countdownTimerId = null; }
    countdownRunning = false;
    if (countdownToggleBtn) countdownToggleBtn.textContent = 'Start';
  };

  const updateCountdownBar = () => {
    const p = prizeManager.currentPrize;
    const mins = p?.countdownMinutes ?? 0;
    if (!countdownBarEl || !p || !mins) {
      if (countdownBarEl) countdownBarEl.style.display = 'none';
      stopCountdownTimer();
      return;
    }
    countdownBarEl.style.display = 'flex';
    // If not running, reset to this prize's duration
    if (!countdownRunning) {
      countdownSecsLeft = mins * 60;
      refreshCountdownDisplay();
    }
  };

  countdownToggleBtn?.addEventListener('click', () => {
    const p = prizeManager.currentPrize;
    if (!p || !(p.countdownMinutes ?? 0)) return;
    if (countdownRunning) {
      // Pause
      stopCountdownTimer();
      prizeManager.pauseCountdown(countdownSecsLeft);
    } else {
      // Start / Resume
      countdownRunning = true;
      if (countdownToggleBtn) countdownToggleBtn.textContent = 'Pause';
      prizeManager.startCountdown(p.id, p.countdownMinutes!, countdownSecsLeft);
      countdownTimerId = window.setInterval(() => {
        countdownSecsLeft = Math.max(0, countdownSecsLeft - 1);
        refreshCountdownDisplay();
        if (countdownSecsLeft <= 0) stopCountdownTimer();
      }, 1000);
    }
  });

  countdownResetBtn?.addEventListener('click', () => {
    const p = prizeManager.currentPrize;
    if (!p || !(p.countdownMinutes ?? 0)) return;
    stopCountdownTimer();
    countdownSecsLeft = (p.countdownMinutes ?? 0) * 60;
    refreshCountdownDisplay();
    prizeManager.resetCountdown(p.id, p.countdownMinutes!);
  });

  const customConfetti = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true
  });

  const confettiAnimation = () => {
    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const confettiScale = Math.max(0.5, Math.min(1, windowWidth / 1100));
    customConfetti({
      particleCount: 1,
      gravity: 0.8,
      spread: 90,
      origin: { y: 0.6 },
      colors: [CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]],
      scalar: confettiScale
    });
    confettiAnimationId = window.requestAnimationFrame(confettiAnimation);
  };

  const stopWinningAnimation = () => {
    if (confettiAnimationId) window.cancelAnimationFrame(confettiAnimationId);
    sunburstSvg.style.display = 'none';
  };

  const maskName = (name: string) => {
    const parts = name.split(/(\s+|—|-)/);
    return parts.map((part) => {
      if (/^\s+$/.test(part) || part === '—' || part === '-') return part;
      if (part.length <= 2) return part;
      const keep = Math.ceil(part.length / 3);
      return `${part.slice(0, keep)}***`;
    }).join('');
  };

  const updateCurrentPrizeLabel = () => {
    const p = prizeManager.currentPrize;
    currentPrizeLabel.textContent = p
      ? `Drawing: ${p.name} (${prizeManager.remainingCount()} remaining)`
      : 'Please select a prize';
  };

  const updateDrawButton = () => {
    const p = prizeManager.currentPrize;
    const hasNames = slot ? slot.names.length > 0 : false;
    drawButton.disabled = !p || prizeManager.isCurrentPrizeFull() || !hasNames;
    if (!p) drawButton.title = 'Please select a prize first';
    else if (prizeManager.isCurrentPrizeFull()) drawButton.title = 'All winners for this prize have been drawn';
    else if (!hasNames) drawButton.title = 'Add participants in Settings first';
    else drawButton.title = '';
  };

  const updateParticipantCount = () => {
    const count = slot ? slot.names.length : 0;
    if (participantCountEl) participantCountEl.textContent = `${count} participants in pool`;
    try { localStorage.setItem('draw-participant-count', String(count)); } catch (e) { /* ignore */ }
  };

  const filterOutWinners = (names: string[]): string[] => {
    const allWinners = new Set(
      prizeManager.allPrizes.flatMap((p) => p.winners.map((w) => w.trim().toLowerCase()))
    );
    return names.filter((n) => !allWinners.has(n.trim().toLowerCase()));
  };

  const showDedupeNotice = (removed: number) => {
    if (!dedupeNoticeEl) return;
    if (removed > 0) {
      dedupeNoticeEl.textContent = `⚠ ${removed} duplicate winner${removed > 1 ? 's' : ''} removed from list`;
      dedupeNoticeEl.classList.add('visible');
    } else {
      dedupeNoticeEl.textContent = '';
      dedupeNoticeEl.classList.remove('visible');
    }
  };

  // Prize buttons
  const renderPrizeButtons = () => {
    prizeButtonsContainer.innerHTML = '';
    prizeManager.allPrizes.forEach((prize) => {
      const btn = document.createElement('button');
      const isFull = prize.winners.length >= prize.count;
      const isActive = prizeManager.currentPrize?.id === prize.id;
      btn.className = `prize-select-btn${isActive ? ' active' : ''}${isFull ? ' full' : ''}`;
      btn.innerHTML = `<span class="prize-btn-name">${prize.name}</span>`
        + `<span class="prize-btn-meta">${prize.winners.length}/${prize.count} ppl</span>`;
      btn.disabled = isFull;
      btn.addEventListener('click', () => {
        stopCountdownTimer();           // stop any running countdown before switching
        prizeManager.selectPrize(prize.id);
        renderPrizeButtons();
        updateCurrentPrizeLabel();
        updateDrawButton();
        updateCountdownBar();
        stopWinningAnimation();
      });
      prizeButtonsContainer.appendChild(btn);
    });
  };

  // Records panel
  const renderRecords = () => {
    recordsBody.innerHTML = '';
    const prizes = prizeManager.allPrizes;
    const hasAny = prizes.some((p) => p.winners.length > 0);
    if (!hasAny) {
      recordsBody.innerHTML = '<p class="records-empty">No records yet</p>';
      return;
    }
    prizes.forEach((prize) => {
      if (!prize.winners.length) return;
      const group = document.createElement('div');
      group.className = 'records-group';
      group.innerHTML = `<div class="records-group-title">${prize.name} `
        + `<span>${prize.winners.length}/${prize.count} winners</span></div>`;
      const list = document.createElement('div');
      list.className = 'records-list';
      prize.winners.forEach((w, i) => {
        const item = document.createElement('div');
        item.className = 'records-item';
        const ts = prize.winnerTimestamps?.[i] ?? '';
        item.innerHTML = `<span>${i + 1}. ${w}</span>${ts ? `<span class="records-item__ts">${ts}</span>` : ''}`;
        list.appendChild(item);
      });
      group.appendChild(list);
      recordsBody.appendChild(group);
    });
  };

  recordsToggle.addEventListener('click', () => {
    renderRecords();
    recordsPanel.style.display = 'block';
  });

  recordsClose.addEventListener('click', () => {
    recordsPanel.style.display = 'none';
  });

  exportCsvButton.addEventListener('click', () => {
    const csv = prizeManager.exportCSV();
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lucky-draw-records.csv';
    a.click();
  });

  clearRecordsButton.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Clear all records?')) return;
    prizeManager.clearRecords();
    renderPrizeButtons();
    updateCurrentPrizeLabel();
    renderRecords();
  });

  // Prize config in settings
  const makePrizeRow = (id: string, name: string, count: number, cdMins: number): HTMLDivElement => {
    const row = document.createElement('div');
    row.className = 'prize-config-row';
    row.dataset.id = id;
    row.innerHTML = `
      <input class="input-field pc-name" type="text" placeholder="Prize name" value="${name}">
      <input class="input-field pc-count" type="number" min="1" value="${count}" style="text-align:center">
      <input class="input-field pc-countdown" type="number" min="0" max="60" value="${cdMins}" style="text-align:center" title="Countdown minutes (0 = off)">
      <button class="solid-button solid-button--danger pc-del" style="padding:0.4rem 0.8rem;font-size:0.875rem">✕</button>
    `;
    row.querySelector('.pc-del')!.addEventListener('click', () => row.remove());
    return row;
  };

  const renderPrizeConfig = () => {
    prizeConfigList.innerHTML = '';
    prizeManager.allPrizes.forEach((prize) => {
      prizeConfigList.appendChild(makePrizeRow(prize.id, prize.name, prize.count, prize.countdownMinutes ?? 0));
    });
  };

  addPrizeRowButton.addEventListener('click', () => {
    prizeConfigList.appendChild(makePrizeRow(String(Date.now()), '', 1, 0));
  });

  // Spin callbacks
  const onSpinStart = () => {
    stopWinningAnimation();
    drawButton.disabled = true;
    settingsButton.disabled = true;
    prizeButtonsContainer.querySelectorAll<HTMLButtonElement>('.prize-select-btn').forEach((btn) => {
      btn.disabled = true;
    });
    const seed = Date.now();
    if (drawSeedEl) {
      drawSeedEl.textContent = `SEED · ${seed}`;
      drawSeedEl.style.opacity = '1';
    }
    try {
      localStorage.setItem('draw-last-seed', String(seed));
      localStorage.setItem('draw-recovery-names', JSON.stringify(slot.names));
      localStorage.setItem('draw-recovery-pending', '1');
    } catch (e) { /* ignore */ }
    soundEffects.spin((MAX_REEL_ITEMS - 1) / 10);
  };

  const onSpinEnd = async () => {
    confettiAnimation();
    sunburstSvg.style.display = 'block';
    await soundEffects.win();

    const winnerEl = document.querySelector('#reel > div:last-child');
    const rawName = winnerEl?.textContent ?? '';
    if (winnerEl && rawName) {
      prizeManager.addWinner(rawName);
      setTimeout(() => {
        winnerEl.textContent = maskName(rawName);
      }, 100);
    }

    const prizeName = prizeManager.currentPrize?.name ?? '';
    const feedList = document.getElementById('winners-feed__list');
    if (feedList && rawName) {
      const entry = document.createElement('div');
      entry.className = 'winner-entry';
      entry.innerHTML = `
        <div class="winner-entry__prize">${prizeName}</div>
        <div class="winner-entry__name">${maskName(rawName)}</div>
      `;
      feedList.insertBefore(entry, feedList.firstChild);
      while (feedList.children.length > 8) {
        feedList.removeChild(feedList.lastChild!);
      }
      const totalEl = document.getElementById('winners-total');
      if (totalEl) {
        const total = prizeManager.allPrizes
          .reduce((sum, p) => sum + p.winners.length, 0);
        totalEl.textContent = String(total);
      }
    }

    // Update ticker
    const tickerContent = document.getElementById('winners-ticker__content');
    if (tickerContent) {
      tickerContent.innerHTML = '';
      prizeManager.allPrizes.forEach((prize) => {
        prize.winners.forEach((w) => {
          const item = document.createElement('span');
          item.className = 'ticker-item';
          item.innerHTML = `<span class="ticker-item__prize">${prize.name}</span>`
            + '<span class="ticker-item__sep">·</span>'
            + `<span>${maskName(w)}</span>`;
          tickerContent.appendChild(item);
        });
      });
    }

    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
    updateParticipantCount();
    try { localStorage.removeItem('draw-recovery-pending'); localStorage.removeItem('draw-recovery-names'); } catch (e) { /* ignore */ }
    settingsButton.disabled = false;
  };

  // Slot instance
  slot = new Slot({
    reelContainerSelector: '#reel',
    maxReelItems: MAX_REEL_ITEMS,
    onSpinStart,
    onSpinEnd,
    onNameListChanged: () => { stopWinningAnimation(); updateParticipantCount(); }
  });
  updateDrawButton();
  updateParticipantCount();

  // Main clock
  const mainClockTime = document.getElementById('main-clock-time');
  const mainClockDate = document.getElementById('main-clock-date');
  const tickClock = () => {
    const now = new Date();
    if (mainClockTime) mainClockTime.textContent = now.toLocaleTimeString('en-GB');
    if (mainClockDate) mainClockDate.textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  tickClock();
  setInterval(tickClock, 1000);

  // Interruption recovery
  const recoveryBanner = document.getElementById('recovery-banner') as HTMLDivElement | null;
  const recoveryMessage = document.getElementById('recovery-message') as HTMLSpanElement | null;
  const recoveryRestore = document.getElementById('recovery-restore') as HTMLButtonElement | null;
  const recoveryDismiss = document.getElementById('recovery-dismiss') as HTMLButtonElement | null;

  const clearRecovery = () => {
    try { localStorage.removeItem('draw-recovery-pending'); localStorage.removeItem('draw-recovery-names'); } catch (e) { /* ignore */ }
    if (recoveryBanner) recoveryBanner.style.display = 'none';
  };

  if (localStorage.getItem('draw-recovery-pending')) {
    let saved: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('draw-recovery-names') || '[]');
      if (Array.isArray(parsed)) saved = parsed.filter((n) => typeof n === 'string');
    } catch { /* corrupted data — skip recovery */ }
    if (saved.length && recoveryBanner && recoveryMessage) {
      recoveryMessage.textContent = `⚠ Draw was interrupted. Restore ${saved.length} names to pool?`;
      recoveryBanner.style.display = 'flex';
    }
    recoveryRestore?.addEventListener('click', () => {
      let names: string[] = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('draw-recovery-names') || '[]');
        if (Array.isArray(parsed)) names = parsed.filter((n) => typeof n === 'string');
      } catch { /* ignore */ }
      slot.names = names;
      updateParticipantCount();
      updateDrawButton();
      clearRecovery();
    });
    recoveryDismiss?.addEventListener('click', clearRecovery);
  }

  // Settings panel
  const onSettingsOpen = () => {
    nameListTextArea.value = slot.names.join('\n');
    removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
    enableSoundCheckbox.checked = !soundEffects.mute;
    renderPrizeConfig();
    settingsWrapper.style.display = 'block';
  };

  const onSettingsClose = () => {
    settingsContent.scrollTop = 0;
    settingsWrapper.style.display = 'none';
  };

  drawButton.addEventListener('click', () => {
    if (!slot.names.length) { onSettingsOpen(); return; }
    if (!prizeManager.currentPrize) return;
    slot.spin();
  });

  // @ts-expect-error - older browsers
  if (!(document.documentElement.requestFullscreen && document.exitFullscreen)) {
    fullscreenButton.remove();
  }

  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      return;
    }
    document.exitFullscreen();
  });

  settingsButton.addEventListener('click', onSettingsOpen);

  settingsSaveButton.addEventListener('click', () => {
    const rawNames = nameListTextArea.value
      ? nameListTextArea.value.split(/\n/).filter((n) => Boolean(n.trim()))
      : [];
    const filtered = filterOutWinners(rawNames);
    showDedupeNotice(rawNames.length - filtered.length);
    slot.names = filtered;
    slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
    soundEffects.mute = !enableSoundCheckbox.checked;
    const rows = Array.from(prizeConfigList.querySelectorAll('.prize-config-row'));
    const newPrizes = rows.map((row) => ({
      id: (row as HTMLElement).dataset.id ?? String(Date.now()),
      name: (row.querySelector('.pc-name') as HTMLInputElement).value.trim() || 'Prize',
      count: Math.max(1, parseInt((row.querySelector('.pc-count') as HTMLInputElement).value, 10) || 1),
      countdownMinutes: Math.max(0, parseInt((row.querySelector('.pc-countdown') as HTMLInputElement).value, 10) || 0),
    }));
    prizeManager.setPrizes(newPrizes);
    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
    updateParticipantCount();
    stopCountdownTimer();
    updateCountdownBar();
    onSettingsClose();
  });

  settingsCloseButton.addEventListener('click', onSettingsClose);
  document.getElementById('settings-close-x')?.addEventListener('click', onSettingsClose);
  // CSV upload
  csvUpload?.addEventListener('change', () => {
    const file = csvUpload.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const names = text
        .split('\n')
        .map((line) => line.split(',')[0].replace(/^"|"$/g, '').trim())
        .filter(Boolean);
      const filtered = filterOutWinners(names);
      showDedupeNotice(names.length - filtered.length);
      nameListTextArea.value = filtered.join('\n');
      if (dedupeNoticeEl && filtered.length > 0) {
        const base = dedupeNoticeEl.textContent || '';
        dedupeNoticeEl.textContent = `✓ Loaded ${filtered.length} names from CSV${base ? `  ·  ${base}` : ''}`;
        dedupeNoticeEl.classList.add('visible');
      }
    };
    reader.readAsText(file, 'UTF-8');
    csvUpload.value = '';
  });

  // Init
  renderPrizeButtons();
  updateCurrentPrizeLabel();
  updateCountdownBar();
  drawButton.disabled = true;

  // Restore ticker from storage
  const tickerContent = document.getElementById('winners-ticker__content');
  if (tickerContent) {
    prizeManager.allPrizes.forEach((prize) => {
      prize.winners.forEach((w) => {
        const item = document.createElement('span');
        item.className = 'ticker-item';
        item.innerHTML = `
          <span class="ticker-item__prize">${prize.name}</span>
          <span class="ticker-item__sep">·</span>
          <span>${maskName(w)}</span>
        `;
        tickerContent.appendChild(item);
      });
    });
  }

  // Firebase sync error toast
  const showToast = (msg: string, color = 'rgba(220,60,60,0.92)') => {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);background:${color};color:#fff;padding:0.5rem 1.2rem;border-radius:0.5rem;font-size:0.85rem;z-index:9999;pointer-events:none;white-space:nowrap`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };
  document.addEventListener('firebase-sync-error', () => {
    showToast('⚠ Firebase sync failed — data saved locally only');
  });

  // Warn before closing
  window.addEventListener('beforeunload', (e) => {
    const total = prizeManager.allPrizes.reduce((sum, p) => sum + p.winners.length, 0);
    if (total > 0) {
      e.preventDefault();
    }
  });
})();
