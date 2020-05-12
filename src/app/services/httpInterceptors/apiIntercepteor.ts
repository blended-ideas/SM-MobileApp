import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {SessionService} from '../session.service';


@Injectable()
export class APIInterceptor implements HttpInterceptor {
    constructor(private sessionSrv: SessionService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.sessionSrv.token && this.sessionSrv.token.access;
        if (token) {
            const copiedRequest = request.clone({
                headers: request.headers.append('Authorization', 'Bearer ' + token)
            });
            return next.handle(copiedRequest);
        } else {
            return next.handle(request);
        }
    }
}
