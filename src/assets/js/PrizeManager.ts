import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBzJJ3yeO-_Yozikwds9_6PPwyAn788SHU",
    authDomain: "event-luckydraw.firebaseapp.com",
    databaseURL: "https://event-luckydraw-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "event-luckydraw",
    storageBucket: "event-luckydraw.firebasestorage.app",
    messagingSenderId: "186125547633",
    appId: "1:186125547633:web:fa86b83131dc480be3c3d0"
  };

  // Initialize Firebase
const db = getDatabase(getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]);

export interface Prize {
  id: string;
  name: string;
  count: number;
  winners: string[];
}

export default class PrizeManager {
  private prizes: Prize[];

  private currentPrizeId: string | null = null;

  constructor() {
    this.prizes = PrizeManager.loadFromStorage();
    if (!this.prizes.length) {
      this.prizes = [
        { id: '1', name: '1st Prize', count: 1, winners: [] },
        { id: '2', name: '2nd Prize', count: 2, winners: [] },
        { id: '3', name: '3rd Prize', count: 5, winners: [] },
      ];
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
  }

  addWinner(name: string): void {
    const prize = this.currentPrize;
    if (!prize) return;
    prize.winners.push(name);
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
      winners: this.prizes.find((old) => old.id === p.id)?.winners ?? [],
    }));
    this.currentPrizeId = null;
    this.saveToStorage();
    this.saveToFirebase();
  }

  clearRecords(): void {
    this.prizes.forEach((p) => { p.winners = []; }); // eslint-disable-line no-param-reassign
    this.saveToStorage();
    this.saveToFirebase();
  }

  exportCSV(): string {
    const rows = ['Prize,Name'];
    this.prizes.forEach((p) => {
      p.winners.forEach((w) => rows.push(`${p.name},${w}`));
    });
    return rows.join('\n');
  }

  private saveToFirebase(): void {
    try {
      set(ref(db, 'prizes'), this.prizes);
    } catch (e) { /* firebase unavailable */ }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('prize-manager-data', JSON.stringify(this.prizes));
    } catch (e) { /* storage unavailable */ }
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