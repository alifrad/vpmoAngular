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
            var user = this.authService.user.value
            if (user) {
                return Observable.of(true)
            } else {
                this.authService.redirectUrl = state.url;
                this.router.navigate(['/user/login']);
                return Observable.of(false);
            }
    }
}
