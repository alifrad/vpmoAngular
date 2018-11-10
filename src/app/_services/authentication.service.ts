import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, filter, scan } from 'rxjs/operators';
import { User } from '../user/user';
import { appConfig } from '../app.config';
import { BehaviorSubject } from 'rxjs/index';
import { of } from 'rxjs';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpCacheService } from './http-cache.service';
import { GlobalService } from './global.service';
import { navigation } from '../navigation/navigation';


@Injectable()

export class AuthenticationService {
    tempUser: any;
    redirectUrl: string;
    token: string;
    navigation: any;

    user = new BehaviorSubject<any>('');
   
    // currentUser = this.user.asObservable();
    loggedIn = new BehaviorSubject<boolean>(false);
    
    // userLoggedIn = this.loggedIn.asObservable();

    constructor(private http: HttpClient, 
                private router: Router,
                private cacheService: HttpCacheService,
                private globalService: GlobalService,
                
                // public jwtHelper: JwtHelperService
                ) 
                { 
                    this.navigation = navigation;
                    // globalService.currentUserValue.subscribe(
                    //     nextValue => {
                    //         this.tempUser = nextValue;
                    //         this.tempUser = JSON.parse(this.tempUser);
                    //         this.token = this.tempUser.token;
                    //     },
                    //     error => {
                    //         console.log('token or currentUser are not recognised....');
                    //         this.logout();
                    //     }
                    // );
                }


    // isLoggedIn(): Observable<boolean> {
    //     const token = this.getToken();
    //     return this.http.post<any>(appConfig.apiAuthUrl + '/token-verify/', { token: token })
    //         .pipe(map(res => {
    //             if (res.token) {
    //                 console.log('user token is verified');
    //                 return true;
    //             } else {
    //                 console.log('user token is not valid');
    //                 return false;
    //             }
    //         }));
    // }


    isAuthenticated(): Observable<boolean> {
        // get the token
        // debugger;
        if (this.getToken()) {
            
            const token = this.getToken();
            return this.http.post<any>(appConfig.apiAuthUrl + '/token-verify/', { token: token })
                .pipe(
                    map(res => {
                    if (res.token) {
                        console.log('isAuthenticated: user is authenticated');
                        return true;
                    } else {
                        console.log('isAuthenticated: user is NOT authenticated');
                        this.logout();
                        return false;
                    }
                    }),
                    catchError(err => of(false))
                );
            
        } else {
            this.logout();
            return Observable.of(false);

        }
    }


    getUserName(): Observable<string> {
        // this.user.subscribe(
        //     (data) => {
        //         return data.fullname;
        //     },
        //     (err: any) => {
        //         console.log('Error getUser(): could not get user fullname!');
        //         return '';
        //     }
        // );       
        if (!localStorage.getItem('currentUser')) {
            console.log('user has not logged in!');
        } else {
            this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
            return Observable.of(this.tempUser.fullname);
        }
    }

    getUser() {
        this.user.subscribe(
            (data) => {
                return data;
            },
            (err: any) => {console.log('Error getUser(): could not get user information!');
        });
        // if (!localStorage.getItem('currentUser')) {
        //     console.log('user has not logged in!');
        //     throw new Error('user has not logged in!');
        // } else {
        //     this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
        //     return Observable.of(this.tempUser);
        // }
    }

    getToken(): Observable<string> {
        if (localStorage.getItem('currentUser')) {
            this.tempUser = JSON.parse(localStorage.getItem('currentUser'));
            if (this.tempUser.token) {
                return this.tempUser.token;
            }
        } else {
            this.logout();
            throw new Error('token or currentUser is not accessible!');
        }
              
    }  


    login(email: string, password: string) {
        console.log('Logging In...');
        this.cacheService.invalidateCache();
        localStorage.clear();
        return this.http.post<any>(appConfig.apiAuthUrl + '/users/login/', { email: email, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    
                    this.user.next(JSON.stringify(user));
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('node', '');
                    localStorage.setItem('nodeType', '');
                    localStorage.setItem('nodePermission', '');
                    localStorage.setItem('team', '');
                    localStorage.setItem('project', '');
                    localStorage.setItem('topic', '');
                    this.globalService.navigation = JSON.stringify(this.navigation);
                    localStorage.setItem('navigation', '');
                    
                    // this.isLoggedIn.next(true);
                    return user;
                } else {
                    console.log('could not log in, either email or password is wrong!');
                    // this.globalService.currentUser = '';
                    localStorage.removeItem('currentUser');
                    throw new Error('Email and/or Password is wrong!');
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('currentUser');
        this.cacheService.invalidateCache();
        localStorage.clear();
  
        console.log('Cleared Cache and localStorage');
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
