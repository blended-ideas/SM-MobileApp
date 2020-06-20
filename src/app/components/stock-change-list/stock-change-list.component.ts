import {Component, Input, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {HttpParams} from '@angular/common/http';
import {ProductInterface, ProductStockChangeInterface} from '../../interfaces/product.interface';
import {UtilService} from '../../services/util.service';
import {ProductService} from '../../services/product.service';
import {StockUpdatePopOverComponent} from '../stock-update-pop-over/stock-update-pop-over.component';
import {SessionService} from '../../services/session.service';

@Component({
    selector: 'app-stock-change-list',
    templateUrl: './stock-change-list.component.html',
    styleUrls: ['./stock-change-list.component.scss'],
})
export class StockChangeListComponent implements OnInit {
    @Input() product: ProductInterface;
    productStockChanges: ProductStockChangeInterface[] = [];
    productStockChangeLoading: boolean;
    next: string;
    allowStockChange: boolean;

    constructor(private modalController: ModalController,
                private utilService: UtilService,
                private productService: ProductService,
                private popOverController: PopoverController,
                private sessionService: SessionService) {
    }

    ngOnInit() {
        this.getProductStockChanges(true);
        this.allowStockChange = this.sessionService.isAdmin() || this.sessionService.isAuditor();

    }

    getProductStockChanges(emptyArray?: boolean, link?: string, infiniteScroll?: any) {
        if (emptyArray) {
            this.productStockChanges = [];
        }
        const params = new HttpParams()
            .set('product', this.product.id)
            .set('page_size', '10');
        this.productStockChangeLoading = true;
        this.productService.getProductStockChanges(params, link).subscribe(response => {
            this.productStockChanges = this.productStockChanges.concat(...response.results);
            this.next = response.next;
            this.productStockChangeLoading = false;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        }, () => {
            this.productStockChangeLoading = false;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        });
    }


    doInfiniteScroll(infiniteScroll) {
        this.getProductStockChanges(false, this.next, infiniteScroll);
    }

    dismiss() {
        this.modalController.dismiss();
    }

    async addRemoveStock(type: 'ADD' | 'REMOVE') {
        const popOver = await this.popOverController.create({
            component: StockUpdatePopOverComponent,
            componentProps: {
                product: this.product,
                type
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
                this.product.stock = data.data.new_value;
                this.getProductStockChanges(true);
            }
        });
    }
}
