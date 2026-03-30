import confetti from 'canvas-confetti';
import Slot from '@js/Slot';
import SoundEffects from '@js/SoundEffects';
import PrizeManager from '@js/PrizeManager';

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
      return part.slice(0, keep) + '***';
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
        prizeManager.selectPrize(prize.id);
        renderPrizeButtons();
        updateCurrentPrizeLabel();
        updateDrawButton();
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
        item.textContent = `${i + 1}. ${w}`;
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
  const renderPrizeConfig = () => {
    prizeConfigList.innerHTML = '';
    prizeManager.allPrizes.forEach((prize) => {
      const row = document.createElement('div');
      row.className = 'prize-config-row';
      row.dataset.id = prize.id;
      row.innerHTML = `
        <input class="input-field pc-name" type="text"
          placeholder="Prize name" value="${prize.name}">
        <input class="input-field pc-count" type="number"
          min="1" value="${prize.count}" style="width:80px;text-align:center">
        <button class="solid-button solid-button--danger pc-del"
          style="padding:0.4rem 0.8rem;font-size:0.875rem">Delete</button>
      `;
      row.querySelector('.pc-del')!.addEventListener('click', () => row.remove());
      prizeConfigList.appendChild(row);
    });
  };

  addPrizeRowButton.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'prize-config-row';
    row.dataset.id = String(Date.now());
    row.innerHTML = `
      <input class="input-field pc-name" type="text"
        placeholder="Prize name" value="">
      <input class="input-field pc-count" type="number"
        min="1" value="1" style="width:80px;text-align:center">
      <button class="solid-button solid-button--danger pc-del"
        style="padding:0.4rem 0.8rem;font-size:0.875rem">Delete</button>
    `;
    row.querySelector('.pc-del')!.addEventListener('click', () => row.remove());
    prizeConfigList.appendChild(row);
  });

  // Spin callbacks
  const onSpinStart = () => {
    stopWinningAnimation();
    drawButton.disabled = true;
    settingsButton.disabled = true;
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
            + `<span class="ticker-item__sep">·</span>`
            + `<span>${maskName(w)}</span>`;
          tickerContent.appendChild(item);
        });
      });
    }
    
    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
    settingsButton.disabled = false;
  };

     // Slot instance
  slot = new Slot({
    reelContainerSelector: '#reel',
    maxReelItems: MAX_REEL_ITEMS,
    onSpinStart,
    onSpinEnd,
    onNameListChanged: stopWinningAnimation
  });
  updateDrawButton();

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
    slot.names = nameListTextArea.value
      ? nameListTextArea.value.split(/\n/).filter((n) => Boolean(n.trim()))
      : [];
    slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
    soundEffects.mute = !enableSoundCheckbox.checked;
    const rows = Array.from(prizeConfigList.querySelectorAll('.prize-config-row'));
    const newPrizes = rows.map((row) => ({
      id: (row as HTMLElement).dataset.id ?? String(Date.now()),
      name: (row.querySelector('.pc-name') as HTMLInputElement).value.trim() || 'Prize',
      count: parseInt((row.querySelector('.pc-count') as HTMLInputElement).value, 10) || 1
    }));
    prizeManager.setPrizes(newPrizes);
    renderPrizeButtons();
    updateCurrentPrizeLabel();
    updateDrawButton();
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
      nameListTextArea.value = names.join('\n');
    };
    reader.readAsText(file, 'UTF-8');
    csvUpload.value = '';
  });

// Init
  renderPrizeButtons();
  updateCurrentPrizeLabel();
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

  // Warn before closing
  window.addEventListener('beforeunload', (e) => {
    const total = prizeManager.allPrizes.reduce((sum, p) => sum + p.winners.length, 0);
    if (total > 0) {
      e.preventDefault();
    }
  });
})();