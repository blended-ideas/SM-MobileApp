import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MarginInterface} from '../interfaces/margin.interface';
import {ExpiryReportInterface, SalesReportInterface} from '../interfaces/report.interface';
import {REPORT_APIS} from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private httpClient: HttpClient) {
    }

    getDailyReport(params: HttpParams): Observable<MarginInterface> {
        return this.httpClient.get<MarginInterface>(REPORT_APIS.daily, {params});
    }

    downloadExpiryReport(days: number): Observable<ExpiryReportInterface> {
        return this.httpClient.post<ExpiryReportInterface>(REPORT_APIS.product_expiry_report, {days});
    }

    downloadSalesReport(postObj: object): Observable<SalesReportInterface> {
        return this.httpClient.post<SalesReportInterface>(REPORT_APIS.sales_report, postObj);
    }

    downloadMarginReport(postObj: object): Observable<SalesReportInterface> {
        return this.httpClient.post<SalesReportInterface>(REPORT_APIS.margin_report, postObj);
    }
}
