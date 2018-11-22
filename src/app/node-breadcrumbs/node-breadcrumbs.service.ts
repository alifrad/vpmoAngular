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
export class NodeBreadcrumbsService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly getNodeParentsUrl: string = this.apiUrl + '/node_parents/';

  private httpOptions: Object;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    authService.user.subscribe(user => {
      this.setHttpOptions(user)
    })
  }

  setHttpOptions (user) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + user.token || ''
      })
    }
  }

  getNodeParents (nodeID: string): Observable<any> {
    return this.http.get(this.getNodeParentsUrl + nodeID + '/', this.httpOptions)
      .catch(this.handleError)
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
