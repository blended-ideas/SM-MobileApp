import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateShiftPage } from './create-shift.page';

const routes: Routes = [
  {
    path: '',
    component: CreateShiftPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateShiftPageRoutingModule {}
