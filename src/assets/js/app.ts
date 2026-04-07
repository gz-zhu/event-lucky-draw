// Stars background animation
import confetti from 'canvas-confetti';
import Slot from '@js/Slot';
import SoundEffects from '@js/SoundEffects';
import PrizeManager from '@js/PrizeManager';
import {
  t, setLang, applyLang, type Lang
} from '@js/i18n';

const initStars = () => {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const COLORS = ['#ffffff', '#FFD700', '#ff9ef5', '#9ef5ff', '#a0ff9e', '#ffb347', '#ff8800', '#aa44ff'];
  // eslint-disable-next-line max-len
  type Star = { x: number; y: number; r: number; color: string; speed: number; phase: number; alpha: number };

  const stars: Star[] = Array.from({ length: 130 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 3.5 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: Math.random() * 0.012 + 0.004,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random()
  }));

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const draw = (ts: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      // eslint-disable-next-line no-param-reassign
      s.alpha = 0.15 + 0.85 * Math.abs(Math.sin(ts * s.speed + s.phase));
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

  // Apply saved language to all data-i18n elements immediately
  applyLang();

  const soundEffects = new SoundEffects();
  const MAX_REEL_ITEMS = 300;
  // Fixed fast scroll speed per item; total duration scales with participant count.
  const MS_PER_ITEM = 80;
  const MIN_SPIN_MS = 20000; // minimum 20 seconds total

  // Speed is fixed fast (MS_PER_ITEM). Item count = participant count, floored to fill MIN_SPIN_MS.
  const calcSpinParams = (participantCount: number): { items: number; msPerItem: number } => {
    const minItems = Math.ceil(MIN_SPIN_MS / MS_PER_ITEM); // 250 items → 20s
    const items = Math.min(Math.max(participantCount, minItems), MAX_REEL_ITEMS);
    return { items, msPerItem: MS_PER_ITEM };
  };

  let currentSpinDurationMs = MAX_REEL_ITEMS * MS_PER_ITEM;
  const CONFETTI_COLORS = [
    '#26ccff', '#a25afd', '#ff5e7e', '#88ff5a',
    '#fcff42', '#ffa62d', '#ff36ff'
  ];
  const prizeManager = new PrizeManager();
  let confettiAnimationId: number;
  let slot: Slot;

  // ── Countdown config (standalone module) ─────────────────────
  const countdownBarEl = document.getElementById('countdown-bar') as HTMLDivElement | null;
  const countdownBarTimeEl = document.getElementById('countdown-bar-time') as HTMLDivElement | null;
  const countdownToggleBtn = document.getElementById('countdown-toggle') as HTMLButtonElement | null;
  const countdownResetBtn = document.getElementById('countdown-reset') as HTMLButtonElement | null;
  const countdownCfgPrize = document.getElementById('countdown-cfg-prize') as HTMLSelectElement | null;
  const countdownCfgMins = document.getElementById('countdown-cfg-mins') as HTMLInputElement | null;
  const countdownAutoBtn = document.getElementById('countdown-auto') as HTMLButtonElement | null;

  let autoDrawEnabled = false;
  let autoDrawFired = false;

  interface CountdownConfig { prizeId: string; minutes: number; }

  const getCountdownConfig = (): CountdownConfig | null => {
    try {
      const raw = localStorage.getItem('draw-countdown-config');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const saveCountdownConfig = (cfg: CountdownConfig | null): void => {
    try {
      if (cfg) {
        localStorage.setItem('draw-countdown-config', JSON.stringify(cfg));
      } else {
        localStorage.removeItem('draw-countdown-config');
      }
    } catch (e) { /* ignore */ }
  };

  const fmtSecs = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const getCountdownSecsRemaining = (cfg: CountdownConfig): number => {
    try {
      const raw = localStorage.getItem('draw-countdown');
      if (!raw) return cfg.minutes * 60;
      const state = JSON.parse(raw);
      if (state.prizeId !== cfg.prizeId) return cfg.minutes * 60;
      if (state.running && state.startedAt) {
        const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
        return Math.max(0, state.minutes * 60 - elapsed);
      }
      if (!state.running && state.pausedRemaining !== null) return state.pausedRemaining;
    } catch { /* ignore */ }
    return cfg.minutes * 60;
  };

  const isCountdownRunning = (cfg: CountdownConfig): boolean => {
    try {
      const raw = localStorage.getItem('draw-countdown');
      if (!raw) return false;
      const state = JSON.parse(raw);
      return state.running && state.prizeId === cfg.prizeId;
    } catch { return false; }
  };

  // Toast helper — must be declared before updateCountdownBar which references it
  const showToast = (msg: string, color = 'rgba(220,60,60,0.92)') => {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);'
      + `background:${color};color:#fff;padding:0.5rem 1.2rem;border-radius:0.5rem;`
      + 'font-size:0.85rem;z-index:9999;pointer-events:none;white-space:nowrap';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  // Ticker helper — must be declared before onSpinEnd and restore section reference it
  const refreshTicker = () => {
    const tc = document.getElementById('winners-ticker__content');
    if (!tc) return;
    tc.innerHTML = '';
    prizeManager.allPrizes.forEach((prize) => {
      prize.winners.forEach((w) => {
        const item = document.createElement('span');
        item.className = 'ticker-item';
        const prizeSpan = document.createElement('span');
        prizeSpan.className = 'ticker-item__prize';
        prizeSpan.textContent = prize.name;
        const sepSpan = document.createElement('span');
        sepSpan.className = 'ticker-item__sep';
        sepSpan.textContent = '·';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = w;
        item.appendChild(prizeSpan);
        item.appendChild(sepSpan);
        item.appendChild(nameSpan);
        tc.appendChild(item);
      });
    });
  };

  const updateCountdownBar = () => {
    const cfg = getCountdownConfig();
    const p = prizeManager.currentPrize;
    if (!countdownBarEl || !cfg || !p || cfg.prizeId !== p.id) {
      if (countdownBarEl) countdownBarEl.style.display = 'none';
      return;
    }
    countdownBarEl.style.display = 'flex';
    const secs = getCountdownSecsRemaining(cfg);
    if (countdownBarTimeEl) {
      countdownBarTimeEl.textContent = fmtSecs(secs);
      countdownBarTimeEl.classList.toggle('urgent', secs <= 60 && secs > 0);
    }
    if (countdownToggleBtn) countdownToggleBtn.textContent = isCountdownRunning(cfg) ? t('countdownPauseBtn') : t('countdownStartBtn');

    // Auto draw: trigger when countdown finishes naturally
    if (secs === 0 && isCountdownRunning(cfg) && autoDrawEnabled && !autoDrawFired) {
      autoDrawFired = true;
      autoDrawEnabled = false;
      countdownAutoBtn?.classList.remove('active');
      setTimeout(() => {
        const ap = prizeManager.currentPrize;
        if (!ap || prizeManager.isCurrentPrizeFull()) {
          showToast(t('autoDrawWarnFull'));
          return;
        }
        if (!slot || !slot.names.length) {
          showToast(t('autoDrawWarnEmpty'));
          return;
        }
        const sp = calcSpinParams(slot.names.length);
        currentSpinDurationMs = sp.items * sp.msPerItem;
        slot.updateSpinParams(sp.items, sp.msPerItem);
        slot.spin();
      }, 600);
    }
    if (secs > 0) autoDrawFired = false;
  };

  setInterval(updateCountdownBar, 1000);

  countdownToggleBtn?.addEventListener('click', () => {
    const cfg = getCountdownConfig();
    if (!cfg) return;
    if (isCountdownRunning(cfg)) {
      prizeManager.pauseCountdown(getCountdownSecsRemaining(cfg));
    } else {
      try {
        const raw = localStorage.getItem('draw-countdown');
        const state = raw ? JSON.parse(raw) : null;
        const resumeFrom = (state?.prizeId === cfg.prizeId && state?.pausedRemaining !== null)
          ? state.pausedRemaining as number : undefined;
        prizeManager.startCountdown(cfg.prizeId, cfg.minutes, resumeFrom);
      } catch {
        prizeManager.startCountdown(cfg.prizeId, cfg.minutes);
      }
    }
    updateCountdownBar();
  });

  countdownResetBtn?.addEventListener('click', () => {
    const cfg = getCountdownConfig();
    if (!cfg) return;
    prizeManager.resetCountdown(cfg.prizeId, cfg.minutes);
    updateCountdownBar();
  });

  const countdownCancelBtn = document.getElementById('countdown-cancel') as HTMLButtonElement | null;
  countdownCancelBtn?.addEventListener('click', () => {
    saveCountdownConfig(null);
    prizeManager.clearCountdown();
    autoDrawEnabled = false;
    autoDrawFired = false;
    countdownAutoBtn?.classList.remove('active');
    // eslint-disable-next-line no-use-before-define
    renderPrizeButtons();
    updateCountdownBar();
  });

  countdownAutoBtn?.addEventListener('click', () => {
    autoDrawEnabled = !autoDrawEnabled;
    autoDrawFired = false;
    countdownAutoBtn.classList.toggle('active', autoDrawEnabled);
    countdownAutoBtn.title = autoDrawEnabled
      ? t('autoDrawOnTitle')
      : t('autoTitle');
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

  const updateCurrentPrizeLabel = () => {
    const p = prizeManager.currentPrize;
    currentPrizeLabel.textContent = p
      ? t('drawingLabel', { name: p.name, count: prizeManager.remainingCount() })
      : t('pleaseSelectPrize');
  };

  const updateDrawButton = () => {
    const p = prizeManager.currentPrize;
    const hasNames = slot ? slot.names.length > 0 : false;
    drawButton.disabled = !p || prizeManager.isCurrentPrizeFull() || !hasNames;
    if (!p) drawButton.title = t('pleaseSelectPrizeFirst');
    else if (prizeManager.isCurrentPrizeFull()) drawButton.title = t('allWinnersDrawn');
    else if (!hasNames) drawButton.title = t('addParticipantsFirst');
    else drawButton.title = '';
  };

  const updateParticipantCount = () => {
    const count = slot ? slot.names.length : 0;
    if (participantCountEl) participantCountEl.textContent = t('participantCount', { count });
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
      dedupeNoticeEl.textContent = t('dedupeRemoved', { count: removed });
      dedupeNoticeEl.classList.add('visible');
    } else {
      dedupeNoticeEl.textContent = '';
      dedupeNoticeEl.classList.remove('visible');
    }
  };

  // Prize buttons
  const renderPrizeButtons = () => {
    prizeButtonsContainer.innerHTML = '';
    const cfg = getCountdownConfig();
    prizeManager.allPrizes.forEach((prize) => {
      const btn = document.createElement('button');
      const isFull = prize.winners.length >= prize.count;
      const isActive = prizeManager.currentPrize?.id === prize.id;
      const hasCountdown = cfg?.prizeId === prize.id;
      btn.className = `prize-select-btn${isActive ? ' active' : ''}${isFull ? ' full' : ''}`;
      const btnName = document.createElement('span');
      btnName.className = 'prize-btn-name';
      btnName.textContent = `${prize.name}${hasCountdown ? ' ⏱' : ''}`;
      const btnMeta = document.createElement('span');
      btnMeta.className = 'prize-btn-meta';
      btnMeta.textContent = t('prizeMeta', { drawn: prize.winners.length, total: prize.count });
      btn.appendChild(btnName);
      btn.appendChild(btnMeta);
      btn.disabled = isFull;
      btn.addEventListener('click', () => {
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
      const emptyP = document.createElement('p');
      emptyP.className = 'records-empty';
      emptyP.textContent = t('noRecordsYet');
      recordsBody.appendChild(emptyP);
      return;
    }
    prizes.forEach((prize) => {
      if (!prize.winners.length) return;
      const group = document.createElement('div');
      group.className = 'records-group';
      const groupTitle = document.createElement('div');
      groupTitle.className = 'records-group-title';
      groupTitle.textContent = `${prize.name} `;
      const groupCount = document.createElement('span');
      groupCount.textContent = t('recordsGroupCount', { drawn: prize.winners.length, total: prize.count });
      groupTitle.appendChild(groupCount);
      group.appendChild(groupTitle);
      const list = document.createElement('div');
      list.className = 'records-list';
      prize.winners.forEach((w, i) => {
        const item = document.createElement('div');
        item.className = 'records-item';
        const ts = prize.winnerTimestamps?.[i] ?? '';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${i + 1}. ${w}`;
        item.appendChild(nameSpan);
        if (ts) {
          const tsSpan = document.createElement('span');
          tsSpan.className = 'records-item__ts';
          tsSpan.textContent = ts;
          item.appendChild(tsSpan);
        }
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
    setTimeout(() => URL.revokeObjectURL(url), 100);
  });

  clearRecordsButton.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(t('clearRecordsConfirm'))) return;
    prizeManager.clearRecords();
    window.location.reload();
  });

  // Custom 24-hour time picker popup (shared, appended to body)
  // eslint-disable-next-line max-len
  const buildTimePicker = (): { popup: HTMLDivElement; hourSel: HTMLSelectElement; minSel: HTMLSelectElement; okBtn: HTMLButtonElement } => {
    const popup = document.createElement('div');
    popup.className = 'drawtime-picker-popup';
    popup.style.display = 'none';

    const hourSel = document.createElement('select');
    hourSel.className = 'drawtime-sel';
    for (let h = 0; h < 24; h += 1) {
      const o = document.createElement('option');
      o.value = String(h).padStart(2, '0');
      o.textContent = String(h).padStart(2, '0');
      hourSel.appendChild(o);
    }
    const colon = document.createElement('span');
    colon.className = 'drawtime-colon';
    colon.textContent = ':';
    const minSel = document.createElement('select');
    minSel.className = 'drawtime-sel';
    for (let m = 0; m < 60; m += 1) {
      const o = document.createElement('option');
      o.value = String(m).padStart(2, '0');
      o.textContent = String(m).padStart(2, '0');
      minSel.appendChild(o);
    }
    const okBtn = document.createElement('button');
    okBtn.className = 'drawtime-ok-btn';
    okBtn.textContent = 'OK'; // universal
    popup.appendChild(hourSel);
    popup.appendChild(colon);
    popup.appendChild(minSel);
    popup.appendChild(okBtn);
    document.body.appendChild(popup);
    return {
      popup, hourSel, minSel, okBtn
    };
  };

  let activePickerClose: (() => void) | null = null;

  // Sync countdown prize select from current config rows (before Save)
  const syncCountdownSelectFromRows = () => {
    if (!countdownCfgPrize) return;
    const previousValue = countdownCfgPrize.value;
    countdownCfgPrize.innerHTML = `<option value="">${t('selectPrize')}</option>`;
    prizeConfigList.querySelectorAll<HTMLElement>('.prize-config-row').forEach((row) => {
      const rowId = row.dataset.id ?? '';
      const nameInput = row.querySelector('.pc-name') as HTMLInputElement | null;
      const rowName = nameInput?.value.trim() || 'Prize';
      if (!rowId) return;
      const opt = document.createElement('option');
      opt.value = rowId;
      opt.textContent = rowName;
      if (previousValue === rowId) opt.selected = true;
      countdownCfgPrize.appendChild(opt);
    });
  };

  // Prize config in settings

  const makePrizeRow = (id: string, name: string, count: number, drawTime: string, description = ''): HTMLDivElement => {
    const row = document.createElement('div');
    row.className = 'prize-config-row';
    row.dataset.id = id;
    row.innerHTML = `
      <input class="input-field pc-name" type="text" placeholder="${t('prizePlaceholder')}" value="${name}">
      <input class="input-field pc-count" type="number" min="1" value="${count}" style="text-align:center">
      <input class="input-field pc-drawtime" type="text" pattern="[0-2][0-9]:[0-5][0-9]"
        placeholder="HH:MM" value="${drawTime}" style="text-align:center;cursor:pointer" readonly>
      <button class="solid-button solid-button--danger pc-del" style="padding:0.4rem 0.8rem;font-size:0.875rem">✕</button>
      <input class="input-field pc-desc" type="text" placeholder="${t('prizeDescPlaceholder')}" value="${description}">
    `;
    (row.querySelector('.pc-name') as HTMLInputElement).addEventListener('input', syncCountdownSelectFromRows);

    const dtText = row.querySelector('.pc-drawtime') as HTMLInputElement;
    const {
      popup, hourSel, minSel, okBtn
    } = buildTimePicker();
    // pc-del handler placed after buildTimePicker so `popup` is already in scope
    row.querySelector('.pc-del')!.addEventListener('click', () => { popup.remove(); row.remove(); });
    const closePopup = () => { popup.style.display = 'none'; };

    popup.addEventListener('click', (e) => e.stopPropagation());

    dtText.addEventListener('click', () => {
      if (activePickerClose && activePickerClose !== closePopup) activePickerClose();
      if (popup.style.display !== 'none') { closePopup(); activePickerClose = null; return; }

      const parts = dtText.value.split(':');
      if (parts.length === 2) {
        hourSel.value = parts[0].padStart(2, '0');
        minSel.value = parts[1].padStart(2, '0');
      }

      const rect = dtText.getBoundingClientRect();
      popup.style.top = `${rect.top}px`;
      popup.style.left = 'auto';
      popup.style.right = `${window.innerWidth - rect.right}px`;
      popup.style.display = 'flex';
      activePickerClose = closePopup;
      // eslint-disable-next-line no-use-before-define
      skipPickerClose = true;
    });

    okBtn.addEventListener('click', () => {
      dtText.value = `${hourSel.value}:${minSel.value}`;
      closePopup();
      activePickerClose = null;
    });

    return row;
  };

  const renderPrizeConfig = () => {
    // Remove any previously appended time-picker popups to avoid DOM accumulation
    document.querySelectorAll('.drawtime-picker-popup').forEach((el) => el.remove());
    prizeConfigList.innerHTML = '';
    prizeManager.allPrizes.forEach((prize) => {
      prizeConfigList.appendChild(makePrizeRow(prize.id, prize.name, prize.count, prize.drawTime ?? '', prize.description ?? ''));
    });
  };

  // Sync countdown select when rows are added or removed
  new MutationObserver(syncCountdownSelectFromRows).observe(prizeConfigList, { childList: true });

  document.getElementById('reset-prizes')?.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(t('resetPrizesConfirm'))) return;
    prizeManager.setPrizes([
      { id: '1', name: '1st Prize', count: 1 },
      { id: '2', name: '2nd Prize', count: 2 },
      { id: '3', name: '3rd Prize', count: 5 }
    ]);
    window.location.reload();
  });

  document.getElementById('reset-all-defaults')?.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(t('resetAllConfirm'))) return;
    localStorage.clear();
    window.location.reload();
  });

  addPrizeRowButton.addEventListener('click', () => {
    prizeConfigList.appendChild(makePrizeRow(String(Date.now()), '', 1, ''));
  });

  // Spin callbacks
  const onSpinStart = () => {
    stopWinningAnimation();
    drawButton.disabled = true;
    settingsButton.disabled = true;
    prizeButtonsContainer.querySelectorAll<HTMLButtonElement>('.prize-select-btn').forEach((btn) => {
      // eslint-disable-next-line no-param-reassign
      btn.disabled = true;
    });
    const seed = Date.now();
    if (drawSeedEl) {
      drawSeedEl.textContent = t('seedLabel', { seed: String(seed) });
      drawSeedEl.style.opacity = '1';
    }
    try {
      localStorage.setItem('draw-last-seed', String(seed));
      localStorage.setItem('draw-recovery-names', JSON.stringify(slot.names));
      localStorage.setItem('draw-recovery-pending', '1');
    } catch (e) { /* ignore */ }
    soundEffects.spin(currentSpinDurationMs / 1000);
  };

  const onSpinEnd = async () => {
    confettiAnimation();
    sunburstSvg.style.display = 'block';

    // ── Aftermath: start glow the moment winner is revealed ───
    const slotEl = document.querySelector<HTMLElement>('.slot');
    slotEl?.classList.add('slot--aftermath');
    // ─────────────────────────────────────────────────────────

    await soundEffects.win();

    const winnerEl = document.querySelector('#reel > div:last-child');
    const rawName = winnerEl?.textContent ?? '';
    if (winnerEl && rawName) {
      prizeManager.addWinner(rawName);
      // Winner name is already revealed by Slot.ts — no re-masking here
    }

    const prizeName = prizeManager.currentPrize?.name ?? '';
    const feedList = document.getElementById('winners-feed__list');
    if (feedList && rawName) {
      const entry = document.createElement('div');
      entry.className = 'winner-entry';
      const entryPrize = document.createElement('div');
      entryPrize.className = 'winner-entry__prize';
      entryPrize.textContent = prizeName;
      const entryName = document.createElement('div');
      entryName.className = 'winner-entry__name';
      entryName.textContent = rawName;
      entry.appendChild(entryPrize);
      entry.appendChild(entryName);
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

    // Update ticker — show real winner names
    refreshTicker();

    // ── Aftermath: hold 1s linger before re-enabling UI ──────
    await new Promise<void>((resolve) => { setTimeout(resolve, 1000); });
    slotEl?.classList.remove('slot--aftermath');
    // ─────────────────────────────────────────────────────────

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
    if (mainClockDate) {
      mainClockDate.textContent = now.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    }
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
      recoveryMessage.textContent = t('recoveryBanner', { count: saved.length });
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
  const refreshCountdownCfgSelect = () => {
    if (!countdownCfgPrize) return;
    const cfg = getCountdownConfig();
    countdownCfgPrize.innerHTML = `<option value="">${t('selectPrize')}</option>`;
    prizeManager.allPrizes.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      if (cfg?.prizeId === p.id) opt.selected = true;
      countdownCfgPrize.appendChild(opt);
    });
    if (countdownCfgMins) countdownCfgMins.value = cfg ? String(cfg.minutes) : '';
  };

  // Draw title helpers (declared before onSettingsOpen to avoid no-use-before-define)
  const drawTitleDisplay = document.getElementById('draw-title-display') as HTMLElement | null;
  const drawTitleInput = document.getElementById('draw-title-input') as HTMLInputElement | null;
  const applyDrawTitle = (titleVal: string) => {
    const text = titleVal.trim();
    if (drawTitleDisplay) {
      drawTitleDisplay.textContent = text;
      // Hide center title when no custom title set; brand-tag always shows top-left
      drawTitleDisplay.style.display = text ? '' : 'none';
    }
  };
  applyDrawTitle(localStorage.getItem('draw-title') ?? '');

  const onSettingsOpen = () => {
    nameListTextArea.value = slot.names.join('\n');
    removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
    enableSoundCheckbox.checked = !soundEffects.mute;
    if (drawTitleInput) drawTitleInput.value = localStorage.getItem('draw-title') ?? '';
    renderPrizeConfig();
    refreshCountdownCfgSelect();
    settingsWrapper.style.display = 'block';
  };

  const onSettingsClose = () => {
    // Close any open time-picker popup before hiding settings
    if (activePickerClose) { activePickerClose(); activePickerClose = null; }
    settingsContent.scrollTop = 0;
    settingsWrapper.style.display = 'none';
  };

  drawButton.addEventListener('click', () => {
    if (!slot.names.length) { onSettingsOpen(); return; }
    const { currentPrize } = prizeManager;
    if (!currentPrize) return;
    const { items, msPerItem } = calcSpinParams(slot.names.length);
    currentSpinDurationMs = items * msPerItem;
    slot.updateSpinParams(items, msPerItem);
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
    const newPrizes = rows.map((row) => {
      const dt = (row.querySelector('.pc-drawtime') as HTMLInputElement).value.trim();
      const desc = (row.querySelector('.pc-desc') as HTMLInputElement).value.trim();
      return {
        id: (row as HTMLElement).dataset.id ?? String(Date.now()),
        name: (row.querySelector('.pc-name') as HTMLInputElement).value.trim() || t('prizeDefaultName'),
        count: Math.max(1, parseInt((row.querySelector('.pc-count') as HTMLInputElement).value, 10) || 1),
        ...(dt ? { drawTime: dt } : {}),
        ...(desc ? { description: desc } : {})
      };
    });
    prizeManager.setPrizes(newPrizes);

    // Save countdown config
    const cfgPrizeId = countdownCfgPrize?.value ?? '';
    const cfgMins = parseInt(countdownCfgMins?.value ?? '', 10);
    if (cfgPrizeId && cfgMins > 0) {
      saveCountdownConfig({ prizeId: cfgPrizeId, minutes: cfgMins });
      prizeManager.resetCountdown(cfgPrizeId, cfgMins);
    } else {
      saveCountdownConfig(null);
      prizeManager.clearCountdown();
    }

    // Save draw title
    const titleVal = drawTitleInput?.value ?? '';
    try { localStorage.setItem('draw-title', titleVal); } catch (e) { /* ignore */ }
    applyDrawTitle(titleVal);

    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
    updateParticipantCount();
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
        .map((line) => line.split(',').map((cell) => cell.replace(/^"|"$/g, '').trim()).filter(Boolean).join(' '))
        .filter(Boolean);
      const filtered = filterOutWinners(names);
      showDedupeNotice(names.length - filtered.length);
      nameListTextArea.value = filtered.join('\n');
      if (dedupeNoticeEl && filtered.length > 0) {
        const base = dedupeNoticeEl.textContent || '';
        dedupeNoticeEl.textContent = `${t('csvLoaded', { count: filtered.length })}${base ? `  ·  ${base}` : ''}`;
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
  refreshTicker();

  // Close time picker popup when clicking outside
  let skipPickerClose = false;
  document.addEventListener('click', () => {
    if (skipPickerClose) { skipPickerClose = false; return; }
    if (activePickerClose) { activePickerClose(); activePickerClose = null; }
  });

  document.addEventListener('firebase-sync-error', () => {
    showToast(t('firebaseError'));
  });

  // ── Name list toolbar ────────────────────────────────────────
  const namelistMaskBtn = document.getElementById('namelist-mask-btn') as HTMLButtonElement | null;
  const namelistShuffleBtn = document.getElementById('namelist-shuffle-btn') as HTMLButtonElement | null;
  const namelistMergeBtn = document.getElementById('namelist-merge-btn') as HTMLButtonElement | null;
  const namelistClearBtn = document.getElementById('namelist-clear-btn') as HTMLButtonElement | null;

  // Toggle blur mask on textarea to hide personal info visually
  namelistMaskBtn?.addEventListener('click', () => {
    const masked = nameListTextArea.classList.toggle('name-list--masked');
    namelistMaskBtn.classList.toggle('active', masked);
    namelistMaskBtn.title = masked ? t('showPersonalInfo') : t('hidePersonalInfo');
  });

  // Shuffle names randomly
  namelistShuffleBtn?.addEventListener('click', () => {
    const names = nameListTextArea.value.split('\n').filter((n) => n.trim());
    for (let i = names.length - 1; i > 0; i -= 1) {
      // eslint-disable-next-line no-bitwise
      const j = Math.random() * (i + 1) | 0;
      [names[i], names[j]] = [names[j], names[i]];
    }
    nameListTextArea.value = names.join('\n');
  });

  // Merge duplicates — keep one entry per unique name
  namelistMergeBtn?.addEventListener('click', () => {
    const names = nameListTextArea.value.split('\n').filter((n) => n.trim());
    const seen = new Set<string>();
    const merged: string[] = [];
    names.forEach((n) => {
      const key = n.trim().toLowerCase();
      if (!seen.has(key)) { seen.add(key); merged.push(n.trim()); }
    });
    const removed = names.length - merged.length;
    nameListTextArea.value = merged.join('\n');
    if (dedupeNoticeEl) {
      if (removed > 0) {
        dedupeNoticeEl.textContent = t('mergedDuplicates', { count: removed });
        dedupeNoticeEl.classList.add('visible');
      } else {
        dedupeNoticeEl.textContent = t('noDuplicatesFound');
        dedupeNoticeEl.classList.add('visible');
      }
    }
  });

  // Clear entire name list
  namelistClearBtn?.addEventListener('click', () => {
    if (!nameListTextArea.value.trim()) return;
    // eslint-disable-next-line no-alert
    if (!window.confirm(t('clearListConfirm'))) return;
    nameListTextArea.value = '';
    if (dedupeNoticeEl) { dedupeNoticeEl.textContent = ''; dedupeNoticeEl.classList.remove('visible'); }
  });

  // Language switcher
  const langSelect = document.getElementById('lang-select') as HTMLSelectElement | null;
  if (langSelect) {
    langSelect.value = (localStorage.getItem('app-lang') as Lang | null) ?? 'en';
    langSelect.addEventListener('change', () => {
      const lang = langSelect.value as Lang;
      setLang(lang);
      applyLang();
      // Re-render all dynamic content in new language
      renderPrizeButtons();
      updateCurrentPrizeLabel();
      updateDrawButton();
      updateParticipantCount();
      updateCountdownBar();
      refreshTicker();
      if (recordsPanel.style.display !== 'none') renderRecords();
      if (settingsWrapper.style.display !== 'none') {
        renderPrizeConfig();
        refreshCountdownCfgSelect();
      }
    });
  }

  // Warn before closing/refreshing
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
  });
})();
