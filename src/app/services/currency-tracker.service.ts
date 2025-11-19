import { Injectable, signal, computed } from '@angular/core';

export interface BillType {
  denomination: number;
  count: number;
}

export interface Check {
  id: string;
  amount: number;
  description?: string;
}

export interface CurrencyState {
  bills: BillType[];
  checks: Check[];
  totalCash: number;
  totalChecks: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyTrackerService {
  // Available bill denominations - easy to extend in the future
  public readonly BILL_DENOMINATIONS = [10, 20, 50, 100, 200, 500, 1000, 2000, 10000, 20000];

  private readonly BILLS_STORAGE_KEY = 'truck-currency-bills';
  private readonly CHECKS_STORAGE_KEY = 'truck-currency-checks';

  // Signals for reactive state management
  private billsSignal = signal<BillType[]>([]);
  private checksSignal = signal<Check[]>([]);

  // Public signals
  public bills = this.billsSignal.asReadonly();
  public checks = this.checksSignal.asReadonly();

  // Computed values
  public totalCash = computed(() =>
    this.billsSignal().reduce((sum, bill) => sum + (bill.denomination * bill.count), 0)
  );

  public totalChecks = computed(() =>
    this.checksSignal().reduce((sum, check) => sum + check.amount, 0)
  );

  public completeTotal = computed(() => this.totalCash() + this.totalChecks())

  public availableDenominations = computed(() => {
    const usedDenominations = this.billsSignal().map(bill => bill.denomination);
    return this.BILL_DENOMINATIONS.filter(denom => !usedDenominations.includes(denom));
  });

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get current state snapshot
   */
  public getCurrentState(): CurrencyState {
    return {
      bills: this.billsSignal(),
      checks: this.checksSignal(),
      totalCash: this.totalCash(),
      totalChecks: this.totalChecks()
    };
  }

  /**
   * Add or update a bill type with count
   */
  public updateBillCount(denomination: number, count: number): void {
    if (!this.BILL_DENOMINATIONS.includes(denomination)) {
      throw new Error(`Invalid denomination: ${denomination}`);
    }

    if (count < 0) {
      throw new Error('Count cannot be negative');
    }

    const currentBills = [...this.billsSignal()];
    const existingBillIndex = currentBills.findIndex(bill => bill.denomination === denomination);

    // Add or update bill type (0 is now a valid count)
    if (existingBillIndex !== -1) {
      currentBills[existingBillIndex].count = count;
    } else {
      currentBills.push({ denomination, count });
      // Sort bills by denomination for consistent display
      currentBills.sort((a, b) => a.denomination - b.denomination);
    }

    this.billsSignal.set(currentBills);
    this.saveToStorage();
  }

  /**
   * Get count for a specific bill denomination
   */
  public getBillCount(denomination: number): number {
    const bill = this.billsSignal().find(b => b.denomination === denomination);
    return bill ? bill.count : 0;
  }

  /**
   * Remove a bill type completely from the list
   */
  public removeBillType(denomination: number): void {
    const currentBills = [...this.billsSignal()];
    const filteredBills = currentBills.filter(bill => bill.denomination !== denomination);
    this.billsSignal.set(filteredBills);
    this.saveToStorage();
  }

  /**
   * Add a new check
   */
  public addCheck(amount: number, description?: string): void {
    if (amount <= 0) {
      throw new Error('Check amount must be positive');
    }

    const newCheck: Check = {
      id: this.generateCheckId(),
      amount,
      description
    };

    const currentChecks = [...this.checksSignal()];
    currentChecks.push(newCheck);

    this.checksSignal.set(currentChecks);
    this.saveToStorage();
  }

  /**
   * Remove a check by ID
   */
  public removeCheck(checkId: string): void {
    const currentChecks = this.checksSignal().filter(check => check.id !== checkId);
    this.checksSignal.set(currentChecks);
    this.saveToStorage();
  }

  /**
   * Clear all data
   */
  public clearAll(): void {
    this.billsSignal.set([]);
    this.checksSignal.set([]);
    this.saveToStorage();
  }

  /**
   * Clear only bills
   */
  public clearBills(): void {
    this.billsSignal.set([]);
    this.saveToStorage();
  }

  /**
   * Clear only checks
   */
  public clearChecks(): void {
    this.checksSignal.set([]);
    this.saveToStorage();
  }

  private generateCheckId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }  private saveToStorage(): void {
    // Save bills and checks separately for better maintainability
    localStorage.setItem(this.BILLS_STORAGE_KEY, JSON.stringify(this.billsSignal()));
    localStorage.setItem(this.CHECKS_STORAGE_KEY, JSON.stringify(this.checksSignal()));
  }

  private loadFromStorage(): void {
    try {
      // Load bills
      const savedBills = localStorage.getItem(this.BILLS_STORAGE_KEY);
      if (savedBills) {
        const bills: BillType[] = JSON.parse(savedBills);
        this.billsSignal.set(bills);
      }

      // Load checks
      const savedChecks = localStorage.getItem(this.CHECKS_STORAGE_KEY);
      if (savedChecks) {
        const checks: Check[] = JSON.parse(savedChecks);
        this.checksSignal.set(checks);
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
      // If there's an error, start with empty state
      this.clearAll();
    }
  }
}
