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
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly nodeRetrieveUpdateUrl: string = this.apiUrl + '/node/';
  private readonly permissionsDetailUrl: string = `${appConfig.apiAuthUrl}/user_node_permissions/`;
  private readonly nodeFavoriteUrl: string = `${appConfig.apiAuthUrl}/favorite_nodes/`;
  private readonly getNodeParentsUrl: string = this.apiUrl + '/node_parents/';

  node = new BehaviorSubject(null);
  nodeParents = new BehaviorSubject([]);

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
    var taskID = this.loadingService.startTask()
    if (nodeID) {
      this.http.get(this.nodeRetrieveUpdateUrl + nodeID + '/')
        .pipe(mergeMap(node => {
          this.node.next(node)
          localStorage.setItem('node', JSON.stringify(node));
          this.userPermissions.next({
            permissions: node.user_permissions,
            role: node.user_role
          });
          return this.http.get(this.getNodeParentsUrl + node._id + '/')
        }))
        .subscribe(nodeParents => {
          this.nodeParents.next(nodeParents)
          this.loadingService.taskFinished(taskID)
        })
    }
  }

  /* UNUSED */
  getNodeParents (node) {
    if (node._id !== undefined) {
      this.http.get(this.getNodeParentsUrl + node._id + '/').subscribe(nodeParents => {
        this.setSubjects(node, nodeParents)
      })
    }
  }

  /* UNUSED */
  setSubjects (node, nodeParents) {
    this.node.next(node)
    localStorage.setItem('node', JSON.stringify(node));
    this.userPermissions.next({
      permissions: node.user_permissions,
      role: node.user_role
    });
    this.nodeParents.next(nodeParents)
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
