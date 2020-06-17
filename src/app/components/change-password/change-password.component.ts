import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from '../../interfaces/user.interface';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {merge} from 'rxjs';
import {UtilService} from '../../services/util.service';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    @Input() user: UserInterface;
    passwordForm: FormGroup;
    matchPasswordError: boolean;
    validation_messages = {
        password: [],
        confirm_password: [],
    };

    constructor(private modalController: ModalController,
                private fb: FormBuilder,
                private utilService: UtilService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.passwordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
            confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]]
        });
        merge(this.passwordForm.controls.password.valueChanges, this.passwordForm.controls.confirm_password.valueChanges)
            .subscribe((values) => {
                this.matchPasswordError = this.passwordForm.controls.password.value !== this.passwordForm.controls.confirm_password.value;
            });
    }

    dismiss(boolVal) {
        boolVal ? this.modalController.dismiss(this.user) : this.modalController.dismiss(false);
    }

    updatePassword() {
        if (this.matchPasswordError) {
            this.utilService.presentToast('Password and Change password doesnt match.', 2000);
            return;
        }
        this.userService.updateUserPassword(this.user.id, {password: this.passwordForm.controls.password.value})
            .subscribe((response) => {
                console.log(response);
                this.utilService.presentToast('Password changed successfully.', 2000);
                this.dismiss(true);
            }, error => {
                const keys = Object.keys(error.error);
                alert(error.error[keys[0]]);
            });
    }

}
