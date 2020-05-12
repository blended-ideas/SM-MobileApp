import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftListPageRoutingModule } from './shift-list-routing.module';

import { ShiftListPage } from './shift-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShiftListPageRoutingModule
  ],
  declarations: [ShiftListPage]
})
export class ShiftListPageModule {}
