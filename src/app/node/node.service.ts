import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthenticationService } from 'app/_services';
import { appConfig } from '../app.config';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/index';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { LoadingService } from '../_services/loading.service';
import { CustomHttpClient } from '../_services/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly nodeRetrieveUpdateUrl: string = this.apiUrl + '/node/';
  private readonly permissionsDetailUrl: string = `${appConfig.apiAuthUrl}/user_node_permissions/`;
  private readonly nodeFavoriteUrl: string = `${appConfig.apiAuthUrl}/favorite_nodes/`;

  node = new BehaviorSubject(null);

  nodeLink: string = '';
  // currenNode = this.node.asObservable();
  // List of permissions the user has for this node
  public userPermissions = new BehaviorSubject(null)
  
  constructor(
    private http: CustomHttpClient, 
    private authService: AuthenticationService,
    private loadingService: LoadingService
  ) { }


  getNodeDetails (nodeID: string) {
    this.loadingService.show()
    this.http.get(this.nodeRetrieveUpdateUrl + nodeID + '/')
      .subscribe(val => {
        this.loadingService.hide();

        this.node.next(val);
        localStorage.setItem('node', JSON.stringify(val));
        this.userPermissions.next({
          permissions: val.user_permissions,
          role: val.user_role
        });

      })
  }

  getUserPermissions (nodeID: string, nodeType: string) {
    this.http.get(this.permissionsDetailUrl+nodeID+'/?nodeType='+nodeType)
      .subscribe(response => {
        this.userPermissions.next({
          permissions: response.permissions,
          role: response.role
        })
      })
  }

  partialUpdateNode (nodeID: string, nodeData: any): Observable<any> {
    return this.http.patch(this.nodeRetrieveUpdateUrl + nodeID + '/', nodeData)
  }

  favoriteNode (nodeID: string) {
    return this.http.put(this.nodeFavoriteUrl, {node: nodeID})
  }

  unfavoriteNode (nodeID: string) {
    return this.http.request('delete', this.nodeFavoriteUrl, {node: nodeID})
  }

}
