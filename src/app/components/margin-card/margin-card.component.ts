import {Component, Input, OnInit} from '@angular/core';
import {MarginDataInterface} from '../../interfaces/margin.interface';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {ReportService} from '../../services/report.service';
import {Plugins} from '@capacitor/core';

const {Browser} = Plugins;

@Component({
    selector: 'app-margin-card',
    templateUrl: './margin-card.component.html',
    styleUrls: ['./margin-card.component.scss'],
})
export class MarginCardComponent implements OnInit {
    @Input() date_string: string;
    @Input() substring: string;
    @Input() title: string;
    @Input() report_type: string;
    @Input() marginData: MarginDataInterface;
    faDownload = faDownload;
    isMarginReportLoading: boolean;
    isSalesReportLoading: boolean;

    constructor(private reportService: ReportService) {

    }

    ngOnInit() {
    }

    downloadSalesReport() {
        const postObj = {date: this.date_string, report_type: this.report_type};
        this.isSalesReportLoading = true;
        this.reportService.downloadSalesReport(postObj).subscribe(async (response) => {
            this.isSalesReportLoading = false;
            await Browser.open({url: response.file, windowName: '_blank'});
        }, () => {
            this.isSalesReportLoading = false;
        });
    }

    downloadMarginReport() {
        const postObj = {date: this.date_string, report_type: this.report_type};
        this.isMarginReportLoading = true;
        this.reportService.downloadMarginReport(postObj).subscribe(async (response) => {
            await Browser.open({url: response.file, windowName: '_blank'});
            this.isMarginReportLoading = false;
        }, () => {
            this.isMarginReportLoading = false;
        });
    }

}
