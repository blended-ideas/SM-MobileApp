import {Component, OnInit} from '@angular/core';
import {faEdit, faKey, faPlus} from '@fortawesome/free-solid-svg-icons';
import {UserInterface} from '../../interfaces/user.interface';
import {HttpParams} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {ModalController} from '@ionic/angular';
import {CreateEditUserComponent} from '../../components/create-edit-user/create-edit-user.component';
import {ChangePasswordComponent} from '../../components/change-password/change-password.component';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.page.html',
    styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {
    faPlus = faPlus;
    faKey = faKey;
    faEdit = faEdit;
    users: UserInterface[];
    isLoading: boolean;

    constructor(private userService: UserService,
                private modalController: ModalController) {
    }

    ngOnInit() {
        this.isLoading = true;
        const params = new HttpParams().set('for_management', 'true');
        this.userService.getUsers(params).subscribe(response => {
            this.isLoading = false;
            this.users = response;
        });
    }

    async createUser() {
        const modal = await this.modalController.create({
            component: CreateEditUserComponent,
        });
        await modal.present();
        await modal.onDidDismiss().then(data => {
            if (data && data.data) {
                this.users.push(data.data);
            }
        });
    }

    async editUser(user: UserInterface) {
        const modal = await this.modalController.create({
            component: CreateEditUserComponent,
            componentProps: {
                user
            }
        });
        await modal.present();
        await modal.onDidDismiss().then(data => {
            if (data && data.data) {
                const index = this.users.findIndex(u => Number(u.id) === Number(data.data.id));
                this.users.splice(index, 1, data.data);
            }
        });
    }

    async changeUserPassword(user: UserInterface) {
        const modal = await this.modalController.create({
            component: ChangePasswordComponent,
            componentProps: {
                user
            }
        });
        await modal.present();
        await modal.onDidDismiss().then(data => {
            if (data && data.data) {
                const index = this.users.findIndex(u => Number(u.id) === Number(data.data.id));
                this.users.splice(index, 1, data.data);
            }
        });
    }

}
