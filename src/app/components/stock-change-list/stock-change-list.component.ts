import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-stock-change-list',
    templateUrl: './stock-change-list.component.html',
    styleUrls: ['./stock-change-list.component.scss'],
})
export class StockChangeListComponent implements OnInit {

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismiss() {
        this.modalController.dismiss();
    }

}
