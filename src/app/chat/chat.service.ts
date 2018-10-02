import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';

import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class ChatService {

  // url for crud operation of teamTree
  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly messageListUrl: string = `${appConfig.apiUrl}/messages/`;
  private httpOptions = {
    // for auntification
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken
    })
  };

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  getMessages (node: string): Observable<any> {
    return this.http.get(this.messageListUrl+node+'/' , this.httpOptions)
        .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}