interface SlotConfigurations {
  /** User configuration for maximum item inside a reel */
  maxReelItems?: number;
  /** User configuration for whether winner should be removed from name list */
  removeWinner?: boolean;
  /** User configuration for element selector which reel items should append to */
  reelContainerSelector: string;
  /** User configuration for callback function that runs before spinning reel */
  onSpinStart?: () => void;
  /** User configuration for callback function that runs after spinning reel */
  onSpinEnd?: () => void;

  /** User configuration for callback function that runs after user updates the name list */
  onNameListChanged?: () => void;
}

/** Class for doing random name pick and animation */
export default class Slot {
  /** List of names to draw from */
  private nameList: string[];

  /** Container that hold the reel items */
  private reelContainer: HTMLElement | null;

  /** Maximum item inside a reel */
  private maxReelItems: NonNullable<SlotConfigurations['maxReelItems']>;

  /** Whether winner should be removed from name list */
  private shouldRemoveWinner: NonNullable<SlotConfigurations['removeWinner']>;

  /** Total duration for the flash-style draw animation */
  private spinDurationMs: number;

  /** Callback function that runs before spinning reel */
  private onSpinStart?: NonNullable<SlotConfigurations['onSpinStart']>;

  /** Callback function that runs after spinning reel */
  private onSpinEnd?: NonNullable<SlotConfigurations['onSpinEnd']>;

  /** Callback function that runs after spinning reel */
  private onNameListChanged?: NonNullable<SlotConfigurations['onNameListChanged']>;

  /**
   * Constructor of Slot
   * @param maxReelItems  Maximum item inside a reel
   * @param removeWinner  Whether winner should be removed from name list
   * @param reelContainerSelector  The element ID of reel items to be appended
   * @param onSpinStart  Callback function that runs before spinning reel
   * @param onNameListChanged  Callback function that runs when user updates the name list
   */
  constructor(
    {
      maxReelItems = 30,
      removeWinner = true,
      reelContainerSelector,
      onSpinStart,
      onSpinEnd,
      onNameListChanged
    }: SlotConfigurations
  ) {
    this.nameList = [];
    this.reelContainer = document.querySelector(reelContainerSelector);
    this.maxReelItems = maxReelItems;
    this.shouldRemoveWinner = removeWinner;
    this.onSpinStart = onSpinStart;
    this.onSpinEnd = onSpinEnd;
    this.onNameListChanged = onNameListChanged;
    this.spinDurationMs = this.maxReelItems * 80;
  }

  /**
   * Setter for name list
   * @param names  List of names to draw a winner from
   */
  set names(names: string[]) {
    this.nameList = names;

    const reelItemsToRemove = this.reelContainer?.children
      ? Array.from(this.reelContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get names(): string[] {
    return this.nameList;
  }

  /**
   * Setter for shouldRemoveWinner
   * @param removeWinner  Whether the winner should be removed from name list
   */
  set shouldRemoveWinnerFromNameList(removeWinner: boolean) {
    this.shouldRemoveWinner = removeWinner;
  }

  /** Getter for shouldRemoveWinner */
  get shouldRemoveWinnerFromNameList(): boolean {
    return this.shouldRemoveWinner;
  }

  /**
   * Returns a new array where the items are shuffled
   * @template T  Type of items inside the array to be shuffled
   * @param array  The array to be shuffled
   * @returns The shuffled array
   */
  private static shuffleNames<T = unknown>(array: T[]): T[] {
    const keys = Object.keys(array) as unknown[] as number[];
    const result: T[] = [];
    for (let k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
      // eslint-disable-next-line no-bitwise
      const i = Math.random() * n | 0;
      const key = keys[i];
      result.push(array[key]);
      n -= 1;
      const tmp = keys[n];
      keys[n] = key;
      keys[i] = tmp;
    }
    return result;
  }

  /**
   * Dynamically update reel item count and speed before a spin
   * @param items  Number of reel items to scroll through
   * @param msPerItem  Milliseconds per reel item
   */
  public updateSpinParams(items: number, msPerItem: number): void {
    this.maxReelItems = items;
    this.spinDurationMs = items * msPerItem;
  }

  /**
   * Function for spinning the slot
   * @returns Whether the spin is completed successfully
   */
  public async spin(): Promise<boolean> {
    if (!this.nameList.length) {
      console.error('Name List is empty. Cannot start spinning.');
      return false;
    }

    if (this.onSpinStart) {
      this.onSpinStart();
    }

    const { reelContainer, shouldRemoveWinner } = this;
    if (!reelContainer) {
      return false;
    }

    const winner = Slot.shuffleNames<string>(this.nameList)[0];

    const maskName = (name: string): string => {
      const parts = name.split(/(\s+|—|-)/);
      return parts.map((part) => {
        if (/^\s+$/.test(part) || part === '—' || part === '-') return part;
        if (part.length <= 2) return part;
        const keep = Math.ceil(part.length / 3);
        return `${part.slice(0, keep)}***`;
      }).join('');
    };

    reelContainer.innerHTML = '';
    const displayItem = document.createElement('div');
    reelContainer.appendChild(displayItem);

    // Remove winner from name list if necessary (all instances, to handle duplicates)
    if (shouldRemoveWinner) {
      this.nameList = this.nameList.filter((name) => name !== winner);
    }

    console.info('Remaining: ', this.nameList);
    const start = Date.now();
    const fastPhaseMs = Math.max(0, this.spinDurationMs - 600);
    let nextUpdateAt = 0;

    while (Date.now() - start < this.spinDurationMs) {
      const elapsed = Date.now() - start;
      const inSlowPhase = elapsed >= fastPhaseMs;
      const delay = inSlowPhase ? 120 : 45;

      if (elapsed >= nextUpdateAt) {
        // eslint-disable-next-line no-bitwise
        const candidate = this.nameList[Math.random() * this.nameList.length | 0] ?? winner;
        displayItem.textContent = maskName(candidate);
        nextUpdateAt = elapsed + delay;
      }

      // Keep the flashing animation responsive without relying on a rolling reel transform.
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => { setTimeout(resolve, 16); });
    }

    displayItem.textContent = winner;

    if (this.onSpinEnd) {
      this.onSpinEnd();
    }
    return true;
  }
}
