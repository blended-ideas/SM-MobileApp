import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductExpiryDateInterface, ProductInterface, ProductStockChangeInterface} from '../interfaces/product.interface';
import {Observable, Subject} from 'rxjs';
import {PaginatedResponseInterface} from '../interfaces/paginatedResponse.interface';
import {PRODUCT_APIS} from '../constants/api.constants';
import {ShiftDetailInterface} from '../interfaces/shift.interface';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService implements OnDestroy {
    productSubject = new Subject<{ type: string, product: ProductInterface, image?: string }>();

    constructor(private httpClient: HttpClient) {
    }

    getProducts(params?: HttpParams, link?: string): Observable<PaginatedResponseInterface<ProductInterface>> {
        if (link) {
            return this.httpClient.get<PaginatedResponseInterface<ProductInterface>>(link);
        }
        return this.httpClient.get<PaginatedResponseInterface<ProductInterface>>(PRODUCT_APIS.product, {params});
    }

    getProductById(id: string): Observable<ProductInterface> {
        return this.httpClient.get<ProductInterface>(`${PRODUCT_APIS.product}${id}/`);
    }


    createProducts(postObj: object): Observable<ProductInterface> {
        return this.httpClient.post<ProductInterface>(PRODUCT_APIS.product, postObj);
    }

    updateProduct(id: string, patchObj: object): Observable<ProductInterface> {
        return this.httpClient.patch<ProductInterface>(PRODUCT_APIS.product + id + '/', patchObj);
    }

    getProductObservable() {
        return this.productSubject.asObservable();
    }

    getProductStockChanges(params?: HttpParams, link?: string): Observable<PaginatedResponseInterface<ProductStockChangeInterface>> {
        if (link) {
            return this.httpClient.get<PaginatedResponseInterface<ProductStockChangeInterface>>(link);
        }
        return this.httpClient.get<PaginatedResponseInterface<ProductStockChangeInterface>>(PRODUCT_APIS.product_stock_change, {params});
    }

    addStock(productId: string, postBody: object): Observable<{ psu: ProductStockChangeInterface, new_stock: number }> {
        return this.httpClient.post<{ psu: ProductStockChangeInterface, new_stock: number }>(`${PRODUCT_APIS.product}${productId}/${PRODUCT_APIS.add_stock}`, postBody);
    }

    reduceStock(productId: string, postBody: object): Observable<{ psu: ProductStockChangeInterface, new_stock: number }> {
        return this.httpClient.post<{ psu: ProductStockChangeInterface, new_stock: number }>(`${PRODUCT_APIS.product}${productId}/${PRODUCT_APIS.reduce_stock}`, postBody);
    }

    getProductExpiryDates(params?: HttpParams, link?: string): Observable<PaginatedResponseInterface<ProductExpiryDateInterface>> {
        if (link) {
            return this.httpClient.get<PaginatedResponseInterface<ProductExpiryDateInterface>>(link);
        }
        return this.httpClient.get<PaginatedResponseInterface<ProductExpiryDateInterface>>(PRODUCT_APIS.product_expiry, {params});
    }

    postExpiry(postObj): Observable<ProductExpiryDateInterface> {
        return this.httpClient.post<ProductExpiryDateInterface>(PRODUCT_APIS.product_expiry, postObj);
    }

    ngOnDestroy(): void {
        console.log('product service: On Destroy');
        this.productSubject.complete();
    }
}
