import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {USER_APIS} from '../constants/api.constants';
import {AuthTokenInterface} from '../interfaces/authToken.interface';
import {concat, interval, Observable, Subject} from 'rxjs';
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
        this.autoLoginOnStart();
    }

    login(username: string, password: string): Observable<AuthTokenInterface> {
        return concat(
            this.httpClient.post<AuthTokenInterface>(USER_APIS.login, {username, password}).pipe(tap(response => {
                this.sessionService.token = response;
            }), delay(1000)),
            this.httpClient.get<UserInterface>(USER_APIS.userProfile).pipe(tap(response => {
                this.sessionService.user = response;
                this.loginSubject.next({type: 'login', data: true});
            }))
        ).pipe(map(responses => {
            console.log(responses);
            return responses[0];
        }));
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

    private autoLoginOnStart() {
        const token = this.sessionService.token;
        console.log(token);
        this.sessionService.jwt_token_from_storage().then(data => {
            const refreshToken = data.value ? JSON.parse(data.value).refresh : null;
            console.log(refreshToken);
            if (refreshToken) {
                return this.httpClient.post<AuthTokenInterface>(USER_APIS.refreshToken, {refresh: refreshToken})
                    .subscribe(resp => {
                        this.sessionService.token = resp;
                        this.loginSubject.next({type: 'login', data: true});
                    });
            }
        });
    }
}
