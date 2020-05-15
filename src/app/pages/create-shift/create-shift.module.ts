import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CreateShiftPageRoutingModule} from './create-shift-routing.module';

import {CreateShiftPage} from './create-shift.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ComponentsModule} from '../../components/components.module';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateShiftPageRoutingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
    declarations: [CreateShiftPage],
    entryComponents: [ProductSelectorComponent]
})
export class CreateShiftPageModule {
}
