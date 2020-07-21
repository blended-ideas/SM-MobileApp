import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {faPlusSquare, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {ModalController, Platform} from '@ionic/angular';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';
import {UtilService} from '../../services/util.service';
import {SessionService} from '../../services/session.service';
import {ShiftService} from '../../services/shift.service';
import {Router} from '@angular/router';
import {SHIFT_TIMINGS, ShiftSelectionInterface} from 'src/app/constants/shift.constants';
import * as moment from 'moment';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-create-shift',
    templateUrl: './create-shift.page.html',
    styleUrls: ['./create-shift.page.scss'],
})
export class CreateShiftPage implements OnInit, OnDestroy {
    faPlusSquare = faPlusSquare;
    faTimesCircle = faTimesCircle;
    shiftView: {
        startTime: Date
        endTime: Date
    };
    today: string;
    selectedProducts: { id?: string, name: string, product: string, quantity: number, checked?: boolean, stock: number, condition: string }[] = [];
    disableButton: boolean;
    SHIFT_TIMINGS = SHIFT_TIMINGS;
    selectedShiftTiming = SHIFT_TIMINGS[0];
    shiftDate: any;
    isCreating: boolean;
    @ViewChild('shiftForm', {static: false}) shiftForm: NgForm;
    backButtonSubscription: Subscription;

    constructor(private modalController: ModalController,
                private utilService: UtilService,
                private sessionService: SessionService,
                private shiftService: ShiftService,
                private router: Router,
                private platform: Platform) {
        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
            const url = this.router.url.split('/');
            console.log(url);
            if (url[1] === 'create-shift') {
                this.router.navigate(['/shift']);
            }
        });
    }

    ngOnInit() {
        this.today = new Date().toISOString();
        this.shiftDate = new Date().toISOString();
        this.shiftChange(this.selectedShiftTiming);
    }

    shiftChange(shiftTime: ShiftSelectionInterface) {
        const dt = new Date(this.shiftDate);
        const strtDate = new Date(
            dt.getUTCFullYear(),
            dt.getUTCMonth(),
            dt.getUTCDate(),
            shiftTime.time_start_hour,
            0,
            0);
        this.shiftView = {
            startTime: strtDate,
            endTime: (moment(strtDate).add(shiftTime.number_of_hours, 'hours')).toDate()
        };
    }

    createShift() {
        if (this.shiftForm && this.shiftForm.invalid) {
            this.utilService.presentToast('Fill all the required fields', 3000);
            return;
        }
        const dateNow = new Date();
        if (this.shiftView.startTime > this.shiftView.endTime) {
            this.utilService.presentToast('End date/time cannot be less than start date/time', 3000);
            return;
        }
        if (dateNow < this.shiftView.startTime) {
            this.utilService.presentToast('Start date and end date should be greater than current date-time', 3000);
            return;
        }
        const postObj = {
            user: this.sessionService.user.id,
            start_dt: this.shiftView.startTime.toISOString(),
            end_dt: this.shiftView.endTime.toISOString(),
            entries: this.selectedProducts.map(p => ({
                product: p.product,
                quantity: p.quantity,
            }))
        };
        this.shiftService.createShift(postObj).subscribe(response => {
            this.utilService.presentToast('Shift Created Successfully', 2000);
            this.utilService.dismissLoading();
            this.router.navigate(['/view-shift', response.id]);
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
