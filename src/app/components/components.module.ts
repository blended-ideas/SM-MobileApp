import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {SortComponent} from './sort/sort.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        SortComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FontAwesomeModule
    ],
    exports: [],
    entryComponents: [],
    providers: []
})
export class ComponentsModule {

}
