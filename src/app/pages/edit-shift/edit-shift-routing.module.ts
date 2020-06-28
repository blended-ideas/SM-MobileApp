import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditShiftPage } from './edit-shift.page';

const routes: Routes = [
  {
    path: '',
    component: EditShiftPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditShiftPageRoutingModule {}
