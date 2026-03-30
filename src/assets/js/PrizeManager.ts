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
    this.prizes = this.loadFromStorage();
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
    return this.prizes.find(p => p.id === this.currentPrizeId) ?? null;
  }

  selectPrize(id: string): void {
    this.currentPrizeId = id;
  }

  addWinner(name: string): void {
    const prize = this.currentPrize;
    if (!prize) return;
    prize.winners.push(name);
    this.saveToStorage();
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
    this.prizes = prizes.map(p => ({
      ...p,
      winners: this.prizes.find(old => old.id === p.id)?.winners ?? []
    }));
    this.currentPrizeId = null;
    this.saveToStorage();
  }

  clearRecords(): void {
    this.prizes.forEach(p => { p.winners = []; }); // eslint-disable-line no-param-reassign
    this.saveToStorage();
  }

  exportCSV(): string {
    const rows = ['獎項,姓名'];
    this.prizes.forEach(p => {
      p.winners.forEach(w => rows.push(`${p.name},${w}`));
    });
    return rows.join('\n');
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('prize-manager-data', JSON.stringify(this.prizes));
    } catch (e) { /* storage unavailable */ }
  }

  private loadFromStorage(): Prize[] {
    try {
      const raw = localStorage.getItem('prize-manager-data');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}