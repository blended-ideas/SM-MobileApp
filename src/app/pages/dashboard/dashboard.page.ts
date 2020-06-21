import {Component, OnInit} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {ProductExpiryDateInterface} from '../../interfaces/product.interface';
import {ReportService} from '../../services/report.service';
import {Plugins} from '@capacitor/core';

const {Browser} = Plugins;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    productExpiryLoading: boolean;
    productExpiryDates: ProductExpiryDateInterface[];
    next: string;
    isReportDownloading: boolean;

    constructor(private productService: ProductService,
                private reportService: ReportService) {
    }

    async ngOnInit() {
        this.getProductExpiryDates(true);
    }

    getProductExpiryDates(emptyArray: boolean, link?: string, infiniteScroll?: any) {
        if (emptyArray) {
            this.productExpiryDates = [];
        }
        const params = new HttpParams()
            .set('page_size', '20')
            .set('after_today', 'true');
        this.productExpiryLoading = true;
        this.productService.getProductExpiryDates(params, link).subscribe(response => {
            this.productExpiryLoading = false;
            this.productExpiryDates = this.productExpiryDates.concat(...response.results);
            this.next = response.next;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        }, () => {
            this.productExpiryLoading = false;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        });
    }

    doInfiniteScroll(infiniteScroll) {
        this.getProductExpiryDates(false, this.next, infiniteScroll);
    }

    downloadExpiryReport() {
        const NO_DAYS = 10;
        this.isReportDownloading = true;
        this.reportService.downloadExpiryReport(NO_DAYS).subscribe(async (response) => {
            await Browser.open({url: response.file, windowName: '_blank'});
            this.isReportDownloading = false;
        }, () => {
            this.isReportDownloading = false;
        });
    }

}
