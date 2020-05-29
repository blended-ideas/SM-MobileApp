import {Component, Input, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {HttpParams} from '@angular/common/http';
import {ProductExpiryDateInterface, ProductInterface} from '../../interfaces/product.interface';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';
import {StockUpdatePopOverComponent} from '../stock-update-pop-over/stock-update-pop-over.component';
import {AddExpiryDatePopOverComponent} from '../add-expiry-date-pop-over/add-expiry-date-pop-over.component';

@Component({
    selector: 'app-update-expiry-date',
    templateUrl: './update-expiry-date.component.html',
    styleUrls: ['./update-expiry-date.component.scss'],
})
export class UpdateExpiryDateComponent implements OnInit {
    @Input() product: ProductInterface;
    productExpiryLoading: boolean;
    productExpiryDates: ProductExpiryDateInterface[];
    next: string;

    constructor(private modalController: ModalController,
                private productService: ProductService,
                private popOverController: PopoverController) {
    }

    ngOnInit() {
        this.getProductExpiryDates(true);
    }

    dismiss() {
        this.modalController.dismiss();
    }

    getProductExpiryDates(emptyArray: boolean, link?: string, infiniteScroll?: any) {
        if (emptyArray) {
            this.productExpiryDates = [];
        }
        const params = new HttpParams()
            .set('product', this.product.id)
            .set('page_size', '5')
            .set('after_today', 'true');
        this.productExpiryLoading = true;
        this.productService.getProductExpiryDates(params, link).subscribe(response => {
            this.productExpiryDates = response.results;
            this.next = response.next;
            this.productExpiryLoading = false;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        }, () => {
            this.productExpiryLoading = false;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        });
    }

    doInfiniteScroll(infiniteScroll) {
        this.getProductExpiryDates(false, this.next, infiniteScroll);
    }

    async addExpiryDate() {
        const popOver = await this.popOverController.create({
            component: AddExpiryDatePopOverComponent,
            componentProps: {
                product: this.product
            },
            cssClass: 'custom-popover',
            keyboardClose: false,
            backdropDismiss: false,
            animated: true
        });
        await popOver.present();
        await popOver.onDidDismiss().then(data => {
            console.log(data.data);
            if (data.data) {
                this.getProductExpiryDates(true);
            }
        });
    }

}
