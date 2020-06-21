import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MarginPageRoutingModule} from './margin-routing.module';

import {MarginPage} from './margin.page';
import {ComponentsModule} from '../../components/components.module';
import {RoleGuard} from '../../services/routerGuards/role-guard.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MarginPageRoutingModule,
        ComponentsModule
    ],
    declarations: [MarginPage],
    providers: [RoleGuard]
})
export class MarginPageModule {
}
