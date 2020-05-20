import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ViewProductPageRoutingModule} from './view-product-routing.module';

import {ViewProductPage} from './view-product.page';
import {PipeModule} from '../../pipe/pipe.module';
import {StockChangeListComponent} from '../../components/stock-change-list/stock-change-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewProductPageRoutingModule,
        PipeModule
    ],
    declarations: [ViewProductPage],
    entryComponents: [StockChangeListComponent]
})
export class ViewProductPageModule {
}
