import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {SortComponent} from './sort/sort.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProductSelectorComponent} from './product-selector/product-selector.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        SortComponent,
        ProductSelectorComponent
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
