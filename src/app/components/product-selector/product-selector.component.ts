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
    @Input() selectedProducts: { id?: string, name: string, product: string, quantity: number, checked?: boolean, stock: number, condition: string }[] = [];
    isLoading: boolean;
    products: ProductInterface[] = [];
    searchText: string;
    next: string;

    constructor(private modalController: ModalController,
                private productService: ProductService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        console.log(this.selectedProducts);
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
            this.products.map((p) => {
                p.checked = false;
                p.condition = 'NEW';
            });
            if (this.selectedProducts.length > 0) {
                this.selectedProducts.forEach((sp) => {
                    const prd = this.products.find(p => p.id === sp.product);
                    if (prd) {
                        prd.checked = true;
                        prd.condition = 'EDIT';
                    }
                });
            }
            console.log(this.products);
            this.next = response.next;
            // if (infiniteScroll) {
            //     infiniteScroll.target.complete();
            // }
            this.isLoading = false;
            this.utilService.dismissLoading();
        }, () => {
            // if (infiniteScroll) {
            //     infiniteScroll.target.complete();
            // }
            this.utilService.dismissLoading();
            this.isLoading = false;
        });
    }


    dismiss(boolVal) {
        const prds = this.products.filter(p => p.checked && p.condition !== 'EDIT') || [];
        console.log(prds);
        if (prds.length > 0) {
            this.selectedProducts = this.selectedProducts.concat(...prds.map(sp => ({
                product: sp.id,
                quantity: sp.quantity,
                name: sp.name,
                checked: sp.checked,
                stock: sp.stock,
                condition: 'NEW'
            })));
        }
        console.log(this.selectedProducts);
        boolVal ? this.modalController.dismiss(this.selectedProducts) : this.modalController.dismiss();
    }


    doInfiniteScroll(infiniteScroll) {
        this.fetchProducts(false, this.next, infiniteScroll);
    }

}
