import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {SessionService} from '../session.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(@Inject(PLATFORM_ID) private platformId: object,
                private router: Router,
                private sessionService: SessionService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkAuth(state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkAuth(state);
    }

    private async checkAuth(state: RouterStateSnapshot) {
        const isLogin = await this.sessionService.isLoggedIn(true);
        if (!isLogin) {
            await this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        } else {
            return true;
        }
    }
}
