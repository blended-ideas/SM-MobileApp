import {Component, OnDestroy, OnInit} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
import {SessionService} from './services/session.service';
import {AuthenticationService} from './services/authentication.service';
import {Subscription} from 'rxjs';

const {StatusBar, SplashScreen} = Plugins;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean;
    loginSubscription: Subscription;

    constructor(
        private platform: Platform,
        private sessionService: SessionService,
        private menuController: MenuController,
        private authenticationService: AuthenticationService
    ) {
        this.platform.ready().then(async () => {
            setTimeout(async () => {
                await SplashScreen.hide();
            });
            if ((this.platform.is('ios') || this.platform.is('android')) && !this.platform.is('mobileweb')) {
                await StatusBar.show();
            }
        });
    }

    ngOnInit(): void {
        // this.authenticationService.refreshToken();
        this.loginSubscription = this.authenticationService.getLoginSubscription().subscribe(response => {
            console.log(response);
            if (response.type === 'login') {
                this.initializeApp();
            }
        });
    }

    async initializeApp() {
        this.isLoggedIn = await this.sessionService.isLoggedIn(true);

    }

    async menuClose() {
        await this.menuController.close();
    }

    async onLogout() {
        await this.authenticationService.clearCredentials();
        await this.menuClose();
    }

    ngOnDestroy(): void {
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }
}
