import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-update-expiry-date',
    templateUrl: './update-expiry-date.component.html',
    styleUrls: ['./update-expiry-date.component.scss'],
})
export class UpdateExpiryDateComponent implements OnInit {

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismiss() {
        this.modalController.dismiss();
    }

}
