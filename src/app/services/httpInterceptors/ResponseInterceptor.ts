import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService,
                private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(() => {
        }, (error) => {
            if (error.status === 401 && window.location.href.indexOf('login') === -1) {
                this.authService.clearCredentials();
                this.router.navigate(['/login']);
            }
        }));
    }
}
