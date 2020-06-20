import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {APIInterceptor} from './services/httpInterceptors/apiIntercepteor';
import {ResponseInterceptor} from './services/httpInterceptors/ResponseInterceptor';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {ComponentsModule} from './components/components.module';
import {Camera} from '@ionic-native/camera/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        FontAwesomeModule,
        ComponentsModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
        BarcodeScanner,
        Camera,
        FileTransfer
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
