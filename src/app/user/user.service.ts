import { Injectable } from '@angular/core';
// import { Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { User } from './user';
import { MessageService } from '../shared/message.service';
import { appConfig } from '../app.config';
import { AuthenticationService, AlertService } from '../_services';
import { CustomHttpClient } from '../_services/custom-http.service';


@Injectable()
export class UserService {

  constructor(
    private http: CustomHttpClient,
    private messageService: MessageService,
    private authService: AuthenticationService,
    private alertService: AlertService
    ) { }

  public searchUsers (searchUrl: string, query: string): Observable<any> {
    return this.http.get(searchUrl + query)
  }

  public userExists (queryField: string, query: string): Observable<any> {
    return this.http.get(appConfig.apiAuthUrl + '/user_exists/?query_field='+queryField+'&query='+query)
  }

  getAll() {
    return this.http.get(appConfig.apiAuthUrl + '/users');
  }

  getById(_id: string) {
      return this.http.get(appConfig.apiAuthUrl + '/users/' + _id);
  }

  create(user: User) {
      return this.http.post(appConfig.apiAuthUrl + '/users/register/', user);
  }

  // update(user: User) {
  //     return this.http.put(appConfig.apiUrl + '/users/' + user.id, user);
  // }

  delete(_id: string) {
      return this.http.delete(appConfig.apiAuthUrl + '/users/' + _id);
  }

  update(_id: number, user: User) {
      const url = appConfig.apiAuthUrl + '/users/update/' + _id + '/';
      return this.http.patch(url, user)
        .catch(err => this.handleError(err));
  }

  private handleError(error: any) { 
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(error);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // private handleError2<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.alert(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

 
  // private alert(message: string) {
  //   this.alertService.error('Error: ' + message);
  // }

}
