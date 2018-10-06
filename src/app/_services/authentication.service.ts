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
    redirectUrl: string;

    private user = new BehaviorSubject<any>('');
    // currentUser = this.user.asObservable();
    // private loggedIn = new BehaviorSubject<boolean>(false);
    // userLoggedIn = this.loggedIn.asObservable();

    constructor(private http: HttpClient, 
                private router: Router,
                // public jwtHelper: JwtHelperService
                ) 
                { }


    isLoggedIn(): Observable<boolean> {
        const token = this.getToken();
        return this.http.post<any>(appConfig.apiAuthUrl + '/token-verify/', { token: token })
            .pipe(map(res => {
                if (res.token) {
                    console.log('user token is verified');
                    return true;
                } else {
                    console.log('user token is not valid');
                    return false;
                }
            }));
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
        try{
            this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
        }
        catch (err) {
            console.log('Error: ' + err);
            this.logout();
            return ('Error: ' + err);
        }
        console.log('token: ' +  this.tempUser.token);
        return this.tempUser.token;
    }


    isAuthenticated() {
        // get the token
        const token = this.getToken();
        
        return this.http.post<any>(appConfig.apiAuthUrl + '/token-verify/', { token: token })
            .pipe(map(res => {
                if (res && res.token) {
                    console.log('user is authenticated');
                    return true;
                } else {
                    console.log('user is NOT authenticated');
                    return false;
                }
            }
        ));
    }


    login(email: string, password: string) {
        console.log('Logging In...');
        
        return this.http.post<any>(appConfig.apiAuthUrl + '/users/login/', { email: email, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('nodeID', '');
                    localStorage.setItem('nodeType', '');
                    localStorage.setItem('nodePermission', '');
                    localStorage.setItem('teamID', '');
                    localStorage.setItem('projectID', '');
                    localStorage.setItem('topicID', '');
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
        // localStorage.removeItem('currentUser');
        localStorage.clear();
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
