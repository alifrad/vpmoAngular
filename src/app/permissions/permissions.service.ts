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
export class PermissionsService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly permissionsListUrl: string = `${appConfig.apiUrl}/node_permissions/`;
  private readonly permissionsDetailUrl: string = `${appConfig.apiAuthUrl}/user_node_permissions/`;
  private readonly permissionsRemoveUrl: string = `${appConfig.apiAuthUrl}/remove_user_role/`;
  private httpOptions = {
    // for auntification
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken()
    })
  };

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  getPermissionsList (node: string, nodeType: string): Observable<any> {
    return this.http.get(this.permissionsListUrl+node+'/?nodeType='+nodeType, this.httpOptions)
      .catch(this.handleError);
  }

  getUserPermissions (node: string, nodeType: string): Observable<any> {
    return this.http.get(this.permissionsDetailUrl+node+'/?nodeType='+nodeType, this.httpOptions)
      .catch(this.handleError)
  }

  removeUserPermissions (node: string, nodeType: string, userID: string): Observable<any> {
    return this.http.delete(this.permissionsRemoveUrl+node+'/?nodeType='+nodeType+'&user='+userID, this.httpOptions)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}