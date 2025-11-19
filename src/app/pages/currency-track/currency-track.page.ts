import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { Card } from 'primeng/card';
import { CashAccordionComponent } from "../../components/cash-accordion/cash-accordion.component";

@Component({
  selector: 'app-currency-track',
  imports: [AccordionModule, Card, CashAccordionComponent],
  templateUrl: './currency-track.page.html',
})
export class CurrencyTrackPage {
  constructor() {}
}
