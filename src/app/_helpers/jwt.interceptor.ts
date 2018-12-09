
import {throwError as observableThrowError } from 'rxjs';
import { Observable, of } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from '../app.config';
import { Router } from '@angular/router';
import { LoadingService } from '../_services/loading.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private loadingService: LoadingService
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            this.router.navigateByUrl(`/user/login`);
            this.loadingService.clearTasks()
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            return of(err.message);
        }
        return observableThrowError(err);
    }
    
    intercept(
        request: HttpRequest<any>, 
        next: HttpHandler
        ): Observable<HttpEvent<any>> {
            if (request.url.startsWith(appConfig.apiUrl)) {
                // add authorization header with jwt token if available
                const currentUser = JSON.parse(localStorage.getItem('user'));
                if (currentUser && currentUser.token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `JWT ${currentUser.token}`
                        }
                    });
                }
                return next.handle(request).pipe(catchError(x=> this.handleAuthError(x))); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70;    
            } else {
                return next.handle(request).pipe(catchError(x=> this.handleAuthError(x))); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70; 
        }
    }
}

export const JwtInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
};
