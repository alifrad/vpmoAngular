import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/_services/authentication.service';
import { AlertService } from 'app/_services/alert.service';
import { LoadingService } from 'app/_services/loading.service';


@Component({
    selector   : 'login-2',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
})

export class LoginComponent implements OnInit
{    
    loading = false;
    returnUrl: string;
    loginForm: any;

    errorMessage: any = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private loadingService: LoadingService
    ) { }

    ngOnInit() {
        this.loginForm = new FormGroup({
            'email': new FormControl('', [
                Validators.required
            ]),
            'password': new FormControl('', [
                Validators.required
            ])
        })

        // reset login status
        // this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this.currentUser = this.authenticationService.currentUser.subscribe(currentUser => this.currentUser);
    }

    get email () {
        return this.loginForm.get('email')
    }
    get password () {
        return this.loginForm.get('password')
    }


    login() {
        this.loading = true;
        this.authenticationService.login(this.email.value, this.password.value)
            .subscribe(
                data => {
                  if (this.authenticationService.redirectUrl) {
                    this.router.navigateByUrl(this.authenticationService.redirectUrl);
                  } else {
                    this.router.navigate(['/user/dashboard']);
                  }                  
                },
                error => {
                  this.alertService.error(error);
                  this.errorMessage = error
                  this.loading = false;
                });
    }
}
