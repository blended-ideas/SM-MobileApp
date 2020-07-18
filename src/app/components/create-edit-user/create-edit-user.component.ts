import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {UserInterface, UserRoleInterface} from '../../interfaces/user.interface';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-create-edit-user',
    templateUrl: './create-edit-user.component.html',
    styleUrls: ['./create-edit-user.component.scss'],
})
export class CreateEditUserComponent implements OnInit {
    @Input() user: UserInterface;
    mode: 'create' | 'edit';
    initialLoading: boolean;
    roles: UserRoleInterface[];
    userForm: FormGroup;
    matchPasswordError: boolean;
    validation_messages = {
        name: [],
        username: [],
        password: [],
        confirm_password: [],
    };

    constructor(private modalController: ModalController,
                private userService: UserService,
                private fb: FormBuilder,
                private utilService: UtilService) {
    }

    ngOnInit() {
        console.log(this.user);
        this.mode = this.user ? 'edit' : 'create';
        this.initialLoading = true;
        this.userService.getRoles().subscribe(response => {
            this.roles = response;
            this.initialLoading = false;
            this.buildForm();
        });
    }

    dismiss() {
        this.modalController.dismiss(false);
    }

    saveUser() {
        this.userForm.markAllAsTouched();
        console.log(this.userForm.value);
        let apiCall: Observable<UserInterface>;

        if (this.mode === 'edit') {
            apiCall = this.userService.updateUser(this.user.id, this.userForm.value);
        } else {
            apiCall = this.userService.createUser(this.userForm.value);
        }

        apiCall.subscribe(response => {
            this.modalController.dismiss(response);
        }, (err) => {
            let errStr = 'Something went wrong while creating the product/service';
            if (err.status === 400) {
                const keys = Object.keys(err.error);
                errStr = err.error[keys[0]][0];
            }
            this.utilService.presentToast(errStr, null, [{
                icon: 'close',
                handler: () => {
                }
            }]);
        });
    }

    private buildForm() {
        this.userForm = this.fb.group({
            username: [this.user ? this.user.username : '', [Validators.required, Validators.maxLength(100)]],
            name: [this.user && this.user.name || '', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            roles_change: this.fb.group({
                auditor: [this.user && this.user.roles.length > 0 ? this.user.roles.some(rl => rl.label === 'auditor') : false],
                shiftworker: [this.user && this.user.roles.length > 0 ? this.user.roles.some(rl => rl.label === 'shiftworker') : false]
            })
        });

        if (this.mode === 'create') {
            this.userForm.addControl('password',
                this.fb.control('', [
                    Validators.required, Validators.minLength(6), Validators.maxLength(10)
                ])
            );
            this.userForm.addControl(
                'confirm_password', this.fb.control('', [
                    Validators.required, Validators.minLength(6), Validators.maxLength(10)
                ])
            );


            this.userForm.controls.password.valueChanges.subscribe((value) => {
                this.matchPasswordError = value !== this.userForm.controls.confirm_password.value;
            });
            this.userForm.controls.confirm_password.valueChanges.subscribe((value) => {
                this.matchPasswordError = value !== this.userForm.controls.password.value;
            });
        }

        this.validation_messages = {
            name: [
                {type: 'required', message: 'Name is required.'},
                {type: 'maxLength', message: 'Name cannot be more than 100 characters long.'},
                {type: 'minLength', message: 'Name should be more than 3 characters long.'},
            ],
            username: [
                {type: 'required', message: 'User Name is required'},
                {type: 'maxLength', message: 'User Name cannot be more than 100 characters long'},
            ],
            password: [
                {type: 'required', message: 'Password is required'},
                {type: 'maxLength', message: 'Password cannot be more than 10 characters long'},
                {type: 'minLength', message: 'Password must be at least 6 characters'},
            ],
            confirm_password: [
                {type: 'required', message: 'Confirm Password is required'},
                {type: 'maxLength', message: 'Confirm Password cannot be more than 10 characters long'},
                {type: 'minLength', message: 'Confirm Password must be at least 6 characters'},
            ]

        };
    }

}
