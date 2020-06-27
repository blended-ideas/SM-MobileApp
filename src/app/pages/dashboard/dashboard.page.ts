import {Component, OnInit} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ProductService} from '../../services/product.service';
import {ProductExpiryDateInterface} from '../../interfaces/product.interface';
import {ReportService} from '../../services/report.service';
import {Plugins} from '@capacitor/core';
import {SessionService} from '../../services/session.service';
import {
    faFileExcel,
    faPenAlt,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';

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
    isLoggedIn: boolean;
    viewMargin: boolean;
    faFileExcel = faFileExcel;
    faPenAlt = faPenAlt;
    faShoppingCart = faShoppingCart;

    constructor(private productService: ProductService,
                private reportService: ReportService,
                private sessionService: SessionService) {
    }

    async ngOnInit() {
        this.initializeApp();
    }

    async initializeApp() {
        this.isLoggedIn = await this.sessionService.isLoggedIn(true);
        this.viewMargin = this.sessionService.isAdmin() || this.sessionService.isAuditor();
        this.getProductExpiryDates(true);
    }

    getProductExpiryDates(emptyArray: boolean, link?: string, infiniteScroll?: any) {
        if (emptyArray) {
            this.productExpiryDates = [];
        }
        const params = new HttpParams()
            .set('page_size', '20')
            .set('after_today', 'true')
            .set('home_display', 'true');
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

    downloadExpiryReport(downloadAll: boolean) {
        const NO_DAYS = 10;
        this.isReportDownloading = true;
        this.reportService.downloadExpiryReport(NO_DAYS, downloadAll).subscribe(async (response) => {
            await Browser.open({url: response.file, windowName: '_blank'});
            this.isReportDownloading = false;
        }, () => {
            this.isReportDownloading = false;
        });
    }

}
