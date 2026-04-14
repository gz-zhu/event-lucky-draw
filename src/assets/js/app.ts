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
  const langButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lang]'));
  const settingsTabButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-settings-tab]')
  );
  const settingsTabPanels = Array.from(
    document.querySelectorAll<HTMLElement>('[data-settings-panel]')
  );
  const sunburstSvg = document.getElementById('sunburst') as HTMLImageElement | null;
  const confettiCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
  const nameListTextArea = document.getElementById('name-list') as HTMLTextAreaElement | null;
  const removeNameFromListCheckbox = document.getElementById('remove-from-list') as HTMLInputElement | null;
  const enableSoundCheckbox = document.getElementById('enable-sound') as HTMLInputElement | null;
  const prizeButtonsContainer = document.getElementById('prize-buttons') as HTMLDivElement | null;
  const currentPrizeLabel = document.getElementById('current-prize-label') as HTMLDivElement | null;
  const currentPrizeInfoEl = document.getElementById('current-prize-info') as HTMLDivElement | null;
  const currentPrizeNameEl = document.getElementById('current-prize-name') as HTMLSpanElement | null;
  const currentPrizePoolEl = document.getElementById('current-prize-pool') as HTMLSpanElement | null;
  const currentPrizeSlotsEl = document.getElementById('current-prize-slots') as HTMLSpanElement | null;
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
  const nameListRawCountEl = document.getElementById('name-list-raw-count') as HTMLSpanElement | null;
  const nameListPoolCountEl = document.getElementById('name-list-pool-count') as HTMLSpanElement | null;
  const nameListDuplicateCountEl = document.getElementById('name-list-duplicate-count') as HTMLSpanElement | null;
  const nameListWinnerRemovedCountEl = document.getElementById('name-list-winner-removed-count') as HTMLSpanElement | null;
  const spinDurationRange = document.getElementById('spin-duration-range') as HTMLInputElement | null;
  const spinDurationValueEl = document.getElementById('spin-duration-value') as HTMLSpanElement | null;

  if (!(
    drawButton && fullscreenButton && settingsButton
    && settingsWrapper && settingsContent && settingsSaveButton
    && settingsCloseButton && sunburstSvg && confettiCanvas
    && nameListTextArea && removeNameFromListCheckbox && enableSoundCheckbox
    && prizeButtonsContainer
    && recordsPanel && recordsToggle && recordsClose && recordsBody
    && exportCsvButton && clearRecordsButton
    && prizeConfigList && addPrizeRowButton
    && spinDurationRange && spinDurationValueEl
  )) {
    console.error('One or more Element ID is invalid.');
    return;
  }

  // Apply saved language to all data-i18n elements immediately
  applyLang();

  const soundEffects = new SoundEffects();
  const MAX_REEL_ITEMS = 300;
  const MIN_REEL_ITEMS = 40;
  const DEFAULT_SPIN_DURATION_SEC = 20;
  const SPIN_DURATION_STEP_SEC = 5;
  const SPIN_DURATION_STORAGE_KEY = 'draw-spin-duration-sec';

  const normalizeSpinDurationSec = (value: number): number => {
    const safeValue = Number.isFinite(value) ? value : DEFAULT_SPIN_DURATION_SEC;
    return Math.min(
      60,
      Math.max(
        SPIN_DURATION_STEP_SEC,
        Math.round(safeValue / SPIN_DURATION_STEP_SEC) * SPIN_DURATION_STEP_SEC
      )
    );
  };

  const getSpinDurationSec = (): number => {
    try {
      const raw = parseInt(localStorage.getItem(SPIN_DURATION_STORAGE_KEY) ?? '', 10);
      if (!Number.isFinite(raw)) return DEFAULT_SPIN_DURATION_SEC;
      return normalizeSpinDurationSec(raw);
    } catch {
      return DEFAULT_SPIN_DURATION_SEC;
    }
  };

  const saveSpinDurationSec = (value: number): void => {
    try {
      localStorage.setItem(SPIN_DURATION_STORAGE_KEY, String(normalizeSpinDurationSec(value)));
    } catch (e) { /* ignore */ }
  };

  const syncSpinDurationUi = (value: number): void => {
    const normalized = normalizeSpinDurationSec(value);
    spinDurationRange.value = String(normalized);
    spinDurationValueEl.textContent = String(normalized);
  };

  // Duration is user-controlled. Item count scales with participants, while per-item speed adapts.
  const calcSpinParams = (participantCount: number): { items: number; msPerItem: number } => {
    const durationSec = getSpinDurationSec();
    const items = Math.min(Math.max(participantCount, MIN_REEL_ITEMS), MAX_REEL_ITEMS);
    return { items, msPerItem: (durationSec * 1000) / items };
  };

  let currentSpinDurationMs = getSpinDurationSec() * 1000;
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
  const countdownBarProgressEl = document.getElementById('countdown-bar-progress') as HTMLDivElement | null;
  const countdownToggleBtn = document.getElementById('countdown-toggle') as HTMLButtonElement | null;
  const countdownResetBtn = document.getElementById('countdown-reset') as HTMLButtonElement | null;
  const countdownSecondsInput = document.getElementById('countdown-seconds') as HTMLInputElement | null;
  const countdownAutoBtn = document.getElementById('countdown-auto') as HTMLInputElement | null;

  let autoDrawEnabled = false;
  let autoDrawFired = false;
  let spinInProgress = false;
  const NAME_LIST_STORAGE_KEY = 'draw-name-list';
  const NAME_LIST_DRAFT_STORAGE_KEY = 'draw-name-list-draft';
  const COUNTDOWN_PRESET_STORAGE_KEY = 'draw-countdown-secs-by-prize';

  interface CountdownConfig { prizeId: string; minutes: number; }
  interface CountdownPresetMap { [prizeId: string]: number; }

  const getCountdownConfig = (): CountdownConfig | null => {
    try {
      const raw = localStorage.getItem('draw-countdown');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.prizeId || !Number.isFinite(parsed?.minutes)) return null;
      return { prizeId: parsed.prizeId, minutes: parsed.minutes };
    } catch {
      return null;
    }
  };

  const fmtSecs = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const normalizeCountdownSecs = (value: number): number => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return Math.min(3600, Math.max(0, Math.round(safeValue)));
  };
  const getCountdownPresetMap = (): CountdownPresetMap => {
    try {
      const raw = localStorage.getItem(COUNTDOWN_PRESET_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== 'object') return {};
      return Object.entries(parsed).reduce<CountdownPresetMap>((acc, [prizeId, secs]) => {
        acc[prizeId] = normalizeCountdownSecs(Number(secs));
        return acc;
      }, {});
    } catch {
      return {};
    }
  };

  const saveCountdownPresetMap = (map: CountdownPresetMap): void => {
    try {
      localStorage.setItem(COUNTDOWN_PRESET_STORAGE_KEY, JSON.stringify(map));
    } catch (e) { /* ignore */ }
  };

  const getCountdownPresetSecs = (prizeId?: string | null): number => {
    if (!prizeId) return 0;
    return normalizeCountdownSecs(getCountdownPresetMap()[prizeId] ?? 0);
  };

  const setCountdownPresetSecs = (prizeId: string, secs: number): void => {
    const map = getCountdownPresetMap();
    const normalizedSecs = normalizeCountdownSecs(secs);
    if (normalizedSecs > 0) {
      map[prizeId] = normalizedSecs;
    } else {
      delete map[prizeId];
    }
    saveCountdownPresetMap(map);
  };

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

  const getRunningCountdownPrizeId = (): string | null => {
    try {
      const raw = localStorage.getItem('draw-countdown');
      if (!raw) return null;
      const state = JSON.parse(raw);
      return state.running ? state.prizeId ?? null : null;
    } catch {
      return null;
    }
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

  const loadStoredNames = (key: string): string[] => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : [];
    } catch {
      return [];
    }
  };

  const saveStoredNames = (key: string, names: string[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(names));
    } catch (e) { /* ignore */ }
  };

  const saveNameDraft = (text: string): void => {
    const names = text.split(/\n/).map((n) => n.trim()).filter(Boolean);
    saveStoredNames(NAME_LIST_DRAFT_STORAGE_KEY, names);
  };

  type SettingsTabId = 'name-list' | 'prize-settings' | 'general';

  const setActiveSettingsTab = (tabId: SettingsTabId): void => {
    settingsTabButtons.forEach((buttonRef) => {
      const button = buttonRef;
      const isActive = button.dataset.settingsTab === tabId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.tabIndex = isActive ? 0 : -1;
    });

    settingsTabPanels.forEach((panelRef) => {
      const panel = panelRef;
      const isActive = panel.dataset.settingsPanel === tabId;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  };

  function syncCountdownAutoUi(): void {
    if (!countdownAutoBtn) return;
    countdownAutoBtn.checked = autoDrawEnabled;
    countdownAutoBtn.title = autoDrawEnabled
      ? t('autoDrawOnTitle')
      : t('autoTitle');
  }

  const syncCountdownInputForPrize = (): number => {
    const { currentPrize } = prizeManager;
    const secs = getCountdownPresetSecs(currentPrize?.id);
    if (countdownSecondsInput) countdownSecondsInput.value = String(secs);
    return secs;
  };

  const applyHomepageCountdownConfig = (secs: number): void => {
    const { currentPrize } = prizeManager;
    if (!currentPrize) return;
    const normalizedSecs = normalizeCountdownSecs(secs);
    setCountdownPresetSecs(currentPrize.id, normalizedSecs);
    prizeManager.clearCountdown();
    autoDrawFired = false;
    if (normalizedSecs > 0) {
      prizeManager.resetCountdown(currentPrize.id, normalizedSecs / 60);
    }
  };

  function clearCountdownForPrize(prizeId: string, resetPreset = true): void {
    prizeManager.clearCountdown();
    autoDrawEnabled = false;
    autoDrawFired = false;
    syncCountdownAutoUi();
    if (resetPreset) {
      setCountdownPresetSecs(prizeId, 0);
    }
    if (prizeManager.currentPrize?.id === prizeId && countdownSecondsInput) {
      countdownSecondsInput.value = '0';
    }
  }

  function syncControlLocks(): void {
    const runningPrizeId = getRunningCountdownPrizeId();
    const countdownLocked = Boolean(runningPrizeId);
    settingsButton!.disabled = spinInProgress || countdownLocked;

    prizeButtonsContainer!.querySelectorAll<HTMLButtonElement>('.prize-select-btn').forEach((btn) => {
      const prizeId = btn.dataset.prizeId ?? '';
      const shouldLockForCountdown = countdownLocked && prizeId !== runningPrizeId;
      // eslint-disable-next-line no-param-reassign
      btn.disabled = spinInProgress || shouldLockForCountdown || btn.classList.contains('full');
    });
  }

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
  let refreshCountdownUi = (): void => {};

  const stopWinningAnimation = () => {
    if (confettiAnimationId) window.cancelAnimationFrame(confettiAnimationId);
    sunburstSvg.style.display = 'none';
  };

  const updateCurrentPrizeLabel = () => {
    if (currentPrizeLabel) currentPrizeLabel.style.display = 'none';
    const { currentPrize } = prizeManager;
    if (!currentPrizeInfoEl) return;
    if (!currentPrize) {
      currentPrizeInfoEl.style.display = 'none';
      return;
    }

    const remainingSlots = Math.max(0, currentPrize.count - currentPrize.winners.length);
    if (currentPrizeNameEl) currentPrizeNameEl.textContent = currentPrize.name;
    if (currentPrizePoolEl) currentPrizePoolEl.textContent = String(slot ? slot.names.length : 0);
    if (currentPrizeSlotsEl) currentPrizeSlotsEl.textContent = String(remainingSlots);
    currentPrizeInfoEl.style.display = 'flex';
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

  const renderPrizeButtons = (): void => {
    prizeButtonsContainer.innerHTML = '';
    const cfg = getCountdownConfig();
    prizeManager.allPrizes.forEach((prize) => {
      const btn = document.createElement('button');
      const isFull = prize.winners.length >= prize.count;
      const isActive = prizeManager.currentPrize?.id === prize.id;
      const hasCountdown = getCountdownPresetSecs(prize.id) > 0 || cfg?.prizeId === prize.id;
      btn.dataset.prizeId = prize.id;
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
        syncCountdownInputForPrize();
        updateDrawButton();
        refreshCountdownUi();
        stopWinningAnimation();
      });
      prizeButtonsContainer.appendChild(btn);
    });
    syncControlLocks();
  };

  const updateCountdownBar = () => {
    const p = prizeManager.currentPrize;
    const cfg = getCountdownConfig();
    if (!countdownBarEl || !p) {
      if (countdownBarEl) countdownBarEl.style.display = 'none';
      return;
    }
    countdownBarEl.style.display = 'flex';
    const secsInput = syncCountdownInputForPrize();
    const activeCfg = cfg && cfg.prizeId === p.id ? cfg : null;
    const totalSecs = activeCfg
      ? normalizeCountdownSecs(Math.round(activeCfg.minutes * 60))
      : secsInput;
    const secs = activeCfg ? getCountdownSecsRemaining(activeCfg) : totalSecs;
    const countdownRunning = activeCfg ? isCountdownRunning(activeCfg) : false;
    const shouldCleanup = Boolean(activeCfg && secs === 0);
    const autoWasEnabled = autoDrawEnabled;

    if (countdownBarTimeEl) {
      countdownBarTimeEl.textContent = fmtSecs(secs);
      countdownBarTimeEl.classList.toggle('urgent', secs <= 60 && secs > 0);
    }
    if (countdownBarProgressEl) {
      const progress = totalSecs > 0 ? Math.max(0, Math.min(100, (secs / totalSecs) * 100)) : 0;
      countdownBarProgressEl.style.width = `${progress}%`;
    }
    if (countdownToggleBtn) countdownToggleBtn.textContent = countdownRunning ? t('countdownPauseBtn') : t('countdownStartBtn');
    if (countdownSecondsInput) countdownSecondsInput.disabled = countdownRunning;
    countdownBarEl.classList.toggle('is-running', countdownRunning);
    countdownBarEl.classList.toggle('is-idle', !countdownRunning);

    if (shouldCleanup) {
      clearCountdownForPrize(p.id);
      renderPrizeButtons();

      if (countdownRunning && autoWasEnabled && !autoDrawFired) {
        autoDrawFired = true;
        setTimeout(() => {
          const ap = prizeManager.currentPrize;
          if (!ap || prizeManager.isCurrentPrizeFull()) {
            showToast(t('autoDrawWarnFull'));
            updateCountdownBar();
            return;
          }
          if (!slot || !slot.names.length) {
            showToast(t('autoDrawWarnEmpty'));
            updateCountdownBar();
            return;
          }
          const sp = calcSpinParams(slot.names.length);
          currentSpinDurationMs = sp.items * sp.msPerItem;
          slot.updateSpinParams(sp.items, sp.msPerItem);
          slot.spin();
        }, 450);
      } else {
        autoDrawFired = false;
      }

      if (countdownBarTimeEl) countdownBarTimeEl.textContent = '00:00';
      if (countdownBarProgressEl) countdownBarProgressEl.style.width = '0%';
      if (countdownToggleBtn) countdownToggleBtn.textContent = t('countdownStartBtn');
      if (countdownSecondsInput) countdownSecondsInput.disabled = false;
      countdownBarEl.classList.remove('is-running');
      countdownBarEl.classList.add('is-idle');
      syncControlLocks();
      return;
    }

    if (secs > 0) autoDrawFired = false;
  };
  refreshCountdownUi = updateCountdownBar;

  setInterval(updateCountdownBar, 1000);

  countdownToggleBtn?.addEventListener('click', () => {
    const { currentPrize } = prizeManager;
    if (!currentPrize) return;

    const secs = normalizeCountdownSecs(parseInt(countdownSecondsInput?.value ?? '0', 10));
    let cfg = getCountdownConfig();
    const currentCfg = cfg && cfg.prizeId === currentPrize.id ? cfg : null;

    if (currentCfg && isCountdownRunning(currentCfg)) {
      prizeManager.pauseCountdown(getCountdownSecsRemaining(currentCfg));
    } else {
      if (secs <= 0) {
        showToast(t('countdownSetSecondsFirst'));
        return;
      }
      if (!currentCfg) {
        applyHomepageCountdownConfig(secs);
        cfg = getCountdownConfig();
        if (!cfg || cfg.prizeId !== currentPrize.id) return;
      } else {
        cfg = currentCfg;
      }
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
    syncControlLocks();
  });

  countdownResetBtn?.addEventListener('click', () => {
    const { currentPrize } = prizeManager;
    if (!currentPrize) return;
    clearCountdownForPrize(currentPrize.id);
    renderPrizeButtons();
    updateCountdownBar();
    syncControlLocks();
  });

  const countdownCancelBtn = document.getElementById('countdown-cancel') as HTMLButtonElement | null;
  countdownCancelBtn?.addEventListener('click', () => {
    const { currentPrize } = prizeManager;
    if (!currentPrize) return;
    clearCountdownForPrize(currentPrize.id);
    renderPrizeButtons();
    updateCountdownBar();
    syncControlLocks();
  });

  countdownSecondsInput?.addEventListener('change', () => {
    const secs = normalizeCountdownSecs(parseInt(countdownSecondsInput.value, 10));
    countdownSecondsInput.value = String(secs);
    const { currentPrize } = prizeManager;
    if (!currentPrize) return;
    const cfg = getCountdownConfig();
    if (cfg?.prizeId === currentPrize.id && isCountdownRunning(cfg)) return;
    applyHomepageCountdownConfig(secs);
    updateCountdownBar();
    renderPrizeButtons();
  });

  countdownAutoBtn?.addEventListener('change', () => {
    autoDrawEnabled = countdownAutoBtn.checked;
    autoDrawFired = false;
    syncCountdownAutoUi();
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

  const getNameListStats = (text: string): {
    rawCount: number;
    uniqueCount: number;
    duplicateCount: number;
    winnerRemovedCount: number;
    poolCount: number;
  } => {
    const rawNames = text.split(/\n/).map((n) => n.trim()).filter(Boolean);
    const uniqueKeys = new Set<string>();
    rawNames.forEach((name) => uniqueKeys.add(name.toLowerCase()));
    const filtered = filterOutWinners(rawNames);
    return {
      rawCount: rawNames.length,
      uniqueCount: uniqueKeys.size,
      duplicateCount: rawNames.length - uniqueKeys.size,
      winnerRemovedCount: rawNames.length - filtered.length,
      poolCount: filtered.length
    };
  };

  const updateNameListStats = (text: string): void => {
    const stats = getNameListStats(text);
    if (nameListRawCountEl) nameListRawCountEl.textContent = String(stats.rawCount);
    if (nameListPoolCountEl) nameListPoolCountEl.textContent = String(stats.poolCount);
    if (nameListDuplicateCountEl) {
      nameListDuplicateCountEl.textContent = String(stats.duplicateCount);
    }
    if (nameListWinnerRemovedCountEl) {
      nameListWinnerRemovedCountEl.textContent = String(stats.winnerRemovedCount);
    }
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

  // Prize config in settings

  function refreshPrizeCardOrder(): void {
    if (!prizeConfigList) return;
    Array.from(prizeConfigList.querySelectorAll<HTMLElement>('.prize-config-row')).forEach((row, index) => {
      const title = row.querySelector<HTMLElement>('.prize-config-card__index');
      if (title) title.textContent = `${t('prizeDefaultName')} ${index + 1}`;
    });
  }

  const makePrizeRow = (id: string, name: string, count: number, drawTime: string, description = ''): HTMLDivElement => {
    const row = document.createElement('div');
    row.className = 'prize-config-row';
    row.dataset.id = id;
    row.innerHTML = `
      <div class="prize-config-card__header">
        <div class="prize-config-card__index">${t('prizeDefaultName')}</div>
        <button class="pc-del prize-config-card__delete" type="button" aria-label="Delete prize">✕</button>
      </div>
      <div class="prize-config-card__grid">
        <label class="prize-config-card__field">
          <span class="prize-config-card__label">${t('prizeHeaderName')}</span>
          <input class="input-field pc-name" type="text" placeholder="${t('prizePlaceholder')}" value="${name}">
        </label>
        <label class="prize-config-card__field">
          <span class="prize-config-card__label">${t('prizeHeaderCount')}</span>
          <input class="input-field pc-count" type="number" min="1" value="${count}" style="text-align:center">
        </label>
        <label class="prize-config-card__field">
          <span class="prize-config-card__label">${t('prizeHeaderDrawTime')}</span>
          <input class="input-field pc-drawtime" type="text" pattern="[0-2][0-9]:[0-5][0-9]"
            placeholder="HH:MM" value="${drawTime}" style="text-align:center;cursor:pointer" readonly>
        </label>
        <label class="prize-config-card__field prize-config-card__field--full">
          <span class="prize-config-card__label">${t('prizeDescLabel')}</span>
          <input class="input-field pc-desc" type="text" placeholder="${t('prizeDescPlaceholder')}" value="${description}">
        </label>
      </div>
    `;
    const dtText = row.querySelector('.pc-drawtime') as HTMLInputElement;
    const {
      popup, hourSel, minSel, okBtn
    } = buildTimePicker();
    // pc-del handler placed after buildTimePicker so `popup` is already in scope
    row.querySelector('.pc-del')!.addEventListener('click', () => {
      popup.remove();
      row.remove();
      refreshPrizeCardOrder();
    });
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
    refreshPrizeCardOrder();
  };

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
    refreshPrizeCardOrder();
  });

  // Spin callbacks
  const onSpinStart = () => {
    spinInProgress = true;
    stopWinningAnimation();
    drawButton.disabled = true;
    syncControlLocks();
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

    // ── Aftermath: hold 1.5s linger before re-enabling UI ────
    await new Promise<void>((resolve) => { setTimeout(resolve, 1500); });
    slotEl?.classList.remove('slot--aftermath');
    // ─────────────────────────────────────────────────────────

    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
    updateParticipantCount();
    try { localStorage.removeItem('draw-recovery-pending'); localStorage.removeItem('draw-recovery-names'); } catch (e) { /* ignore */ }
    spinInProgress = false;
    syncControlLocks();
  };

  // Slot instance
  slot = new Slot({
    reelContainerSelector: '#reel',
    maxReelItems: MAX_REEL_ITEMS,
    onSpinStart,
    onSpinEnd,
    onNameListChanged: () => {
      stopWinningAnimation();
      saveStoredNames(NAME_LIST_STORAGE_KEY, slot.names);
      updateParticipantCount();
    }
  });
  const persistedNames = loadStoredNames(NAME_LIST_STORAGE_KEY);
  if (persistedNames.length) {
    slot.names = persistedNames;
  }
  updateDrawButton();
  updateParticipantCount();
  syncControlLocks();

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
      saveStoredNames(NAME_LIST_DRAFT_STORAGE_KEY, names);
      updateParticipantCount();
      updateDrawButton();
      clearRecovery();
    });
    recoveryDismiss?.addEventListener('click', clearRecovery);
  }

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
  syncSpinDurationUi(getSpinDurationSec());

  const onSettingsOpen = (tabId: SettingsTabId = 'name-list') => {
    const draftNames = loadStoredNames(NAME_LIST_DRAFT_STORAGE_KEY);
    nameListTextArea.value = (draftNames.length ? draftNames : slot.names).join('\n');
    updateNameListStats(nameListTextArea.value);
    removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
    enableSoundCheckbox.checked = !soundEffects.mute;
    syncSpinDurationUi(getSpinDurationSec());
    if (drawTitleInput) drawTitleInput.value = localStorage.getItem('draw-title') ?? '';
    renderPrizeConfig();
    setActiveSettingsTab(tabId);
    settingsContent.scrollTop = 0;
    settingsWrapper.style.display = 'flex';
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

  settingsTabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.settingsTab as SettingsTabId | undefined;
      if (tabId) setActiveSettingsTab(tabId);
    });
  });

  settingsButton.addEventListener('click', () => onSettingsOpen('name-list'));

  spinDurationRange.addEventListener('input', () => {
    syncSpinDurationUi(parseInt(spinDurationRange.value, 10) || DEFAULT_SPIN_DURATION_SEC);
  });

  nameListTextArea.addEventListener('input', () => {
    saveNameDraft(nameListTextArea.value);
    updateNameListStats(nameListTextArea.value);
  });

  settingsSaveButton.addEventListener('click', () => {
    const rawNames = nameListTextArea.value
      ? nameListTextArea.value.split(/\n/).filter((n) => Boolean(n.trim()))
      : [];
    const filtered = filterOutWinners(rawNames);
    showDedupeNotice(rawNames.length - filtered.length);
    slot.names = filtered;
    saveStoredNames(NAME_LIST_DRAFT_STORAGE_KEY, filtered);
    slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
    soundEffects.mute = !enableSoundCheckbox.checked;
    saveSpinDurationSec(parseInt(spinDurationRange.value, 10) || DEFAULT_SPIN_DURATION_SEC);
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

    // Save draw title
    const titleVal = drawTitleInput?.value ?? '';
    try { localStorage.setItem('draw-title', titleVal); } catch (e) { /* ignore */ }
    applyDrawTitle(titleVal);

    renderPrizeButtons();
    updateCurrentPrizeLabel();
    syncCountdownInputForPrize();
    updateDrawButton();
    updateParticipantCount();
    updateCountdownBar();
    onSettingsClose();
  });

  settingsCloseButton.addEventListener('click', onSettingsClose);
  document.getElementById('settings-close-x')?.addEventListener('click', onSettingsClose);
  settingsWrapper.addEventListener('click', (event) => {
    if (event.target === settingsWrapper) onSettingsClose();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && settingsWrapper.style.display !== 'none') {
      onSettingsClose();
    }
  });
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
      saveStoredNames(NAME_LIST_DRAFT_STORAGE_KEY, filtered);
      updateNameListStats(nameListTextArea.value);
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
  syncCountdownInputForPrize();
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
    updateNameListStats(nameListTextArea.value);
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
    updateNameListStats(nameListTextArea.value);
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
    updateNameListStats(nameListTextArea.value);
    if (dedupeNoticeEl) { dedupeNoticeEl.textContent = ''; dedupeNoticeEl.classList.remove('visible'); }
  });

  // Language switcher
  const applyLangSwitcherState = (lang: Lang): void => {
    langButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === lang);
    });
  };

  const rerenderForLanguage = () => {
    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
    updateParticipantCount();
    updateCountdownBar();
    syncCountdownAutoUi();
    refreshTicker();
    if (recordsPanel.style.display !== 'none') renderRecords();
    if (settingsWrapper.style.display !== 'none') {
      renderPrizeConfig();
    }
  };

  const initialLang = (localStorage.getItem('app-lang') as Lang | null) ?? 'en';
  applyLangSwitcherState(initialLang);
  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = (button.dataset.lang as Lang | undefined) ?? 'en';
      setLang(lang);
      applyLang();
      applyLangSwitcherState(lang);
      rerenderForLanguage();
    });
  });

  // Warn before closing/refreshing
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
  });
})();
