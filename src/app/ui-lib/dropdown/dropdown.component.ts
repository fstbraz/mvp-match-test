import {
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Panel } from './panel';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements Panel {
  @ViewChild(TemplateRef)
  templateRef!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
}
