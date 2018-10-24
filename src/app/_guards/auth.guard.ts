import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router, 
        private authService: AuthenticationService
    ) { }

    loggedIn: boolean;
    
    debugger;

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<boolean> {
            return this.authService.isAuthenticated()
                .map(
                    data => {
                        if (data === false) {
                            this.authService.redirectUrl = state.url;
                            this.router.navigate(['/user/login']);
                            return data;
                        }
                        if (data === true) {
                            return data;
                        }
                    },
                    error => {
                        this.authService.redirectUrl = state.url;
                        this.router.navigate(['/user/login']);
                        return error;
                    }

                );
    }

    checklogedIn(url: string): boolean {
        if (this.authService.isAuthenticated()
            .subscribe(
                (data) => {this.loggedIn = data; },
            )
        ) {
            return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/user/login']);
        return false;
    }
}
