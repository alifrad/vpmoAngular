import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Observable, of } from 'rxjs';


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
            var user = this.authService.user.value
            if (user != null) {
                return of(true)
            } else {
                this.authService.redirectUrl = state.url;
                this.router.navigate(['/user/login']);
                return of(false);
            }
    }
}
