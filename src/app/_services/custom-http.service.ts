
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable()
export class CustomHttpClient {

  private token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {
    authService.user.subscribe(user => {
      if (user) {
        this.token = user.token
      } else {
        this.token = null
      }
    })
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append("Content-Type", "application/json")
    if (this.token !== null) {
      headers = headers.append('Authorization', 'JWT ' + this.token); 
    }
    return headers
  }

  get (url) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get<any>(url, {
        headers: headers
      }).pipe(
      catchError(err => this.handleError(err)))
  }

  post (url, data) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post<any>(url, data, {
        headers: headers
      }).pipe(
      catchError(err => this.handleError(err)))
  }

  customPut (url, data, headers) {
    return this.http.put<any>(url, data, headers).pipe(
      catchError(err => this.handleError(err)))
  }

  put (url, data) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.put<any>(url, data, {
        headers: headers
      }).pipe(
      catchError(err => this.handleError(err)))
  }

  delete (url) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.delete<any>(url, {
        headers: headers
      }).pipe(
      catchError(err => this.handleError(err)))
  }

  patch (url, data) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.patch<any>(url, data, {
        headers: headers
      }).pipe(
      catchError(err => this.handleError(err)))
  }

  request (requestMethod: string, url: string, body) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers)
    var options = {
      body: body,
      headers: headers
    }
    return this.http.request(requestMethod, url, options).pipe(
      catchError(err => this.handleError(err)))
  }

  handleError(err: HttpErrorResponse) {
    this.alertService.error(err.message)
    if (err.status == 401) {
      this.router.navigate(['/user/logout'])
    }
    // Clearing all tasks to hide the loading component in case of an error
    this.loadingService.clearTasks()
    return observableThrowError(err.message);
  }
}