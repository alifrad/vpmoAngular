import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';


@Component({
    selector: 'user-Profile',
    templateUrl: './userProfile.component.html',
    styleUrls: ['./userProfile.component.scss']
})

export class UserProfileComponent implements OnInit {
    userProfileForm: FormGroup;
    currentUser: any;
    errMessage: any;
 

    constructor(private authService: AuthenticationService,
                private router: Router,
                private userService: UserService,
                private fb: FormBuilder,
            
                ) { }

    ngOnInit() {
        this.currentUser = this.authService.getUser()

        console.log(this.currentUser.fullname + ' to be present');

        const fullname = new FormControl(this.currentUser.fullname, [Validators.required]);
        const username = new FormControl(this.currentUser.username, [Validators.required]);
        const email = new FormControl(this.currentUser.email, [Validators.required, Validators.email]);
        // const id = new FormControl(this.currentUser._id);
        this.userProfileForm = this.fb.group({
            fullname: fullname,
            username: username,
            email: email,
            // id: id,
        });
    }

    cancel() {
        this.router.navigate(['user/dashboard']);
    }

    saveProfile(formValues) {
        this.userService.update(this.currentUser._id, formValues)
            .subscribe(
                data => {
                    this.authService.updateLocalStorage(formValues.fullname, formValues.username, formValues.email);
                    console.log('success: ', data);
                    // console.log(localStorage.getItem('user.token'));
                    this.router.navigate(['/user/dashboard']);
                },
                err => {
                    console.error(err);
                    // this.router.navigate(['user/login']);
                }
            );
    }

    get fullname() {
        return this.userProfileForm.get('fullname');
    }
    
    get username() {
        return this.userProfileForm.get('username');
    }

    get email() {
        return this.userProfileForm.get('email');
    }

}
