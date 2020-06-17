import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {UserInterface} from '../../interfaces/user.interface';

@Component({
    selector: 'app-create-edit-user',
    templateUrl: './create-edit-user.component.html',
    styleUrls: ['./create-edit-user.component.scss'],
})
export class CreateEditUserComponent implements OnInit {
    @Input() user: UserInterface;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismiss(boolVal) {
        boolVal ? this.modalController.dismiss() : this.modalController.dismiss(false);
    }

}
