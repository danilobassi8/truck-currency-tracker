import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CurrencyTrackerService } from '../../services/currency-tracker.service';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChipModule,
    ButtonModule,
    DividerModule
  ],
  templateUrl: './summary-card.component.html',
  styles: []
})
export class SummaryCardComponent {
  constructor(public currencyTracker: CurrencyTrackerService) {}

  clearAll(): void {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      this.currencyTracker.clearAll();
    }
  }
}
