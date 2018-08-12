import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { appConfig } from '../app.config';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>, 
        next: HttpHandler
        ): Observable<HttpEvent<any>> {
            if (request.url.startsWith(appConfig.apiUrl)) {
                // add authorization header with jwt token if available
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser && currentUser.token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `JWT ${currentUser.token}`
                        }
                    });
                }
                return next.handle(request);    
            } else {
                return next.handle(request); 
        }
    }
}

export const JwtInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
};
