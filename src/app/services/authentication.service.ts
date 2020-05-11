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
                });
        });
    }
}
