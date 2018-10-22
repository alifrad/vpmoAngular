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
import { AuthenticationService } from '../_services';



@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authUser: AuthenticationService,
    ) { }

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'JWT'
    })
  };
  // private extractData(res: Response) {
  //   let body = res.json();
  //   return body.fields || { };
  // }

  // private handleError(error: any) {
  //   console.error('post error: ', error);
  //   return Observable.throw(error.statusText);
  // }

  getAll() {
    return this.http.get<User[]>(appConfig.apiAuthUrl + '/users');
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
      return this.http.patch(url, user, this.httpOptions);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

}
