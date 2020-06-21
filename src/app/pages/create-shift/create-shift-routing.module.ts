import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreateShiftPage} from './create-shift.page';
import {RoleGuard} from '../../services/routerGuards/role-guard.service';

const routes: Routes = [
    {
        path: '',
        component: CreateShiftPage,
        canActivate: [RoleGuard],
        data: {roles: ['Admin', 'Auditor', 'Shift']}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateShiftPageRoutingModule {
}
