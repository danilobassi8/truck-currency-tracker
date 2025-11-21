import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CurrencyTrackerService } from '../../services/currency-tracker.service';
import { AlertService } from '../../services/alert.service';

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
  constructor(
    public currencyTracker: CurrencyTrackerService,
    private alertService: AlertService
  ) {}

  async clearAll(): Promise<void> {
    const confirmed = await this.alertService.confirmDelete(
      '¿Estás seguro?',
      '¿Quieres eliminar TODOS los datos? Esto borra todo el efectivo y todos los cheques.',
      {
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar'
      }
    );

    if (confirmed) {
      this.currencyTracker.clearAll();
      this.alertService.showSuccess(
        '¡Eliminado!',
        'Se han reiniciado todos los datos.',
        2000
      );
    }
  }
}
