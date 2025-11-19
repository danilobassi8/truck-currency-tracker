import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CashAccordionComponent } from "../../components/cash-accordion/cash-accordion.component";
import { ChecksAccordionComponent } from "../../components/checks-accordion/checks-accordion.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";

@Component({
  selector: 'app-currency-track',
  imports: [AccordionModule, CashAccordionComponent, ChecksAccordionComponent, SummaryCardComponent],
  templateUrl: './currency-track.page.html',
})
export class CurrencyTrackPage {
  constructor() {}
}
