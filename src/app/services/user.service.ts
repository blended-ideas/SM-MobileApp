import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInterface} from '../interfaces/user.interface';
import {USER_APIS} from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient) {
    }

    updateUser(id: number, postObj: object): Observable<UserInterface> {
        return this.httpClient.patch<UserInterface>(`${USER_APIS.user}${id}/`, postObj);
    }

    getUsers(params?: HttpParams): Observable<UserInterface[]> {
        return this.httpClient.get<UserInterface[]>(USER_APIS.user, {params});
    }

    updateUserPassword(id: number, postObj: object): Observable<any> {
        return this.httpClient.post(`${USER_APIS.user}${id}/${USER_APIS.update_user_password}`, postObj);
    }
}
