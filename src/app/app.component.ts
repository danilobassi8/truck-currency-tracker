import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CashAccordionComponent } from './components/cash-accordion/cash-accordion.component';
import { ChecksAccordionComponent } from './components/checks-accordion/checks-accordion.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { Card } from "primeng/card";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    CashAccordionComponent,
    ChecksAccordionComponent,
    SummaryCardComponent,
    Card
],
  templateUrl: './app.component.html',
})
export class AppComponent {}
