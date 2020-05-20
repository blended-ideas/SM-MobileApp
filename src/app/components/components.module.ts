import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {SortComponent} from './sort/sort.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProductSelectorComponent} from './product-selector/product-selector.component';
import {FormsModule} from '@angular/forms';
import {StockChangeListComponent} from './stock-change-list/stock-change-list.component';
import {StockUpdatePopOverComponent} from './stock-update-pop-over/stock-update-pop-over.component';

@NgModule({
    declarations: [
        SortComponent,
        ProductSelectorComponent,
        StockChangeListComponent,
        StockUpdatePopOverComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FontAwesomeModule,
        FormsModule
    ],
    exports: [],
    entryComponents: [],
    providers: []
})
export class ComponentsModule {

}
