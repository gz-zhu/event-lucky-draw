export type Lang = 'en' | 'zh' | 'ja';

const LANG_KEY = 'app-lang';

type Dict = Record<string, string>;

const dict: Record<Lang, Dict> = {
  en: {
    // ── Static UI ──────────────────────────────────────────────
    recordsTitle: 'Records',
    displayLink: '📺 Display',
    tickerLabel: '🏆 WINNERS',
    restoreBtn: 'Restore',
    dismissBtn: 'Dismiss',
    pleaseSelectPrize: 'Please select a prize',
    countdownStartBtn: 'Start',
    countdownResetBtn: 'Reset',
    countdownCancelBtn: 'Cancel',
    autoBtn: 'Auto',
    autoTitle: 'Auto draw when countdown ends',
    drawBtn: 'Draw',
    exportCsvBtn: 'Export CSV',
    clearRecordsBtn: 'Clear',
    settingsTitle: 'Settings',
    resetAllBtn: 'Reset All',
    drawTitleLabel: 'Draw Title',
    drawTitlePlaceholder: 'e.g. Annual Dinner 2026',
    nameListLabel: 'Name List',
    uploadCsvBtn: 'Upload CSV',
    maskBtnTitle: 'Hide personal info',
    shuffleBtnTitle: 'Random sort',
    mergeBtnTitle: 'Merge duplicates',
    clearListBtnTitle: 'Clear list',
    nameListPlaceholder: 'One name per line (supports 10,000+ participants).\nFor CSV: one row = one participant. If a row has multiple columns, they are merged into one name.',
    removeWinnerLabel: 'Remove winner from list',
    enableSoundLabel: 'Enable sound effect',
    prizeSettingsLabel: 'Prize Settings',
    resetPrizesBtn: 'Reset Prize Settings',
    prizeHeaderName: 'Name',
    prizeHeaderCount: 'Count',
    prizeHeaderDrawTime: 'Draw Time',
    addPrizeBtn: '+ Add Prize',
    countdownLabel: '⏱ Countdown Timer',
    countdownHint: 'Select a prize and set a duration. Staff will see a Start / Pause / Reset bar on the main screen when that prize is active.',
    selectPrize: '— Select prize —',
    countdownUnit: 'min',
    countdownClearHint: 'Leave prize blank to disable the countdown.',
    saveBtn: 'Save',
    discardBtn: 'Discard and close',
    recordsHeading: 'Records',
    // ── Dynamic strings ────────────────────────────────────────
    countdownPauseBtn: 'Pause',
    autoDrawOnTitle: 'Auto draw ON — will draw when countdown ends',
    autoDrawWarnFull: '⚠ Auto draw: prize is full or not selected',
    autoDrawWarnEmpty: '⚠ Auto draw: no participants in pool',
    drawingLabel: 'Drawing: {{name}} ({{count}} remaining)',
    pleaseSelectPrizeFirst: 'Please select a prize first',
    allWinnersDrawn: 'All winners for this prize have been drawn',
    addParticipantsFirst: 'Add participants in Settings first',
    participantCount: '{{count}} participants in pool',
    dedupeRemoved: '⚠ {{count}} duplicate winner(s) removed from list',
    prizeMeta: '{{drawn}}/{{total}} ppl',
    recordsGroupCount: '{{drawn}}/{{total}} winners',
    noRecordsYet: 'No records yet',
    clearRecordsConfirm: 'Clear all records? This cannot be undone.',
    resetPrizesConfirm: 'Reset prize settings to default? All prize settings and records will be lost.',
    resetAllConfirm: 'Reset ALL settings to default? This will clear the draw title, name list, prize settings, records, and all saved data.',
    recoveryBanner: '⚠ Draw was interrupted. Restore {{count}} names to pool?',
    csvLoaded: '✓ Loaded {{count}} names from CSV',
    firebaseError: '⚠ Firebase sync failed — data saved locally only',
    showPersonalInfo: 'Show personal info',
    hidePersonalInfo: 'Hide personal info',
    mergedDuplicates: '✓ Merged: {{count}} duplicate(s) removed',
    noDuplicatesFound: '✓ No duplicates found',
    clearListConfirm: 'Clear the entire name list?',
    seedLabel: 'SEED · {{seed}}',
    prizePlaceholder: 'Prize name',
    prizeDescPlaceholder: 'Prize item description (optional)',
    prizeDefaultName: 'Prize',
    // ── Display page strings ───────────────────────────────────
    displayParticipants: 'Participants',
    displayWinners: 'Winners',
    displayRemaining: 'Remaining',
    displayPrizes: 'Prizes',
    displayDone: '✓ Done',
    displayUpcoming: 'Upcoming',
    displaySpotsRemaining: 'spots\nremaining',
    displayNoWinnersYet: 'No winners yet',
    displayCountdown: '⏱ COUNTDOWN',
    displayPaused: '⏸ PAUSED',
    displayReady: '⏱ READY',
    displayTimesUp: '🎉 TIME\'S UP!',
    displayTickerLabel: '🏆 WINNERS',
    displaySeedLabel: 'SEED'
  },

  zh: {
    // ── Static UI ──────────────────────────────────────────────
    recordsTitle: '抽獎紀錄',
    displayLink: '📺 展示頁',
    tickerLabel: '🏆 得獎名單',
    restoreBtn: '還原',
    dismissBtn: '忽略',
    pleaseSelectPrize: '請選擇獎項',
    countdownStartBtn: '開始',
    countdownResetBtn: '重設',
    countdownCancelBtn: '取消',
    autoBtn: '自動',
    autoTitle: '倒數結束時自動抽獎',
    drawBtn: '抽獎',
    exportCsvBtn: '匯出 CSV',
    clearRecordsBtn: '清除',
    settingsTitle: '設定',
    resetAllBtn: '重設全部',
    drawTitleLabel: '活動標題',
    drawTitlePlaceholder: '如：年度晚宴 2026',
    nameListLabel: '參加者名單',
    uploadCsvBtn: '上傳 CSV',
    maskBtnTitle: '隱藏個人資訊',
    shuffleBtnTitle: '隨機排序',
    mergeBtnTitle: '合併重複',
    clearListBtnTitle: '清除名單',
    nameListPlaceholder: '每行一個名字（支援 10,000+ 人）。\nCSV 格式：每行為一位參加者，多欄位自動合併為一個名字。',
    removeWinnerLabel: '自動移除得獎者',
    enableSoundLabel: '啟用音效',
    prizeSettingsLabel: '獎項設定',
    resetPrizesBtn: '重設獎項',
    prizeHeaderName: '獎項名稱',
    prizeHeaderCount: '人數',
    prizeHeaderDrawTime: '開獎時間',
    addPrizeBtn: '+ 新增獎項',
    countdownLabel: '⏱ 倒數計時',
    countdownHint: '選擇獎項並設定時長，倒數條會顯示在主螢幕的 開始 ／ 暫停 ／ 重設 控制列。',
    selectPrize: '— 選擇獎項 —',
    countdownUnit: '分鐘',
    countdownClearHint: '獎項留空則停用倒數。',
    saveBtn: '儲存',
    discardBtn: '放棄並關閉',
    recordsHeading: '抽獎紀錄',
    // ── Dynamic strings ────────────────────────────────────────
    countdownPauseBtn: '暫停',
    autoDrawOnTitle: '自動抽獎已開啟 — 倒數結束時自動執行',
    autoDrawWarnFull: '⚠ 自動抽獎：獎項已抽完或未選擇',
    autoDrawWarnEmpty: '⚠ 自動抽獎：名單中無參加者',
    drawingLabel: '正在抽：{{name}}（剩餘 {{count}} 位）',
    pleaseSelectPrizeFirst: '請先選擇獎項',
    allWinnersDrawn: '此獎項已完成抽獎',
    addParticipantsFirst: '請先在設定中新增參加者',
    participantCount: '名單中有 {{count}} 位參加者',
    dedupeRemoved: '⚠ 已移除 {{count}} 位重複得獎者',
    prizeMeta: '{{drawn}}/{{total}} 人',
    recordsGroupCount: '{{drawn}}/{{total}} 位得獎',
    noRecordsYet: '尚無紀錄',
    clearRecordsConfirm: '確定清除所有紀錄？此操作無法還原。',
    resetPrizesConfirm: '確定重設獎項設定？所有獎項設定與紀錄將會清除。',
    resetAllConfirm: '確定重設全部設定？活動標題、名單、獎項設定、紀錄及所有資料將全部清除。',
    recoveryBanner: '⚠ 抽獎被中斷，是否還原 {{count}} 位參加者至名單？',
    csvLoaded: '✓ 已從 CSV 載入 {{count}} 位參加者',
    firebaseError: '⚠ Firebase 同步失敗 — 資料已儲存至本機',
    showPersonalInfo: '顯示個人資訊',
    hidePersonalInfo: '隱藏個人資訊',
    mergedDuplicates: '✓ 已合併：移除 {{count}} 筆重複',
    noDuplicatesFound: '✓ 無重複名字',
    clearListConfirm: '確定清除整份名單？',
    seedLabel: '種子 · {{seed}}',
    prizePlaceholder: '獎項名稱',
    prizeDescPlaceholder: '獎品說明（選填）',
    prizeDefaultName: '獎項',
    // ── Display page strings ───────────────────────────────────
    displayParticipants: '參加者',
    displayWinners: '得獎者',
    displayRemaining: '剩餘',
    displayPrizes: '獎項',
    displayDone: '✓ 已完成',
    displayUpcoming: '即將開抽',
    displaySpotsRemaining: '個名額\n剩餘',
    displayNoWinnersYet: '尚未開抽',
    displayCountdown: '⏱ 倒數中',
    displayPaused: '⏸ 已暫停',
    displayReady: '⏱ 準備就緒',
    displayTimesUp: '🎉 時間到！',
    displayTickerLabel: '🏆 得獎名單',
    displaySeedLabel: '種子'
  },

  ja: {
    // ── Static UI ──────────────────────────────────────────────
    recordsTitle: '当選記録',
    displayLink: '📺 表示画面',
    tickerLabel: '🏆 当選者',
    restoreBtn: '復元する',
    dismissBtn: '閉じる',
    pleaseSelectPrize: '賞を選んでください',
    countdownStartBtn: '開始',
    countdownResetBtn: 'リセット',
    countdownCancelBtn: 'キャンセル',
    autoBtn: '自動',
    autoTitle: 'カウントダウン終了時に自動で抽選します',
    drawBtn: '抽選する',
    exportCsvBtn: 'CSV出力',
    clearRecordsBtn: '削除',
    settingsTitle: '設定',
    resetAllBtn: '全リセット',
    drawTitleLabel: 'イベント名',
    drawTitlePlaceholder: '例：年次パーティー 2026',
    nameListLabel: '参加者リスト',
    uploadCsvBtn: 'CSVで読み込む',
    maskBtnTitle: '氏名を隠す',
    shuffleBtnTitle: 'シャッフル',
    mergeBtnTitle: '重複を削除',
    clearListBtnTitle: 'リストを全消去',
    nameListPlaceholder: '1行に1名（10,000名以上対応）。\nCSV：1行＝1参加者。複数列は半角スペースで結合されます。',
    removeWinnerLabel: '当選者をリストから自動削除',
    enableSoundLabel: '効果音を使用する',
    prizeSettingsLabel: '賞の設定',
    resetPrizesBtn: '賞設定をリセット',
    prizeHeaderName: '賞名',
    prizeHeaderCount: '当選人数',
    prizeHeaderDrawTime: '抽選予定時刻',
    addPrizeBtn: '＋ 賞を追加',
    countdownLabel: '⏱ カウントダウン',
    countdownHint: '賞と時間を設定すると、その賞が選択中にメイン画面へ 開始 / 一時停止 / リセット バーが表示されます。',
    selectPrize: '— 賞を選択 —',
    countdownUnit: '分',
    countdownClearHint: '賞を未選択にするとカウントダウンが無効になります。',
    saveBtn: '保存',
    discardBtn: '変更を破棄して閉じる',
    recordsHeading: '当選記録',
    // ── Dynamic strings ────────────────────────────────────────
    countdownPauseBtn: '一時停止',
    autoDrawOnTitle: '自動抽選オン — タイムアップ時に自動実行',
    autoDrawWarnFull: '⚠ 自動抽選：賞の当選枠が満員か未選択です',
    autoDrawWarnEmpty: '⚠ 自動抽選：参加者リストが空です',
    drawingLabel: '抽選中：{{name}}（残り {{count}} 名）',
    pleaseSelectPrizeFirst: 'まず賞を選んでください',
    allWinnersDrawn: 'この賞の当選者はすべて決まりました',
    addParticipantsFirst: '設定から参加者を追加してください',
    participantCount: '参加者 {{count}} 名',
    dedupeRemoved: '⚠ 既当選者 {{count}} 名をリストから除外しました',
    prizeMeta: '{{drawn}}/{{total}} 名',
    recordsGroupCount: '{{drawn}}/{{total}} 名当選',
    noRecordsYet: '記録はまだありません',
    clearRecordsConfirm: 'すべての当選記録を削除しますか？この操作は元に戻せません。',
    resetPrizesConfirm: '賞設定をリセットしますか？設定と当選記録がすべて削除されます。',
    resetAllConfirm: 'すべての設定をリセットしますか？イベント名・参加者リスト・賞設定・記録・保存データがすべて削除されます。',
    recoveryBanner: '⚠ 前回の抽選が中断されました。{{count}} 名をリストに復元しますか？',
    csvLoaded: '✓ CSVから {{count}} 名を読み込みました',
    firebaseError: '⚠ Firebase同期に失敗しました — データはローカルに保存されています',
    showPersonalInfo: '氏名を表示する',
    hidePersonalInfo: '氏名を隠す',
    mergedDuplicates: '✓ 重複 {{count}} 件を削除しました',
    noDuplicatesFound: '✓ 重複はありませんでした',
    clearListConfirm: 'リストをすべて消去しますか？',
    seedLabel: 'シード · {{seed}}',
    prizePlaceholder: '賞の名前を入力',
    prizeDescPlaceholder: '賞品の説明（任意）',
    prizeDefaultName: '賞',
    // ── Display page strings ───────────────────────────────────
    displayParticipants: '参加者',
    displayWinners: '当選者',
    displayRemaining: '残り',
    displayPrizes: '賞一覧',
    displayDone: '✓ 終了',
    displayUpcoming: '抽選待ち',
    displaySpotsRemaining: '名残り',
    displayNoWinnersYet: 'まだ当選者はいません',
    displayCountdown: '⏱ カウントダウン',
    displayPaused: '⏸ 一時停止',
    displayReady: '⏱ 準備完了',
    displayTimesUp: '🎉 時間終了！',
    displayTickerLabel: '🏆 当選者',
    displaySeedLabel: 'シード'
  }
};

// ── State ───────────────────────────────────────────────────────
let currentLang: Lang = 'en';

// Load persisted language immediately so t() works from first call
try {
  const saved = localStorage.getItem(LANG_KEY) as Lang | null;
  if (saved === 'en' || saved === 'zh' || saved === 'ja') currentLang = saved;
} catch (e) { /* ignore */ }

// ── Public API ──────────────────────────────────────────────────

export function getLang(): Lang { return currentLang; }

export function getLocale(): string {
  const locales: Record<Lang, string> = { en: 'en-GB', zh: 'zh-TW', ja: 'ja-JP' };
  return locales[currentLang];
}

export function setLang(lang: Lang): void {
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
}

export function t(key: string, params?: Record<string, string | number>): string {
  let text = dict[currentLang][key] ?? dict.en[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    });
  }
  return text;
}

export function applyLang(): void {
  // Highlight active lang button
  document.querySelectorAll<HTMLElement>('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  // Set text content
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    el.textContent = t(el.dataset.i18n!);
  });
  // Set placeholder
  document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    (el as HTMLInputElement).placeholder = t((el as HTMLElement).dataset.i18nPlaceholder!);
  });
  // Set title attribute
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    el.title = t(el.dataset.i18nTitle!);
  });
}
