
import {throwError as observableThrowError,  Observable, Subject ,  of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, filter, scan } from 'rxjs/operators';
import { User } from '../user/user';
import { appConfig } from '../app.config';
import { BehaviorSubject } from 'rxjs/index';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpCacheService } from './http-cache.service';
import { GlobalService } from './global.service';
import { navigation } from '../navigation/navigation';
// import { GlobalService } from './global2.service';
import { AlertService } from './alert.service';

@Injectable()

export class AuthenticationService {
    tempUser: any;
    redirectUrl: string;
    token: string;
    navigation: any;

    user = new BehaviorSubject<any>(null);
    favoriteNodes = new BehaviorSubject<any>([]);
   
    loggedIn = new BehaviorSubject<boolean>(false);
    
    constructor(private http: HttpClient, 
        private router: Router,
        private cacheService: HttpCacheService,
        private globalService: GlobalService,
        private alertService: AlertService
    ) { 
        this.navigation = navigation;
        this.user.subscribe(user => {
            if (user != null) {
                this.getFavoriteNodes(user)
            } else {
                this.favoriteNodes.next([])
            }
        })
    }


    getUserName(): Observable<string> {   
        if (this.user.value !== null) {
            return this.user.value.username
        } else {
            return null
        }
    }

    getUser() {
        if (this.user.value !== null) {
            return this.user.value
        } else {
            return null
        }
    }

    getFavoriteNodes (user) {
        this.http.get(appConfig.apiAuthUrl + '/favorite_nodes/', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + user.token
            })
        })
            .subscribe(favoriteNodes => {
                this.favoriteNodes.next(favoriteNodes)
            })
    }


    login(email: string, password: string) {
        this.alertService.info('Logging in')
        this.cacheService.invalidateCache();
        localStorage.clear();
        return this.http.post<any>(appConfig.apiAuthUrl + '/users/login/', { email: email, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem('node', '');
                    localStorage.setItem('nodeType', '');
                    localStorage.setItem('nodePermission', '');
                    localStorage.setItem('team', '');
                    localStorage.setItem('project', '');
                    localStorage.setItem('topic', '');
                    // this.globalService.navigation = JSON.stringify(this.navigation);
                    // localStorage.setItem('navigation', '');
                    
                    this.user.next(user);
                    
                    // this.isLoggedIn.next(true);
                    return user;
                } else {
                    console.log('could not log in, either email or password is wrong!');
                    localStorage.removeItem('user');
                    this.user.next(null)
                    throw new Error('Email and/or Password is wrong!');
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        this.cacheService.invalidateCache();
        localStorage.clear();
        this.user.next(null)
  
        console.log('Cleared Cache and localStorage');
        this.router.navigate(['/user/login']);
    }

    updateLocalStorage (fullname, username, email) {
        this.tempUser = JSON.parse(localStorage.getItem('user'));
        this.tempUser.fullname = fullname;
        this.tempUser.username = username;
        this.tempUser.email = email;
        localStorage.setItem('user', JSON.stringify(this.tempUser));
        this.user.next(JSON.parse(localStorage.getItem('user')));
        return this.user;
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return observableThrowError(err.message);
      }

}
