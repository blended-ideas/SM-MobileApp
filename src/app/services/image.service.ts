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

    constructor(private transfer: FileTransfer,
                private actionSheetCtrl: ActionSheetController,
                private sessionService: SessionService,
                private camera: Camera) {
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
        return fileTransfer.upload(fileURI, url, options, true).then();
    }

}
