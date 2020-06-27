import {Component, OnDestroy, OnInit} from '@angular/core';

import {AlertController, MenuController, Platform} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
import {SessionService} from './services/session.service';
import {AuthenticationService} from './services/authentication.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {
    faFileExcel,
    faKey,
    faPenAlt,
    faShoppingCart,
    faSignInAlt,
    faSignOutAlt,
    faUser,
    faUserCog
} from '@fortawesome/free-solid-svg-icons';

const {StatusBar, SplashScreen} = Plugins;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean;
    loginSubscription: Subscription;
    backButtonSubscription: Subscription;
    isAdmin: boolean;
    bool = true;
    faPenAlt = faPenAlt;
    faUser = faUser;
    faUserCog = faUserCog;
    faKey = faKey;
    faSignOutAlt = faSignOutAlt;
    faSignInAlt = faSignInAlt;

    constructor(
        private platform: Platform,
        private sessionService: SessionService,
        private menuController: MenuController,
        private authenticationService: AuthenticationService,
        private router: Router,
        private location: Location,
        private alertController: AlertController
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
        this.authenticationService.refreshToken();
        this.loginSubscription = this.authenticationService.getLoginSubscription().subscribe(response => {
            console.log(response);
            if (response.type === 'login') {
                this.initializeApp();
            }
        });
        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
            console.log(this.router.url, 'app');
            if (this.router.url === '/' || this.router.url === '/dashboard') {
                this.confirmExitApp();
            } else {
                this.location.back();
            }
        });
    }

    async initializeApp() {
        this.isLoggedIn = await this.sessionService.isLoggedIn(true);
        this.isAdmin = this.sessionService.isAdmin();
        console.log(this.isAdmin);
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
        if (this.backButtonSubscription) {
            this.backButtonSubscription.unsubscribe();
        }
    }

    private async confirmExitApp() {
        if (!this.bool) {
            return;
        }
        this.bool = false;
        const alert = await this.alertController.create({
            header: 'Exit App',
            message: 'Do you want to exit app?',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.bool = true;
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.bool = false;
                        // noinspection TsLint
                        navigator['app'].exitApp();
                    }
                }
            ]
        });
        await alert.present();
    }
}
