import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInterface, UserRoleInterface} from '../interfaces/user.interface';
import {USER_APIS} from '../constants/api.constants';
import {shareReplay} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly _getRoles: Observable<UserRoleInterface[]>;

    constructor(private httpClient: HttpClient) {
        this._getRoles = this.httpClient.get<UserRoleInterface[]>(USER_APIS.roles).pipe(shareReplay());
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

    getRoles(): Observable<UserRoleInterface[]> {
        return this._getRoles;
    }

    createUser(postObj: object): Observable<UserInterface> {
        return this.httpClient.post<UserInterface>(USER_APIS.user, postObj);
    }
}
