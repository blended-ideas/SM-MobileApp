import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageUsersPageRoutingModule} from './manage-users-routing.module';

import {ManageUsersPage} from './manage-users.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CreateEditUserComponent} from '../../components/create-edit-user/create-edit-user.component';
import {ComponentsModule} from '../../components/components.module';
import {ChangePasswordComponent} from '../../components/change-password/change-password.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ManageUsersPageRoutingModule,
        FontAwesomeModule,
        ComponentsModule
    ],
    declarations: [ManageUsersPage],
    entryComponents: [CreateEditUserComponent, ChangePasswordComponent]
})
export class ManageUsersPageModule {
}
