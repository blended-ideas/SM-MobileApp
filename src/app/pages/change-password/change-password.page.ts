import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserInterface} from '../../interfaces/user.interface';
import {AuthenticationService} from '../../services/authentication.service';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
    passwordForm: FormGroup;
    isPasswordChanging: boolean;
    matchPasswordError: boolean;
    bkError = {
        hasError: false,
        value: ''
    };
    private user: UserInterface;

    constructor(private fb: FormBuilder,
                private authenticationService: AuthenticationService,
                private sessionService: SessionService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.user = this.sessionService.user;
        this.passwordForm = this.fb.group({
            old_password: ['', [Validators.required, Validators.maxLength(20)]],
            new_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', [Validators.required, Validators.minLength(6)]],
        });
        this.passwordForm.controls.confirm_password.valueChanges.subscribe((value) => {
            this.matchPasswordError = value !== this.passwordForm.controls.new_password.value;
        });
        this.passwordForm.controls.new_password.valueChanges.subscribe((value) => {
            this.matchPasswordError = value !== this.passwordForm.controls.confirm_password.value;
        });
        this.passwordForm.valueChanges.subscribe(() => {
            this.bkError = {
                hasError: false,
                value: ''
            };
        });
    }

    changePassword() {
        const values = this.passwordForm.value;
        this.matchPasswordError = values.new_password !== values.confirm_password;
        if (this.matchPasswordError) {
            return;
        }
        this.bkError = {
            hasError: false,
            value: ''
        };
        this.authenticationService.changePassword(this.user.id, values).subscribe((response) => {
            console.log(response);
            this.utilService.presentToast('Password changed successful.', 3000);
        }, error => {
            const keys = Object.keys(error.error);
            this.bkError = {
                hasError: true,
                value: `${keys[0]}: ${error.error[keys[0]]}`
            };
        });
    }

}
