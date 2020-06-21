import {Injectable, NgZone} from '@angular/core';
import {Capacitor, Plugins} from '@capacitor/core';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';
import {ActionSheetController} from '@ionic/angular';
import {SessionService} from './session.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Subject} from 'rxjs';

// const {Camera} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private fileLoaderSubject = new Subject<{ loaded: number, total: number }>();

    constructor(private transfer: FileTransfer,
                private actionSheetCtrl: ActionSheetController,
                private sessionService: SessionService,
                private camera: Camera,
                private zone: NgZone) {
    }

    getImage(restrictSize?: boolean) {

        return new Promise(async (resolve, reject) => {
            const actionSheet = await this.actionSheetCtrl.create({
                buttons: [{
                    text: 'Camera',
                    handler: () => {
                        this.takeImages(this.camera.PictureSourceType.CAMERA, restrictSize).then(result => {
                            resolve({id: null, image: result, viewImage: Capacitor.convertFileSrc(result)});
                        }).catch(error => {
                            reject(error);
                        });
                    }
                },
                    {
                        text: 'Open Gallery',
                        handler: () => {
                            this.takeImages(this.camera.PictureSourceType.PHOTOLIBRARY, restrictSize).then(results => {
                                resolve({id: null, image: results, viewImage: Capacitor.convertFileSrc(results)});
                            });
                        }
                    }, {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                        }
                    }]
            });

            await actionSheet.present();
        });

    }

    uploadFile(url: string, fileURI: string, data?: any, fileName?: string, mimeType?: string, httpMethod?: string) {
        mimeType = mimeType || 'multipart/form-data';
        // fileName = fileName || 'file';
        const fl = new URL(fileURI);
        const newFile = fl.origin + fl.pathname;
        const fileNameKey = newFile.split('.');
        const options: FileUploadOptions = {
            fileKey: fileName,
            fileName: fileNameKey[fileNameKey.length - 1],
            params: data,
            mimeType,
            httpMethod: httpMethod || 'POST',
            headers: {
                Authorization: 'Bearer ' + this.sessionService.token.access
            }
        };

        const fileTransfer: FileTransferObject = this.transfer.create();

        fileTransfer.onProgress(res => {
            this.zone.run(() => {
                this.fileLoaderSubject.next({loaded: res.loaded, total: res.total});
            });
        });
        return fileTransfer.upload(fileURI, url, options, true);
    }

    private takeImages(type, restrictSize?: boolean) {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            sourceType: type
        };
        if (restrictSize) {
            options.targetWidth = 900;
            options.targetWidth = 900;
            options.allowEdit = true;
        }

        return this.camera.getPicture(options);
    }

}
