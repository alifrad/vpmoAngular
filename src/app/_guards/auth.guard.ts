import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router, 
        private authService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checklogedIn(state.url);
    }

    checklogedIn(url: string): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/user/login']);
        return false;
    }
}
