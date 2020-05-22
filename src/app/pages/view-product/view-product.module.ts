import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ViewProductPageRoutingModule} from './view-product-routing.module';

import {ViewProductPage} from './view-product.page';
import {PipeModule} from '../../pipe/pipe.module';
import {StockChangeListComponent} from '../../components/stock-change-list/stock-change-list.component';
import {ComponentsModule} from '../../components/components.module';
import {UpdateExpiryDateComponent} from '../../components/update-expiry-date/update-expiry-date.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewProductPageRoutingModule,
        PipeModule,
        ComponentsModule
    ],
    declarations: [ViewProductPage],
    entryComponents: [
        StockChangeListComponent,
        UpdateExpiryDateComponent
    ]
})
export class ViewProductPageModule {
}
