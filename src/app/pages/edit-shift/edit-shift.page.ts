import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {faEdit, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {ShiftService} from '../../services/shift.service';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UtilService} from '../../services/util.service';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';
import {ModalController, Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {SessionService} from '../../services/session.service';

@Component({
    selector: 'app-edit-shift',
    templateUrl: './edit-shift.page.html',
    styleUrls: ['./edit-shift.page.scss'],
})
export class EditShiftPage implements OnInit, OnDestroy {
    selectedProducts: { id?: string, name: string, product: string, quantity: number, checked?: boolean, stock: number, condition: string }[] = [];
    faEdit = faEdit;
    faTimesCircle = faTimesCircle;
    shift: ShiftDetailInterface;
    shiftForm: FormGroup;
    today = new Date().toISOString();
    disableButton: boolean;
    isAdmin: boolean;
    @ViewChild('entryForm', {static: false}) entryForm: NgForm;
    backButtonSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private shiftService: ShiftService,
                private fb: FormBuilder,
                private utilService: UtilService,
                private router: Router,
                private modalController: ModalController,
                private platform: Platform,
                private sessionService: SessionService) {
        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
            const url = this.router.url.split('/');
            console.log(url);
            if (url[1] === 'edit-shift') {
                this.router.navigate(['/shift']);
            }
        });
    }

    ngOnInit() {
        this.isAdmin = this.sessionService.isAdmin();
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('shiftId')) {
                this.fetchShift(paramMap.get('shiftId'));
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
        this.shiftForm.controls['start_date'].disable();
        this.shiftForm.controls['end_date'].disable();
    }

    editShift() {
        if (this.shiftForm.invalid) {
            this.utilService.presentToast('Fill all the required fields', 3000);
            return;
        }
        console.log(this.entryForm);
        if (this.entryForm.invalid) {
            this.utilService.presentToast('Fill all the required fields', 3000);
            return;
        }
        // if (this.selectedProducts.length === 0) {
        //     this.utilService.presentToast('Select product', 3000);
        //     return;
        // }
        const formValue = this.shiftForm.getRawValue();
        if (formValue.start_date > formValue.end_date) {
            alert('Start date cannot be less than end date');
            return;
        }
        if (this.today < formValue.start_date || this.today < formValue.start_date) {
            alert('Start date and end date should be greater than current date-time');
            return;
        }
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
