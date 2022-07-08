import { EventEmitter, TemplateRef } from '@angular/core';

export interface Panel {
  templateRef: TemplateRef<any>;
  readonly closed: EventEmitter<void>;
}
