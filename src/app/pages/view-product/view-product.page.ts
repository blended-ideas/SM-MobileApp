import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';
import {ProductInterface} from '../../interfaces/product.interface';
import {HttpParams} from '@angular/common/http';
import {ModalController} from '@ionic/angular';
import {StockChangeListComponent} from '../../components/stock-change-list/stock-change-list.component';

@Component({
    selector: 'app-view-product',
    templateUrl: './view-product.page.html',
    styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage implements OnInit {
    product: ProductInterface;

    constructor(private route: ActivatedRoute,
                private productService: ProductService,
                private utilService: UtilService,
                private modalController: ModalController) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('productId')) {
                this.fetchProductById(paramMap.get('productId'));
            }
        });
    }

    fetchProductById(id) {
        this.utilService.presentLoading('Fetching Product Detail');
        this.productService.getProductById(id).subscribe(response => {
            this.product = response;
            this.utilService.dismissLoading();
        }, () => {
            this.utilService.dismissLoading();
        });
    }

    openStockChangesModal() {
        const modal = this.modalController.create({
            component: StockChangeListComponent
        });
    }

}