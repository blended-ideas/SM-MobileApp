import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {delay} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    returnUrl: string;
    isLoggingIn: boolean;
    loginError = {
        errorMessage: '',
        hasError: false
    };

    constructor(private fb: FormBuilder,
                private authenticationService: AuthenticationService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.authenticationService.clearCredentials();
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.maxLength(100)]],
            password: ['', [Validators.required, Validators.maxLength(100)]]
        });
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || null;
    }


    login() {
        this.isLoggingIn = true;
        this.loginError.hasError = false;

        const {username, password} = this.loginForm.value;
        this.authenticationService.login(username, password)
            .pipe(delay(1000))
            .subscribe(() => {
                if (this.returnUrl) {
                    this.router.navigateByUrl(this.returnUrl);
                } else {
                    this.router.navigate(['/dashboard']);
                }
                this.isLoggingIn = false;
            }, errorResponse => {
                this.isLoggingIn = false;
                this.loginError.hasError = true;
                this.loginError.errorMessage = errorResponse.error.detail;
            });
    }

}
