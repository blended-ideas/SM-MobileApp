import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShiftService} from '../../services/shift.service';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {UtilService} from '../../services/util.service';
import {SessionService} from '../../services/session.service';
import {faCheck, faEdit} from '@fortawesome/free-solid-svg-icons';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-view-shift',
    templateUrl: './view-shift.page.html',
    styleUrls: ['./view-shift.page.scss'],
})
export class ViewShiftPage implements OnInit {
    shift: ShiftDetailInterface;
    allowEdit: boolean;
    faEdit = faEdit;
    faCheck = faCheck;
    isAdmin: boolean;
    isAuditor: boolean;

    constructor(private route: ActivatedRoute,
                private shiftService: ShiftService,
                private utilService: UtilService,
                private sessionService: SessionService,
                private alertController: AlertController) {
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
            this.shift.entries.forEach(entry => {
                entry.entry_total = entry.price * entry.quantity;
            });
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
                            this.checkAllowEdit();
                            this.utilService.presentToast('Shift Approved', 3000);
                        });
                    }
                }
            ]
        });
        await alert.present();

    }

    private checkAllowEdit() {
        this.allowEdit = (this.sessionService.isAuditor() && !this.shift.approved) || this.sessionService.isAdmin();
    }
}
