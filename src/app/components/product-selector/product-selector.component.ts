import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ProductInterface} from '../../interfaces/product.interface';
import {ParamMap} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {ShiftService} from '../../services/shift.service';

@Component({
    selector: 'app-product-selector',
    templateUrl: './product-selector.component.html',
    styleUrls: ['./product-selector.component.scss'],
})
export class ProductSelectorComponent implements OnInit {
    // @Input() selectedProducts: { id?: string, name: string, product: string, quantity: number, checked?: boolean, stock: number, condition: string }[] = [];
    @Input() shift: ShiftDetailInterface;
    isLoading: boolean;
    products: ProductInterface[] = [];
    searchText: string;
    next: string;

    constructor(private modalController: ModalController,
                private productService: ProductService,
                private utilService: UtilService,
                private barcodeScanner: BarcodeScanner,
                private shiftService: ShiftService) {
    }

    ngOnInit() {
        // console.log(this.selectedProducts);
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
            // if (this.selectedProducts.length > 0) {
            //     this.selectedProducts.forEach((sp) => {
            //         const prd = this.products.find(p => p.id === sp.product);
            //         if (prd) {
            //             prd.checked = true;
            //             prd.condition = 'EDIT';
            //         }
            //     });
            // }
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

    addProductToShiftList() {
        // TODO: Make Call to backend
        const productArray = this.products.filter(p => p.checked).map(entry => ({
            product: entry.id,
            quantity: 1,
        }));
        this.shiftService.addProductsToShift(this.shift.id, {entries: productArray}).subscribe(response => {
            this.shift = response;
            this.dismiss(true);
        }, (error) => {
            console.log(error);
        });
    }


    dismiss(boolVal) {
        // const prds = this.products.filter(p => p.checked && p.condition !== 'EDIT') || [];
        // console.log(prds);
        // if (prds.length > 0) {
        //     this.selectedProducts = this.selectedProducts.concat(...prds.map(sp => ({
        //         product: sp.id,
        //         quantity: sp.quantity,
        //         name: sp.name,
        //         checked: sp.checked,
        //         stock: sp.stock,
        //         condition: 'NEW'
        //     })));
        // }
        // console.log(this.selectedProducts);
        boolVal ? this.modalController.dismiss(this.shift) : this.modalController.dismiss();
    }


    doInfiniteScroll(infiniteScroll) {
        this.fetchProducts(false, this.next, infiniteScroll);
    }

    onCancelSearch(ev) {
        this.searchText = '';
    }

    barCodeScan() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data', barcodeData);
            this.searchText = barcodeData.text;
            if (this.searchText) {
                this.fetchProducts(true);
            }
        }).catch(err => {
            console.log('Error', err);
        });
    }
}
