import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '../_services/loading.service';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';
import { CustomHttpClient } from '../_services/custom-http.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class PermissionsService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly permissionsListUrl: string = `${appConfig.apiUrl}/node_permissions/`;
  private readonly permissionsRemoveUrl: string = `${appConfig.apiAuthUrl}/remove_user_role/`;
  private readonly assignableUsersUrl: string = `${appConfig.apiAuthUrl}/assignable_users/`;
  private readonly assignableRolesUrl: string = `${appConfig.apiUrl}/assignable_roles/`;
  private readonly assignUserToNodeUrl: string = `${appConfig.apiAuthUrl}/assign_role/`;


  constructor(
    private http: CustomHttpClient,
    private authService: AuthenticationService,
    private loadingService: LoadingService
  ) { }


  getPermissionsList (node: string, nodeType: string): Observable<any> {
    return this.http.get(this.permissionsListUrl+node+'/?nodeType='+nodeType)
  }

  removeUserPermissions (node: string, nodeType: string, userID: string): Observable<any> {
    return this.http.delete(this.permissionsRemoveUrl+node+'/?nodeType='+nodeType+'&user='+userID)
  }

  getAssignableUsers (node: string, nodeType: string, usernameQuery: string): Observable<any> {
    return this.http.get(this.assignableUsersUrl+node+"/?nodeType="+nodeType+"&search="+usernameQuery)
  }

  getAssignableRoles (node: string, nodeType: string): Observable<any> {
    return this.http.get(this.assignableRolesUrl+node+"/?nodeType="+nodeType)
  }

  assignUserToNode (node: string, nodeType: string, username: string, role: string): Observable<any> {
    var data = {
      'nodeID': node,
      'nodeType': nodeType,
      'user': username,
      'role': role
    }
    return this.http.put(this.assignUserToNodeUrl, data)
  }
}