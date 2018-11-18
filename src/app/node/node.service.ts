import { Injectable } from '@angular/core';
import { AuthenticationService } from 'app/_services';
import { appConfig } from '../app.config';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { LoadingService } from '../_services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly nodeRetrieveUpdateUrl: string = this.apiUrl + '/node/';
  private readonly permissionsDetailUrl: string = `${appConfig.apiAuthUrl}/user_node_permissions/`;

  public node = new BehaviorSubject(null)

  // List of permissions the user has for this node
  public userPermissions = new BehaviorSubject(null)
  
  constructor(
    private http: HttpClient, 
    private authUser: AuthenticationService,
    private loadingService: LoadingService
    ) { }

  private httpOptions = {
    // for authentication
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken()
    })
  };

  getNodeDetails (nodeID: string) {
    this.loadingService.show()
    this.http.get<any>(this.nodeRetrieveUpdateUrl + nodeID + '/', this.httpOptions)
      .catch(this.handleError)
      .subscribe(node => {
        this.loadingService.hide()
        this.node.next(node)
        this.userPermissions.next({
          permissions: node.user_permissions,
          role: node.user_role
        })
      })
  }

  getUserPermissions (nodeID: string, nodeType: string) {
    this.http.get<any>(this.permissionsDetailUrl+nodeID+'/?nodeType='+nodeType, this.httpOptions)
      .catch(this.handleError)
      .subscribe(response => {
        this.userPermissions.next({
          permissions: response.permissions,
          role: response.role
        })
      })
  }

  partialUpdateNode (nodeID: string, nodeData: any): Observable<any> {
    return this.http.patch(this.nodeRetrieveUpdateUrl + nodeID + '/', nodeData, this.httpOptions)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
