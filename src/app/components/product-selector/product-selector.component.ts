import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ProductInterface} from '../../interfaces/product.interface';
import {HttpParams} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {ShiftService} from '../../services/shift.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-product-selector',
    templateUrl: './product-selector.component.html',
    styleUrls: ['./product-selector.component.scss'],
})
export class ProductSelectorComponent implements OnInit {
    @Input() shift: ShiftDetailInterface;
    isLoading: boolean;
    products: ProductInterface[] = [];
    selectedProduct: ProductInterface;
    searchText: string;
    next: string;
    productListForm: FormGroup;
    faTimesCircle = faTimesCircle;

    constructor(private modalController: ModalController,
                private productService: ProductService,
                private utilService: UtilService,
                private barcodeScanner: BarcodeScanner,
                private shiftService: ShiftService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.productListForm = this.fb.group({
            entries: this.fb.array([])
        });
    }

    fetchProducts(emptyArray?: boolean, link?: string, infiniteScroll?: any) {
        this.isLoading = true;
        // this.utilService.presentLoading('Loading Products...');
        if (emptyArray) {
            this.products = [];
        }
        let params = new HttpParams().set('page_size', '10');
        if (this.searchText) {
            params = params.set('search', this.searchText);
        } else {
            return;
        }
        this.productService.getProducts(params, link).subscribe(response => {
            this.products = this.products.concat(...response.results);
            this.products.map((p) => {
                p.checked = false;
                p.condition = 'NEW';
            });
            console.log(this.products);
            this.next = response.next;
            this.isLoading = false;
            // this.utilService.dismissLoading();
        }, () => {
            // this.utilService.dismissLoading();
            this.isLoading = false;
        });
    }

    // addProductToShiftList() {
    //     // TODO: Make Call to backend
    //     const productArray = this.products.filter(p => p.checked).map(entry => ({
    //         product: entry.id,
    //         quantity: 1,
    //     }));
    //     this.shiftService.addProductsToShift(this.shift.id, {entries: productArray}).subscribe(response => {
    //         this.shift = response;
    //         this.dismiss(true);
    //     }, (error) => {
    //         console.log(error);
    //     });
    // }
    addProductToShiftList() {
        // TODO: Make Call to backend
        const productArray = this.productListForm.value.entries.map(entry => ({
            product: entry.product.id,
            quantity: entry.quantity,
        }));
        this.shiftService.addProductsToShift(this.shift.id, {entries: productArray}).subscribe(response => {
            this.shift = response;
            this.dismiss(true);
        }, (error) => {
            console.log(error);
        });
    }

    addProduct(product: ProductInterface) {
        this.searchText = '';
        this.products = [];
        if (product) {
            const shiftEntries = this.productListForm.controls.entries as FormArray;
            if (shiftEntries.getRawValue().some(e => e.product.id === product.id)) {
                return;
            }

            shiftEntries.push(this.fb.group({
                product: [product],
                quantity: [1, [Validators.required, Validators.min(1)]]
            }));
        }
    }

    dismiss(boolVal) {
        boolVal ? this.modalController.dismiss(this.shift) : this.modalController.dismiss();
    }

    removeProductEntry(index: number) {
        (this.productListForm.controls.entries as FormArray).removeAt(index);
    }

    getProductControls(): AbstractControl[] {
        return (this.productListForm.controls.entries as FormArray).controls;
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
