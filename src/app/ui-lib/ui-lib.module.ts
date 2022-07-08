import { CdkAccordionModule } from '@angular/cdk/accordion';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { AccordionComponent } from './accordion/accordion.component';
import { AvatarComponent } from './avatar/avatar.component';
import { DrawerComponent } from './drawer/drawer.component';
import { DropdownTriggerDirective } from './dropdown/dropdown-trigger.directive';
import { DropdownComponent } from './dropdown/dropdown.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AccordionComponent,
    HeaderComponent,
    DrawerComponent,
    AvatarComponent,
    DropdownComponent,
    DropdownTriggerDirective,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CdkAccordionModule,
    MatSidenavModule,
    OverlayModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    AccordionComponent,
    HeaderComponent,
    DrawerComponent,
    DropdownComponent,
    DropdownTriggerDirective,
    CommonModule,
  ],
})
export class UiLibModule {}
