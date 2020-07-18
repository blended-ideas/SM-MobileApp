import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    private isLoading = false;
    private loader;

    constructor(private loadingCtrl: LoadingController,
                private alertController: AlertController,
                private toastController: ToastController,
                private router: Router) {
    }


    async presentLoading(message: string, duration?: number, cssClass?: string, translucent = true) {
        this.isLoading = true;
        this.loader = await this.loadingCtrl.create({
            spinner: 'circles', duration: duration || null, message, translucent, cssClass
        }).then(loader => {
            loader.present().then(() => {
                if (!this.isLoading) {
                    loader.dismiss().then(() => console.log('Abort Loading'));
                }
            });
        });
    }

    async dismissLoading() {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss().then(() => console.log('Dismissed Loading'));
    }

    async loginAlertDialog(title?: string, fromUrl?: string) {
        const alert = await this.alertController.create({
            header: title,
            subHeader: 'Please login to perform this action.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Continue',
                    handler: () => {
                        this.router.navigate(['/app/login'], {queryParams: {returnUrl: fromUrl}});
                    }
                }
            ]
        });
        await alert.present();
    }

    async presentToast(message: string, duration?: number, buttons?: any) {
        const toast = await this.toastController.create({
            message,
            duration,
            color: 'dark',
            buttons
        });
        await toast.present();
    }

}
