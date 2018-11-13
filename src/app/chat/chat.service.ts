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
  private readonly apiUrl: string = `${appConfig.chatUrl}`;
  private readonly tokenUrl: string = this.apiUrl + '/token/';
  private httpOptions = {
    // for auntification
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken()
    })
  };

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  getToken (): Observable<any> {
    return this.http.get(this.tokenUrl, this.httpOptions)
      .catch(this.handleError)
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}