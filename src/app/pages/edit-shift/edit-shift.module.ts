import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditShiftPageRoutingModule} from './edit-shift-routing.module';

import {EditShiftPage} from './edit-shift.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditShiftPageRoutingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
    declarations: [EditShiftPage],
    entryComponents: [ProductSelectorComponent]
})
export class EditShiftPageModule {
}
