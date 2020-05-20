import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShiftService} from '../../services/shift.service';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-view-shift',
    templateUrl: './view-shift.page.html',
    styleUrls: ['./view-shift.page.scss'],
})
export class ViewShiftPage implements OnInit {
    shift: ShiftDetailInterface;

    constructor(private route: ActivatedRoute,
                private shiftService: ShiftService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('shiftId')) {
                this.fetchShiftById(paramMap.get('shiftId'));
            }
        });
    }

    fetchShiftById(id) {
        this.utilService.presentLoading('Fetching Shift Detail');
        this.shiftService.getShiftById(id).subscribe(response => {
            this.shift = response;
            this.utilService.dismissLoading();
        }, () => {
            this.utilService.dismissLoading();
        });
    }

}
