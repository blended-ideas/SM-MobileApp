import {Component, OnInit} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ReportService} from '../../services/report.service';
import {MarginInterface} from '../../interfaces/margin.interface';
import {UtilService} from '../../services/util.service';
import * as moment from 'moment';

@Component({
    selector: 'app-margin',
    templateUrl: './margin.page.html',
    styleUrls: ['./margin.page.scss'],
})
export class MarginPage implements OnInit {
    selectedDay: string;
    dayString: string;
    weekString: string;
    monthString: string;
    quarterString: string;
    isLoading: boolean;
    margin: MarginInterface;

    constructor(private reportService: ReportService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        const momentObj = moment(this.selectedDay);
        this.dayString = momentObj.format('DD/MM/yyyy');
        this.weekString = momentObj.startOf('week').format('DD/MM/yyyy') + ' - ' + momentObj.endOf('week').format('DD/MM/yyyy');
        this.monthString = momentObj.startOf('month').format('DD/MM/yyyy') + ' - ' + momentObj.endOf('month').format('DD/MM/yyyy');
        this.quarterString = momentObj.startOf('quarter').format('DD/MM/yyyy') + ' - ' + momentObj.endOf('quarter').format('DD/MM/yyyy');

        this.selectedDay = new Date(new Date().setHours(0, 0, 0)).toISOString();
        this.getDayMargin();
    }

    private getDayMargin() {
        const date = new Date(new Date(this.selectedDay).setHours(0, 0, 0)).toISOString();
        this.isLoading = true;
        this.utilService.presentLoading('Loading margin records');
        const params = new HttpParams()
            .set('day', date);
        this.reportService.getDailyReport(params).subscribe(response => {
            this.margin = response;
            console.log(this.margin);
            this.isLoading = false;
            this.utilService.dismissLoading();
        }, () => {
            this.isLoading = false;
            this.utilService.dismissLoading();
        });
    }
}
