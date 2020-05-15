import {Component, OnInit} from '@angular/core';
import {faEdit, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {ModalController} from '@ionic/angular';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';
import {ProductInterface} from '../../interfaces/product.interface';

@Component({
    selector: 'app-create-shift',
    templateUrl: './create-shift.page.html',
    styleUrls: ['./create-shift.page.scss'],
})
export class CreateShiftPage implements OnInit {
    faPlusSquare = faPlusSquare;
    faEdit = faEdit;
    mode: 'Create' | 'Edit' = 'Create';
    shiftForm: FormGroup;
    shift: ShiftDetailInterface;
    today = new Date().toISOString();
    validationMessages = {
        start_date: [],
        start_time: [],
        end_date: [],
        end_time: [],
        entries: [],
    };
    selectedProducts: ProductInterface[];

    constructor(private fb: FormBuilder,
                private modalController: ModalController) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.shiftForm = this.fb.group({
            start_date: [this.today, Validators.required],
            end_date: [this.today, Validators.required],
            entries: this.fb.array([])
        });
    }

    createShift() {
        this.shiftForm.markAllAsTouched();
        if (this.shiftForm.invalid) {
            return;
        }
    }

    async selectProducts() {
        const modal = await this.modalController.create({
            component: ProductSelectorComponent,
            componentProps: {
                selectedProducts: this.selectedProducts
            }
        });
        await modal.present();
        await modal.onDidDismiss().then(data => {
            this.selectedProducts = data.data.selectedProducts;
        });
    }

}
