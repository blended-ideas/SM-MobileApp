import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserInterface} from '../../interfaces/user.interface';
import {SessionService} from '../../services/session.service';
import {UserService} from '../../services/user.service';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    profileForm: FormGroup;
    user: UserInterface;
    validation_messages = {
        name: [],
        username: [],
    };

    constructor(private fb: FormBuilder,
                private sessionService: SessionService,
                private userService: UserService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.user = this.sessionService.user;
        console.log(this.user);
        this.buildForm();
    }

    buildForm() {
        this.profileForm = this.fb.group({
            name: this.fb.control(this.user.name, [Validators.required, Validators.maxLength(220), Validators.minLength(2)]),
            username: this.fb.control(this.user.username, [
                Validators.required, Validators.maxLength(100), Validators.minLength(2),
                Validators.pattern('^[a-zA-Z][a-zA-Z0-9]{1,100}$')])
        });
        this.validation_messages = {
            name: [
                {type: 'required', message: 'Name is required.'},
                {type: 'maxLength', message: 'Name cannot be more than 220 characters long.'},
                {type: 'minLength', message: 'Name should be more than 2 characters long.'},
            ],
            username: [
                {type: 'required', message: 'User Name is required'},
                {type: 'maxLength', message: 'User Name cannot be more than 100 characters long'},
                {type: 'minLength', message: 'User Name should be more than 2 characters long'},
                {type: 'pattern', message: 'User Name is invalid'},
            ]

        };
    }

    updateProfile() {
        this.profileForm.markAllAsTouched();
        this.userService.updateUser(this.user.id, this.profileForm.value).subscribe(response => {
            this.sessionService.user = response;
            this.user = response;
            this.utilService.presentToast('Details Updated. You might need to re-login for details to be updated completely', 3000);
        });
    }

}
