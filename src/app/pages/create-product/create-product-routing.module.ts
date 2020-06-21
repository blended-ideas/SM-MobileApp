import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreateProductPage} from './create-product.page';
import {RoleGuard} from '../../services/routerGuards/role-guard.service';

const routes: Routes = [
    {
        path: '',
        component: CreateProductPage,
        canActivate: [RoleGuard],
        data: {roles: ['Admin', 'Auditor']}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateProductPageRoutingModule {
}
