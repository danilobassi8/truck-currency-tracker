import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CurrencyTrackerService, Check } from '../../services/currency-tracker.service';
import { AlertService } from '../../services/alert.service';

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

  constructor(
    public currencyTracker: CurrencyTrackerService,
    private alertService: AlertService
  ) {}

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

  async removeCheck(checkId: string): Promise<void> {
    const check = this.currencyTracker.checks().find(c => c.id === checkId);
    const amount = check ? check.amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '';

    const confirmed = await this.alertService.confirmDelete(
      '¿Estás seguro?',
      `¿Quieres eliminar el cheque de $${amount}?`
    );

    if (confirmed) {
      this.currencyTracker.removeCheck(checkId);
      this.alertService.showSuccess(
        '¡Eliminado!',
        'El cheque ha sido eliminado.'
      );
    }
  }

  async clearAllChecks(): Promise<void> {
    const confirmed = await this.alertService.confirmDelete(
      '¿Estás seguro?',
      '¿Quieres eliminar todos los cheques? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      this.currencyTracker.clearChecks();
      this.alertService.showSuccess(
        '¡Eliminado!',
        'Todos los cheques han sido eliminados.'
      );
    }
  }

  private resetCheckForm(): void {
    this.checkAmount = null;
  }
}
