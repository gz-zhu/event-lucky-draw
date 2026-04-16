import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

export interface CountdownState {
  prizeId: string;
  minutes: number;
  /** Unix ms when last started; null when not running */
  startedAt: number | null;
  /** Seconds remaining at last pause; null when not paused */
  pausedRemaining: number | null;
  running: boolean;
}

const firebaseConfig = {
  apiKey: 'AIzaSyBzJJ3yeO-_Yozikwds9_6PPwyAn788SHU',
  authDomain: 'event-luckydraw.firebaseapp.com',
  databaseURL: 'https://event-luckydraw-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'event-luckydraw',
  storageBucket: 'event-luckydraw.firebasestorage.app',
  messagingSenderId: '186125547633',
  appId: '1:186125547633:web:fa86b83131dc480be3c3d0'
};

// Initialize Firebase
const db = getDatabase(getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]);

export interface Prize {
  id: string;
  name: string;
  count: number;
  /** Scheduled draw time shown on the display screen, e.g. "19:30" */
  drawTime?: string;
  /** Optional prize item description shown on the display screen */
  description?: string;
  winners: string[];
  winnerTimestamps?: string[];
  winnerSeeds?: string[];
}

export default class PrizeManager {
  private prizes: Prize[];

  private currentPrizeId: string | null = null;

  constructor() {
    this.prizes = PrizeManager.loadFromStorage();
    if (!this.prizes.length) {
      this.prizes = [
        {
          id: '1', name: '1st Prize', count: 1, winners: []
        },
        {
          id: '2', name: '2nd Prize', count: 2, winners: []
        },
        {
          id: '3', name: '3rd Prize', count: 5, winners: []
        }
      ];
    }
    // Restore last selected prize (persisted across page refresh)
    const saved = localStorage.getItem('current-prize-id');
    if (saved && this.prizes.some((p) => p.id === saved)) {
      this.currentPrizeId = saved;
    }
  }

  get allPrizes(): Prize[] {
    return this.prizes;
  }

  get currentPrize(): Prize | null {
    return this.prizes.find((p) => p.id === this.currentPrizeId) ?? null;
  }

  selectPrize(id: string): void {
    this.currentPrizeId = id;
    this.saveCurrentPrizeSelection();
  }

  addWinner(name: string): void {
    const prize = this.currentPrize;
    if (!prize) return;
    const completedAt = Date.now();
    prize.winners.push(name);
    if (!prize.winnerTimestamps) prize.winnerTimestamps = [];
    prize.winnerTimestamps.push(new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }));
    if (!prize.winnerSeeds) prize.winnerSeeds = [];
    prize.winnerSeeds.push(localStorage.getItem('draw-last-seed') ?? '');
    try { localStorage.setItem('draw-last-spin-ended-at', String(completedAt)); } catch (e) { /* ignore */ }
    try {
      set(ref(db, 'lastCompletedDrawAt'), completedAt).catch(() => {
        document.dispatchEvent(new CustomEvent('firebase-sync-error'));
      });
    } catch (e) {
      document.dispatchEvent(new CustomEvent('firebase-sync-error'));
    }
    this.saveToStorage();
    this.saveToFirebase();
  }

  isCurrentPrizeFull(): boolean {
    const p = this.currentPrize;
    return p ? p.winners.length >= p.count : true;
  }

  remainingCount(): number {
    const p = this.currentPrize;
    return p ? p.count - p.winners.length : 0;
  }

  setPrizes(prizes: Omit<Prize, 'winners'>[]): void {
    this.prizes = prizes.map((p) => ({
      ...p,
      winners: this.prizes.find((old) => old.id === p.id)?.winners ?? []
    }));
    this.currentPrizeId = null;
    this.saveCurrentPrizeSelection();
    this.saveToStorage();
    this.saveToFirebase();
  }

  clearRecords(): void {
    this.prizes.forEach((p) => {
      p.winners = []; // eslint-disable-line no-param-reassign
      p.winnerTimestamps = []; // eslint-disable-line no-param-reassign
      p.winnerSeeds = []; // eslint-disable-line no-param-reassign
    });
    this.saveToStorage();
    this.saveToFirebase();
  }

  exportCSV(): string {
    const rows = ['Prize,Name,Date & Time,Seed'];
    this.prizes.forEach((p) => {
      p.winners.forEach((w, i) => {
        const ts = p.winnerTimestamps?.[i] ?? '';
        const seed = p.winnerSeeds?.[i] ?? '';

        rows.push(`${p.name},"${w}","${ts}","${seed}"`);
      });
    });
    return rows.join('\n');
  }

  // ── Countdown state (synced to Firebase + localStorage) ──────

  startCountdown(prizeId: string, minutes: number, resumeFromSeconds?: number): void {
    const totalSecs = minutes * 60;
    const elapsed = resumeFromSeconds !== undefined ? totalSecs - resumeFromSeconds : 0;
    const state: CountdownState = {
      prizeId,
      minutes,
      startedAt: Date.now() - elapsed * 1000,
      pausedRemaining: null,
      running: true
    };
    this.saveCountdownState(state);
  }

  pauseCountdown(remaining: number): void {
    const raw = localStorage.getItem('draw-countdown');
    try {
      const prev: CountdownState = raw ? JSON.parse(raw) : {};
      this.saveCountdownState({
        ...prev, running: false, startedAt: null, pausedRemaining: remaining
      });
    } catch { /* ignore */ }
  }

  resetCountdown(prizeId: string, minutes: number): void {
    this.saveCountdownState({
      prizeId, minutes, startedAt: null, pausedRemaining: null, running: false
    });
  }

  // eslint-disable-next-line class-methods-use-this
  clearCountdown(): void {
    try { localStorage.removeItem('draw-countdown'); } catch (e) { /* ignore */ }
    try { set(ref(db, 'countdown'), null).catch(() => {}); } catch (e) { /* ignore */ }
  }

  // eslint-disable-next-line class-methods-use-this
  private saveCountdownState(state: CountdownState): void {
    try { localStorage.setItem('draw-countdown', JSON.stringify(state)); } catch (e) { /* ignore */ }
    try { set(ref(db, 'countdown'), state).catch(() => {}); } catch (e) { /* ignore */ }
  }

  private saveToFirebase(): void {
    try {
      set(ref(db, 'prizes'), this.prizes).catch(() => {
        document.dispatchEvent(new CustomEvent('firebase-sync-error'));
      });
    } catch (e) {
      document.dispatchEvent(new CustomEvent('firebase-sync-error'));
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('prize-manager-data', JSON.stringify(this.prizes));
    } catch (e) { /* storage unavailable */ }
  }

  private saveCurrentPrizeSelection(): void {
    try {
      if (this.currentPrizeId) localStorage.setItem('current-prize-id', this.currentPrizeId);
      else localStorage.removeItem('current-prize-id');
    } catch (e) { /* ignore */ }
    try {
      set(ref(db, 'currentPrizeId'), this.currentPrizeId).catch(() => {
        document.dispatchEvent(new CustomEvent('firebase-sync-error'));
      });
    } catch (e) {
      document.dispatchEvent(new CustomEvent('firebase-sync-error'));
    }
  }

  private static loadFromStorage(): Prize[] {
    try {
      const raw = localStorage.getItem('prize-manager-data');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
