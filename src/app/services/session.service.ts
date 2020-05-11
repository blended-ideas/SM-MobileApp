import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {AuthTokenInterface} from '../interfaces/authToken.interface';
import {UserInterface} from '../interfaces/user.interface';
import {Plugins} from '@capacitor/core';

const {Storage} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private readonly TOKEN_KEY: string = 'INVOICE101_TOKEN';
    private readonly USER_KEY: string = 'INVOICE101_USER';
    private emptyToken: AuthTokenInterface = {
        access: null,
        refresh: null
    };

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        if (isPlatformBrowser(this.platformId)) {
            this.getItems();
        } else {
            this._user = null;
            this._token = this.emptyToken;
        }
    }

    private _user: UserInterface;

    get user(): UserInterface {
        return this._user;
    }

    set user(value: UserInterface) {
        this._user = value;
        if (isPlatformBrowser(this.platformId)) {
            Storage.set({key: this.USER_KEY, value: JSON.stringify(this._user)});
        }
    }

    private _token: AuthTokenInterface;

    get token(): AuthTokenInterface {
        if (isPlatformBrowser(this.platformId)) {
            if (!this._token) {
                Storage.get({key: this.TOKEN_KEY}).then(data => {
                    this._token = JSON.parse(data.value) || this.emptyToken;
                });
            }
            return this._token;
        }
        return this.emptyToken;
    }

    set token(token: AuthTokenInterface) {
        this._token = token;
        if (isPlatformBrowser(this.platformId)) {
            Storage.set({key: this.TOKEN_KEY, value: JSON.stringify(this._token)});
        }
    }

    async getItems() {
        this._user = JSON.parse((await Storage.get({key: this.USER_KEY})).value) as UserInterface;
        this._token = JSON.parse((await Storage.get({key: this.TOKEN_KEY})).value) || this.emptyToken;
    }

    async clear(): Promise<void> {
        this._user = null;
        this._token = this.emptyToken;
        await Storage.clear();
    }

    // async isLoggedIn(): Promise<boolean> {
    //     return Boolean(this._token.access);
    // }

    isLoggedIn(forceCheck: boolean): boolean | Promise<boolean> {
        if (forceCheck) {
            return new Promise(resolve => {
                Storage.get({key: this.TOKEN_KEY}).then(data => {
                    if (data.value) {
                        this._token = JSON.parse(data.value);
                        resolve(Boolean(this._token.access));
                    }
                    resolve(Boolean(this.emptyToken.access));
                });
            });
        }
        return Boolean(this._token.access);
    }

    isAdmin(): boolean {
        return this.user && this.user.roles.some(r => r.label === 'admin');
    }

    isAuditor(): boolean {
        return this.user && this.user.roles.some(r => r.label === 'auditor');
    }

    isShiftWorker(): boolean {
        return this.user && this.user.roles.some(r => r.label === 'shiftworker');
    }
}
