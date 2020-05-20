import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProductListPageRoutingModule} from './product-list-routing.module';

import {ProductListPage} from './product-list.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SortComponent} from '../../components/sort/sort.component';
import {ComponentsModule} from '../../components/components.module';
import {PipeModule} from '../../pipe/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductListPageRoutingModule,
        FontAwesomeModule,
        ComponentsModule,
        PipeModule
    ],
    declarations: [ProductListPage],
    entryComponents: [SortComponent]
})
export class ProductListPageModule {
}
