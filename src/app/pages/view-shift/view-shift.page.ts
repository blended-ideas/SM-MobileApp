import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShiftService} from '../../services/shift.service';
import {ShiftDetailInterface, ShiftEntryInterface} from '../../interfaces/shift.interface';
import {UtilService} from '../../services/util.service';
import {SessionService} from '../../services/session.service';
import {faCheck, faEdit} from '@fortawesome/free-solid-svg-icons';
import {AlertController, ModalController, Platform, PopoverController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {QuantityUpdatePopOverComponent} from '../../components/quantity-update-pop-over/quantity-update-pop-over.component';
import {ProductSelectorComponent} from '../../components/product-selector/product-selector.component';

@Component({
    selector: 'app-view-shift',
    templateUrl: './view-shift.page.html',
    styleUrls: ['./view-shift.page.scss'],
})
export class ViewShiftPage implements OnInit, OnDestroy {
    shift: ShiftDetailInterface;
    allowEdit: boolean;
    faEdit = faEdit;
    faCheck = faCheck;
    isAdmin: boolean;
    isAuditor: boolean;
    backButtonSubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private shiftService: ShiftService,
                private utilService: UtilService,
                private sessionService: SessionService,
                private alertController: AlertController,
                private platform: Platform,
                private router: Router,
                private popoverController: PopoverController,
                private modalController: ModalController) {
        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
            const url = this.router.url.split('/');
            console.log(url);
            if (url[1] === 'view-shift') {
                this.router.navigate(['/shift']);
            }
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('shiftId')) {
                this.fetchShiftById(paramMap.get('shiftId'));
            }
        });
        this.isAuditor = this.sessionService.isAuditor();
        this.isAdmin = this.sessionService.isAdmin();
    }

    fetchShiftById(id) {
        this.utilService.presentLoading('Fetching Shift Detail');
        this.shiftService.getShiftById(id).subscribe(response => {
            this.shift = response;
            this.computeShiftEntryValues();
            this.checkAllowEdit();
            this.utilService.dismissLoading();
        }, () => {
            this.utilService.dismissLoading();
        });
    }

    async approveShift() {
        const alert = await this.alertController.create({
            header: 'Approve Shift?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Approve',
                    handler: () => {
                        this.shiftService.approveShift(this.shift.id).subscribe(response => {
                            this.shift = response;
                            this.computeShiftEntryValues();
                            this.utilService.presentToast('Shift Approved', 3000);
                        });
                    }
                }
            ]
        });
        await alert.present();

    }

    async closeShift() {
        const alert = await this.alertController.create({
            header: 'Close Shift?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Close',
                    handler: () => {
                        this.shiftService.closeShift(this.shift.id).subscribe(response => {
                            this.shift = response;
                            this.computeShiftEntryValues();
                            this.utilService.presentToast('Shift Closed. Waiting for approval', 3000);
                        });
                    }
                }
            ]
        });
        await alert.present();
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

    async quantityUpdate(entry: ShiftEntryInterface) {
        const popOver = await this.popoverController.create({
            component: QuantityUpdatePopOverComponent,
            componentProps: {
                entry
            }
        });
        await popOver.present();
        await popOver.onDidDismiss().then(data => {
            if (data.data) {
                entry = data.data;
                this.fetchShiftById(this.shift.id);
            }
        });
    }

    async selectProducts() {
        const modal = await this.modalController.create({
            component: ProductSelectorComponent,
            componentProps: {
                shift: this.shift
            }
        });
        await modal.present();
        await modal.onDidDismiss().then(data => {
            console.log(data.data);
            if (data.data) {
                // this.selectedProducts = data.data;
                this.shift = data.data;
                this.fetchShiftById(this.shift.id);
            }
        });
    }

    private checkAllowEdit() {
        this.allowEdit = (this.sessionService.isAuditor() && !this.shift.approved) || this.sessionService.isAdmin();
    }

    private computeShiftEntryValues() {
        this.shift.entries.forEach(entry => {
            entry.entry_total = entry.price * entry.quantity;
        });
    }
}
