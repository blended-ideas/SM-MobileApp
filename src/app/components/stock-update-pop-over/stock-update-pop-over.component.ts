import {Component, Input, OnInit} from '@angular/core';
import {ProductInterface, ProductStockChangeInterface} from '../../interfaces/product.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {Observable} from 'rxjs';
import {PopoverController} from '@ionic/angular';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-stock-update-pop-over',
    templateUrl: './stock-update-pop-over.component.html',
    styleUrls: ['./stock-update-pop-over.component.scss'],
})
export class StockUpdatePopOverComponent implements OnInit {
    @Input() type: 'ADD' | 'REMOVE';
    @Input() product: ProductInterface;
    stockAfterUpdate = 0;
    stockChangeForm: FormGroup;
    isUpdating: boolean;

    constructor(private fb: FormBuilder,
                private productService: ProductService,
                private popoverController: PopoverController,
                private utilService: UtilService) {
    }

    ngOnInit() {
        const changeValueValidator = [Validators.min(1)];
        if (this.type === 'REMOVE') {
            changeValueValidator.push(Validators.max(this.product.stock));
        }
        this.stockChangeForm = this.fb.group({
            changeValue: [0, changeValueValidator]
        });

        this.stockChangeForm.controls.changeValue.valueChanges.subscribe(value => {
            this.stockAfterUpdate = Number(this.product.stock) + ((this.type === 'ADD' ? 1 : -1) * Number(value));
        });
    }

    updateStock() {
        this.isUpdating = true;
        let request: Observable<{ psu: ProductStockChangeInterface, new_stock: number }>;

        if (this.type === 'ADD') {
            request = this.productService.addStock(this.product.id, this.stockChangeForm.value);
        } else if (this.type === 'REMOVE') {
            request = this.productService.reduceStock(this.product.id, this.stockChangeForm.value);
        } else {
            return;
        }

        request.subscribe(response => {
            this.utilService.presentToast('Stock Added..', 2000);
            this.isUpdating = false;
            this.dismiss(response);
        }, er => {
            let errStr = 'Something went wrong while updating the stock';
            if (er.status === 400) {
                const keys = Object.keys(er.error);
                errStr = er.error[keys[0]][0];
            }
            this.utilService.presentToast(errStr, 2000);
            this.isUpdating = false;
        });
    }

    dismiss(data) {
        this.popoverController.dismiss(data);
    }
}
