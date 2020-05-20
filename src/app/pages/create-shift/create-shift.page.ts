import {Component, OnInit, ViewChild} from '@angular/core';
import {faEdit, faPlusSquare, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {ModalController} from '@ionic/angular';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';
import {ProductInterface} from '../../interfaces/product.interface';
import {UtilService} from '../../services/util.service';
import {SessionService} from '../../services/session.service';
import {ShiftService} from '../../services/shift.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-create-shift',
    templateUrl: './create-shift.page.html',
    styleUrls: ['./create-shift.page.scss'],
})
export class CreateShiftPage implements OnInit {
    faPlusSquare = faPlusSquare;
    faEdit = faEdit;
    faTimesCircle = faTimesCircle;
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
    selectedProducts: { id?: string, name: string, product: string, quantity: number, checked?: boolean, stock: number, condition: string }[] = [];
    @ViewChild('entryForm', {static: false}) entryForm: NgForm;
    disableButton: boolean;

    constructor(private fb: FormBuilder,
                private modalController: ModalController,
                private utilService: UtilService,
                private sessionService: SessionService,
                private shiftService: ShiftService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('shiftId')) {
                this.mode = 'Edit';
                this.fetchShift(paramMap.get('shiftId'));
            } else {
                this.buildForm();
            }
        });
    }

    fetchShift(id) {
        this.shiftService.getShiftById(id).subscribe(response => {
            this.shift = response;
            console.log(this.shift);
            if (this.shift) {
                this.buildForm();
            }
        });
    }

    buildForm() {
        this.shiftForm = this.fb.group({
            start_date: [this.shift && this.shift.start_dt ? this.shift.start_dt : this.today, Validators.required],
            end_date: [this.shift && this.shift.end_dt ? this.shift.end_dt : this.today, Validators.required],
        });
        this.selectedProducts = this.shift && this.shift.entries.length !== 0 ? this.shift.entries.map(e => ({
            id: e.id,
            name: e.product_name,
            product: e.product,
            quantity: e.quantity,
            checked: true,
            stock: e.product_available_stock,
            condition: 'EDIT'
        })) : [];
    }

    createShift() {
        this.shiftForm.markAllAsTouched();
        if (this.shiftForm.invalid) {
            this.utilService.presentToast('Fill all the required fields', 3000);
            return;
        }
        console.log(this.entryForm);
        if (this.entryForm.invalid) {
            this.utilService.presentToast('Fill all the required fields', 3000);
            return;
        }
        if (this.selectedProducts.length === 0) {
            this.utilService.presentToast('Select product', 3000);
            return;
        }
        const formValue = this.shiftForm.getRawValue();
        if (formValue.start_date > formValue.end_date) {
            alert('Start date cannot be less than end date');
            return;
        }
        if (this.today < formValue.start_date || this.today < formValue.start_date) {
            alert('Start date and end date should be greater than current date-time');
            return;
        }
        console.log(this.selectedProducts);
        console.log(this.selectedProducts.map(p => ({product: p.product, quantity: p.quantity})));
        this.utilService.presentLoading(this.mode === 'Create' ? 'Creating shift' : 'Saving shift');
        if (this.mode === 'Create') {
            const postObj = {
                user: this.sessionService.user.id,
                start_dt: formValue.start_date,
                end_dt: formValue.end_date,
                entries: this.selectedProducts.map(p => ({product: p.product, quantity: p.quantity}))
            };
            this.shiftService.createShift(postObj).subscribe(response => {
                this.utilService.presentToast('Shift Created Successfully', 2000);
                this.utilService.dismissLoading();
                this.router.navigate(['/shift']);
            }, () => {
                this.utilService.dismissLoading();
            });
        } else {
            const patchObj = {
                start_dt: formValue.start_date,
                end_dt: formValue.end_date,
                entries: this.selectedProducts.map(p => ({
                    id: p.id,
                    product: p.product,
                    quantity: p.quantity,
                    product_name: p.name,
                    condition: p.condition
                }))
            };
            this.shiftService.updateShift(this.shift.id, patchObj).subscribe(response => {
                this.utilService.presentToast('Shift Updated Successfully', 2000);
                this.utilService.dismissLoading();
                this.router.navigate(['/shift']);
            }, () => {
                this.utilService.dismissLoading();
            });
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
            console.log(data.data);
            if (data.data) {
                this.selectedProducts = data.data;
            }
        });
    }

    removeProductFromList(product) {
        const index = this.selectedProducts.findIndex(sp => sp.id === product.id);
        if (index > -1) {
            this.selectedProducts.splice(index, 1);
        }
    }

}
