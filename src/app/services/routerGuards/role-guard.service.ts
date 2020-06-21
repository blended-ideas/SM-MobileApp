import {Injectable} from '@angular/core';
import {SessionService} from '../session.service';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private sessionService: SessionService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const roles = route.data.roles as Array<string>;

        let allow = false;
        if (!allow && roles.indexOf('Auditor') > -1) {
            allow = this.sessionService.isAuditor();
        }
        if (!allow && roles.indexOf('Shift') > -1) {
            allow = this.sessionService.isShiftWorker();
        }
        if (!allow && roles.indexOf('Admin') > -1) {
            allow = this.sessionService.isAdmin();
        }

        return allow;
    }
}
