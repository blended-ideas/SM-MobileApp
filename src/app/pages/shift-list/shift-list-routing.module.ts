import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ShiftListPage} from './shift-list.page';

const routes: Routes = [
    {
        path: '',
        component: ShiftListPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShiftListPageRoutingModule {
}
