import { Component, OnInit, Injectable } from '@angular/core';
import { User } from '../../user/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { AlertService } from '../../_services';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';


class ExistingUserValidator {
    constructor (private userService: UserService) { }

    userEmailExists: AsyncValidatorFn = (control: AbstractControl): any => {
      return this.userService.userExists('email', control.value).toPromise().then(response => {
        if (response.exists) {
          return {exists: true}
        } else {
          return null
        }
      })
    }
}


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: User;
  emailPattern = '^[a-z0-9.%+-]+@[a-z0-9.%-]+\.[a-z]{2,4}$';
  message: string;
  registerForm: FormGroup;


  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], this.validateEmailNotTaken.bind(this)],
      email2: [''],
      password: ['', Validators.required],
      username: ['', Validators.required, this.validateUsernameNotTaken.bind(this)],
      fullname: ['', Validators.required]
    }, {validator: this.checkEmails});
  }

  checkEmails (group) {
    let email1 = group.controls.email.value
    let email2 = group.controls.email2.value

    if (email1 != email2 ) {
      group.controls.email2.setErrors({'emailNotSame': true})
    } else {
      group.controls.email2.setErrors(null)
    }

   return null
  }

  validateEmailNotTaken(control: AbstractControl) {
    return this.userService.userExists('email', control.value).map(res => {
      if (res.exists) {
        return {exists: true}
      } else {
        return null
      }
    });
  }

  validateUsernameNotTaken(control: AbstractControl) {
    return this.userService.userExists('username', control.value).map(res => {
      if (res.exists) {
        return {exists: true}
      } else {
        return null
      }
    });
  }


  OnSubmit(registerForm) {
    this.userService.create(registerForm.getRawValue())
      .subscribe(
        data => {console.log('success: ', data);
                this.router.navigate(['/user/login']);
        },
        error => {console.log('error: ', error);
                this.alertService.error(error);
        }
      );
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.user); }

}
