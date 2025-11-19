import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CurrencyTrackerService, Check } from '../../services/currency-tracker.service';

@Component({
  selector: 'app-checks-accordion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './checks-accordion.component.html',
  styles: []
})
export class ChecksAccordionComponent {
  checkAmount: number | null = null;

  constructor(public currencyTracker: CurrencyTrackerService) {}

  addCheck(): void {
    if ((this.checkAmount || 0) > 0) {
      try {
        this.currencyTracker.addCheck(this.checkAmount!);

        // Reset form
        this.resetCheckForm();
      } catch (error) {
        console.error('Error adding check:', error);
      }
    }
  }

  removeCheck(checkId: string): void {
    this.currencyTracker.removeCheck(checkId);
  }

  clearAllChecks(): void {
    this.currencyTracker.clearChecks();
  }

  private resetCheckForm(): void {
    this.checkAmount = null;
  }
}
