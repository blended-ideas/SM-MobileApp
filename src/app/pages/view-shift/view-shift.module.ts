import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ViewShiftPageRoutingModule} from './view-shift-routing.module';

import {ViewShiftPage} from './view-shift.page';
import {PipeModule} from '../../pipe/pipe.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewShiftPageRoutingModule,
        PipeModule,
        FontAwesomeModule,
        ComponentsModule
    ],
    declarations: [ViewShiftPage]
})
export class ViewShiftPageModule {
}
