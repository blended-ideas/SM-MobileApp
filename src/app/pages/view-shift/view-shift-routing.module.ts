import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewShiftPage } from './view-shift.page';

const routes: Routes = [
  {
    path: '',
    component: ViewShiftPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewShiftPageRoutingModule {}
