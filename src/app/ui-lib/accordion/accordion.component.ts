import { Component, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class AccordionData {
  data$: BehaviorSubject<any>;
  total: number;

  constructor(data: BehaviorSubject<any>, total: number) {
    this.data$ = data;
    this.total = total;
  }
}

@Component({
  selector: 'app-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
})
export class AccordionComponent {
  @Input()
  accordionData: any;

  @Input()
  tableTemplate!: TemplateRef<any>;

  showItemName(item: any) {
    return item.value[0].project.name;
  }

  calculateTotal(item: any) {
    return item.value
      .flatMap((el: { amount: any }) => el.amount)
      .reduce((prev: number, curr: number) => prev + curr, 0);
  }
}
