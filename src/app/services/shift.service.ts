import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ShiftDetailInterface, ShiftEntryInterface} from '../interfaces/shift.interface';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SHIFT_APIS} from '../constants/api.constants';
import {PaginatedResponseInterface} from '../interfaces/paginatedResponse.interface';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ShiftService implements OnDestroy {
    shiftSubject = new Subject<{ type: string, shift: ShiftDetailInterface }>();

    constructor(private httpClient: HttpClient) {
    }

    getShifts(params?: HttpParams, link?: string): Observable<PaginatedResponseInterface<ShiftDetailInterface>> {
        if (link) {
            return this.httpClient.get<PaginatedResponseInterface<ShiftDetailInterface>>(link);
        }
        return this.httpClient.get<PaginatedResponseInterface<ShiftDetailInterface>>(SHIFT_APIS.detail, {params});
    }

    createShift(postObj: object): Observable<ShiftDetailInterface> {
        return this.httpClient.post<ShiftDetailInterface>(SHIFT_APIS.detail, postObj).pipe(tap(response => {
            this.shiftSubject.next({type: 'create', shift: response});
        }));
    }

    updateShift(id: string, patchObj: object): Observable<ShiftDetailInterface> {
        return this.httpClient.patch<ShiftDetailInterface>(SHIFT_APIS.detail + id + '/', patchObj).pipe(tap(response => {
            this.shiftSubject.next({type: 'update', shift: response});
        }));
    }

    getShiftObservable() {
        return this.shiftSubject.asObservable();
    }

    getShiftById(id: string): Observable<ShiftDetailInterface> {
        return this.httpClient.get<ShiftDetailInterface>(`${SHIFT_APIS.detail}${id}/`);
    }

    approveShift(shiftId: string) {
        return this.httpClient.patch<ShiftDetailInterface>(`${SHIFT_APIS.detail}${shiftId}/${SHIFT_APIS.approve}/`, {});
    }

    closeShift(shiftId: string) {
        return this.httpClient.patch<ShiftDetailInterface>(`${SHIFT_APIS.detail}${shiftId}/${SHIFT_APIS.close_shift}/`, {});
    }

    ngOnDestroy(): void {
        console.log('shift service: On Destroy');
        this.shiftSubject.complete();
    }

    updateShiftEntry(shiftEntryId, patchObj: object): Observable<ShiftEntryInterface> {
        return this.httpClient.patch<ShiftEntryInterface>(`${SHIFT_APIS.entry}${shiftEntryId}/`, patchObj);
    }

    addProductsToShift(shiftId: string, products: object) {
        return this.httpClient.patch<ShiftDetailInterface>(`${SHIFT_APIS.detail}${shiftId}/${SHIFT_APIS.add_products}/`, products);
    }

}
