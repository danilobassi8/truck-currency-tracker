import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CurrencyTrackerService } from '../../services/currency-tracker.service';
import { AccordionModule } from 'primeng/accordion';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-cash-accordion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    CardModule,
    ChipModule,
    AccordionModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './cash-accordion.component.html',
  styles: [],
})
export class CashAccordionComponent {
  selectedDenomination: number = 0;
  billCount: number | null = 1;

  // Dropdown options for denominations
  denominationOptions: { label: string; value: number }[] = [];

  constructor(
    public currencyTracker: CurrencyTrackerService,
    private alertService: AlertService
  ) {
    // Update denomination options when available denominations change
    effect(() => {
      this.denominationOptions = this.currencyTracker
        .availableDenominations()
        .map((denom) => ({
          label: `${denom.toLocaleString('es-AR')}`,
          value: denom,
        }));

      // Reset selected denomination if it's no longer available
      if (
        this.selectedDenomination > 0 &&
        !this.currencyTracker
          .availableDenominations()
          .includes(this.selectedDenomination)
      ) {
        this.selectedDenomination = 0;
      }
    });
  }

  addBills(): void {
    if (this.selectedDenomination > 0 && (this.billCount || 0) >= 1) {
      try {
        const currentCount = this.currencyTracker.getBillCount(
          this.selectedDenomination
        );
        const newCount = currentCount + (this.billCount || 0);
        this.currencyTracker.updateBillCount(
          this.selectedDenomination,
          newCount
        );

        // Reset form
        this.resetBillForm();
      } catch (error) {
        console.error('Error adding bills:', error);
      }
    }
  }

  updateBillCount(denomination: number, count: number): void {
    try {
      this.currencyTracker.updateBillCount(denomination, count);
    } catch (error) {
      console.error('Error updating bill count:', error);
    }
  }

  async removeBillType(denomination: number): Promise<void> {
    const confirmed = await this.alertService.confirmDelete(
      '¿Estás seguro?',
      `¿Quieres eliminar los billetes de $${denomination.toLocaleString('es-AR')}?`
    );

    if (confirmed) {
      this.currencyTracker.removeBillType(denomination);
      this.alertService.showSuccess(
        '¡Eliminado!',
        'Los billetes han sido eliminados.'
      );
    }
  }

  async clearAllBills(): Promise<void> {
    const confirmed = await this.alertService.confirmDelete(
      '¿Estás seguro?',
      '¿Quieres eliminar todo el efectivo? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      this.currencyTracker.clearBills();
      this.alertService.showSuccess(
        '¡Eliminado!',
        'Todo el efectivo ha sido eliminado.'
      );
    }
  }

  private resetBillForm(): void {
    this.selectedDenomination = 0;
    this.billCount = 1;
  }
}
