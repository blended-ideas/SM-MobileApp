import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {SortComponent} from './sort/sort.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProductSelectorComponent} from './product-selector/product-selector.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StockChangeListComponent} from './stock-change-list/stock-change-list.component';
import {StockUpdatePopOverComponent} from './stock-update-pop-over/stock-update-pop-over.component';
import {UpdateExpiryDateComponent} from './update-expiry-date/update-expiry-date.component';
import {AddExpiryDatePopOverComponent} from './add-expiry-date-pop-over/add-expiry-date-pop-over.component';
import {MarginCardComponent} from './margin-card/margin-card.component';
import {PipeModule} from '../pipe/pipe.module';
import {CreateEditUserComponent} from './create-edit-user/create-edit-user.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

@NgModule({
    declarations: [
        SortComponent,
        ProductSelectorComponent,
        StockChangeListComponent,
        StockUpdatePopOverComponent,
        UpdateExpiryDateComponent,
        AddExpiryDatePopOverComponent,
        MarginCardComponent,
        CreateEditUserComponent,
        ChangePasswordComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule
    ],
    exports: [MarginCardComponent],
    entryComponents: [StockUpdatePopOverComponent, AddExpiryDatePopOverComponent],
    providers: []
})
export class ComponentsModule {

}
