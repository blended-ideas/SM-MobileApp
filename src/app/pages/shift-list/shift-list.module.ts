import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ShiftListPageRoutingModule} from './shift-list-routing.module';

import {ShiftListPage} from './shift-list.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ComponentsModule} from '../../components/components.module';
import {SortComponent} from '../../components/sort/sort.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ShiftListPageRoutingModule,
        FontAwesomeModule,
        ComponentsModule
    ],
    declarations: [ShiftListPage],
    entryComponents: [SortComponent]
})
export class ShiftListPageModule {
}
