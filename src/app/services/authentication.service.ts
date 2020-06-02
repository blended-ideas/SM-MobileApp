import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {USER_APIS} from '../constants/api.constants';
import {AuthTokenInterface} from '../interfaces/authToken.interface';
import {concat, from, interval, Observable, Subject} from 'rxjs';
import {delay, map, tap} from 'rxjs/operators';
import {SessionService} from './session.service';
import {UserInterface} from '../interfaces/user.interface';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    loginSubject = new Subject<{ type: string, data: any, otherOptions?: any }>();

    constructor(private httpClient: HttpClient,
                private router: Router,
                private sessionService: SessionService) {
        this.startAuthTokenRefresh();
    }

    login(username: string, password: string) {
        const promise = new Promise((resolve, reject) => {
            this.httpClient.post<AuthTokenInterface>(USER_APIS.login, {username, password}).subscribe(response => {
                console.log(response);
                this.sessionService.token = response;
                this.httpClient.get<UserInterface>(USER_APIS.userProfile).subscribe(resp => {
                    this.sessionService.user = resp;
                    this.loginSubject.next({type: 'login', data: true});
                    resolve(resp);
                });
            }, err => {
                reject(err);
            });
        });
        return from(promise);
    }

    changePassword(id: number, postObj: object): Observable<any> {
        return this.httpClient.post(`${USER_APIS.user}${id}/${USER_APIS.change_password}`, postObj);
    }

    clearCredentials() {
        this.sessionService.clear();
        this.router.navigate(['/login']);
    }

    getLoginSubscription() {
        return this.loginSubject.asObservable();
    }

    refreshToken() {
        this.sessionService.jwt_token_from_storage().then(data => {
            console.log(JSON.parse(data.value));
            const refreshToken = data.value ? JSON.parse(data.value).refresh : null;
            if (refreshToken) {
                this.httpClient.post<AuthTokenInterface>(USER_APIS.refreshToken, {refresh: refreshToken})
                    .subscribe(token => {
                        this.sessionService.token = {
                            access: token.access,
                            refresh: token.refresh
                        };
                        this.loginSubject.next({type: 'login', data: true});
                    });
            }
        });
    }

    private startAuthTokenRefresh() {
        console.log('inside');
        // Refresh Token every 5 minutes
        interval(5 * 60 * 1000).subscribe(() => {
            const token = this.sessionService.token;
            if (token && !token.refresh) {
                return;
            }
            this.httpClient.post<AuthTokenInterface>(USER_APIS.refreshToken, {refresh: this.sessionService.token.refresh})
                .subscribe(response => {
                    this.sessionService.token = {
                        access: response.access,
                        refresh: token.refresh
                    };
                    this.loginSubject.next({type: 'login', data: true});
                });
        });
    }
}
