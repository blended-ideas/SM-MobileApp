import {Component, OnInit} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ReportService} from '../../services/report.service';
import {MarginInterface} from '../../interfaces/margin.interface';

@Component({
    selector: 'app-margin',
    templateUrl: './margin.page.html',
    styleUrls: ['./margin.page.scss'],
})
export class MarginPage implements OnInit {
    selectedDay: string;
    isLoading: boolean;
    margin: MarginInterface;

    constructor(private reportService: ReportService) {
    }

    ngOnInit() {
        this.selectedDay = new Date().toISOString();
    }

    private getDayMargin() {
        this.isLoading = true;
        const params = new HttpParams()
            .set('day', this.selectedDay);
        this.reportService.getDailyReport(params).subscribe(response => {
            this.isLoading = false;
            this.margin = response;
        });
    }
}
