import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { User } from '../user/user';
import { appConfig } from '../app.config';
import { BehaviorSubject } from 'rxjs/index';
import { of } from 'rxjs';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()

export class AuthenticationService {
    tempUser: any;
    private user = new BehaviorSubject<any>('');
    // currentUser = this.user.asObservable();
    // private loggedIn = new BehaviorSubject<boolean>(false);
    // userLoggedIn = this.loggedIn.asObservable();

    constructor(private http: HttpClient, 
                private router: Router,
                // public jwtHelper: JwtHelperService
                ) 
                { }

    get isLoggedIn(): Observable<boolean> {
        if (!localStorage.getItem('currentUser')) {
            return Observable.of(false);
        } else {
            return Observable.of(true);
        }

        // return this.loggedIn.asObservable(); // {2}
    }

    getUserName(): Observable<any> {
        if (!localStorage.getItem('currentUser')) {
            console.log('user has not logged in!');
        } else {
            this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
            return Observable.of(this.tempUser.fullname);
        }
    }

    getUser(): Observable<any> {
        if (!localStorage.getItem('currentUser')) {
            console.log('user has not logged in!');
            throw new Error('user has not logged in!');
        } else {
            this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
            return Observable.of(this.tempUser);
        }
    }

    getToken(): string {
        this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
        return this.tempUser.token;
    }


    isAuthenticated(): boolean {
        // get the token
        const token = this.getToken();
        // return a boolean reflecting 
        // whether or not the token is expired
        // true or false
        // return !this.jwtHelper.isTokenExpired();
        return true;
    }


    login(email: string, password: string) {
        console.log('Logging In...');
        
        return this.http.post<any>(appConfig.apiAuthUrl + '/users/login/', { email: email, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.user.next(JSON.parse(localStorage.getItem('currentUser')));
                    // this.loggedIn.next(true);
                    return user;
                } else {
                    console.log('could not log in, either email or password is wrong!');
                    localStorage.removeItem('currentUser');
                    throw new Error('Email and/or Password is wrong!');
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        // this.loggedIn.next(false);
        this.router.navigate(['/user/login']);
    }

    updateLocalStorage (fullname, username, email) {
        this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
        this.tempUser.fullname = fullname;
        this.tempUser.username = username;
        this.tempUser.email = email;
        localStorage.setItem('currentUser', JSON.stringify(this.tempUser));
        this.user.next(JSON.parse(localStorage.getItem('currentUser')));
        return this.user;
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
      }

}
