import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { UiLibModule } from './../ui-lib/ui-lib.module';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [UiLibModule],
  exports: [UiLibModule, ReportComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeatureModule {}
