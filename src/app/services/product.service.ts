import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductInterface} from '../interfaces/product.interface';
import {Observable} from 'rxjs';
import {PaginatedResponseInterface} from '../interfaces/paginatedResponse.interface';
import {PRODUCT_APIS} from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

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

}
