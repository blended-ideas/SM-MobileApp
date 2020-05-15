import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ProductInterface} from '../../interfaces/product.interface';
import {ParamMap} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-product-selector',
    templateUrl: './product-selector.component.html',
    styleUrls: ['./product-selector.component.scss'],
})
export class ProductSelectorComponent implements OnInit {
    @Input() selectedProducts: ProductInterface[] = [];
    isLoading: boolean;
    products: ProductInterface[] = [];
    searchText: string;
    next: string;

    constructor(private modalController: ModalController,
                private productService: ProductService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.fetchProducts(true);
    }

    fetchProducts(emptyArray?: boolean, link?: string, infiniteScroll?: any) {
        this.isLoading = true;
        this.utilService.presentLoading('Loading Products...');
        if (emptyArray) {
            this.products = [];
        }
        let params = new HttpParams().set('page_size', '10');
        if (this.searchText) {
            params = params.set('search', this.searchText);
        }
        this.productService.getProducts(params, link).subscribe(response => {
            this.products = this.products.concat(...response.results);
            this.products.map(p => p.checked = false);
            if (this.selectedProducts.length > 0) {
                this.selectedProducts.forEach((sp) => {
                    const prd = this.products.find(p => p.id === sp.id);
                    if (prd) {
                        prd.checked = true;
                    }
                });
            }
            this.next = response.next;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
            this.isLoading = false;
            this.utilService.dismissLoading();
        }, () => {
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
            this.utilService.dismissLoading();
            this.isLoading = false;
        });
    }


    dismiss(boolVal) {
        boolVal ? this.modalController.dismiss({selectedProducts: this.products.filter(p => p.checked)}) : this.modalController.dismiss();
    }


    doInfiniteScroll(infiniteScroll) {
        this.fetchProducts(false, this.next, infiniteScroll);
    }

}
