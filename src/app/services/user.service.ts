import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
}
