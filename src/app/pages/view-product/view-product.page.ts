import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';
import {ProductInterface} from '../../interfaces/product.interface';
import {ModalController, Platform} from '@ionic/angular';
import {StockChangeListComponent} from '../../components/stock-change-list/stock-change-list.component';
import {UpdateExpiryDateComponent} from '../../components/update-expiry-date/update-expiry-date.component';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-view-product',
    templateUrl: './view-product.page.html',
    styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage implements OnInit, OnDestroy {
    product: ProductInterface;
    backButtonSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private productService: ProductService,
                private utilService: UtilService,
                private modalController: ModalController,
                private platform: Platform,
                private router: Router) {
        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
            const url = this.router.url.split('/');
            console.log(url);
            if (url[1] === 'view-product') {
                this.router.navigate(['/product']);
            }
        });
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

    async openStockChangesModal() {
        const modal = await this.modalController.create({
            component: StockChangeListComponent,
            componentProps: {
                product: this.product
            }
        });
        await modal.present();
    }

    async updateExpiryDate() {
        const modalExpiry = await this.modalController.create({
            component: UpdateExpiryDateComponent,
            componentProps: {
                product: this.product
            }
        });
        await modalExpiry.present();
    }

    ngOnDestroy() {
        if (this.backButtonSubscription) {
            this.backButtonSubscription.unsubscribe();
        }
    }

    ionViewDidLeave() {
        if (this.backButtonSubscription) {
            this.backButtonSubscription.unsubscribe();
        }
    }

}
