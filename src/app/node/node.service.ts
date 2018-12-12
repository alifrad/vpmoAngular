import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthenticationService } from 'app/_services';
import { appConfig } from '../app.config';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/index';

import { LoadingService } from '../_services/loading.service';
import { CustomHttpClient } from '../_services/custom-http.service';
import { mergeMap, exhaustMap, concatMap, concat, merge } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";


@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly nodeRetrieveUpdateUrl: string = this.apiUrl + '/node/';
  private readonly permissionsDetailUrl: string = `${appConfig.apiAuthUrl}/user_node_permissions/`;
  private readonly nodeFavoriteUrl: string = `${appConfig.apiAuthUrl}/favorite_nodes/`;
  private readonly getNodeParentsUrl: string = this.apiUrl + '/node_parents/';
  private readonly nodesTreeUrl: string = `${appConfig.apiUrl}/nodes_tree/`;
  // This is for the list of users that have permisisons to the node
  private readonly permissionsUserListUrl: string = `${appConfig.apiUrl}/node_permissions/`;
  private readonly getDocumentsUrl: string = `${appConfig.docApiUrl}` + '/node_documents/'

  node = new BehaviorSubject(null);

  nodeLink: string = '';
  
  constructor(
    private http: CustomHttpClient, 
    private authService: AuthenticationService,
    private loadingService: LoadingService
  ) { }

  getNodeDetails (nodeID: string, nodeType: string) {
    var taskID = this.loadingService.startTask()

    let nodeDetails = this.http.get(this.nodeRetrieveUpdateUrl + nodeID + '/');
    let nodeParents = this.http.get(this.getNodeParentsUrl + nodeID + '/');
    let nodeTree = this.http.get(this.nodesTreeUrl + nodeID + '/');
    let nodeUsers = this.http.get(this.permissionsUserListUrl + nodeID + '/?nodeType=' + nodeType);
    let nodeDocuments = this.http.get(this.getDocumentsUrl + nodeID + '/?nodeType=' + nodeType)
    var requests = [nodeDetails, nodeParents, nodeTree, nodeUsers, nodeDocuments]
    forkJoin(requests)
      .subscribe(responses => {
        console.log(responses)
        var node = responses[0];
        node.parents = responses[1];
        node.tree = responses[2];
        node.users = responses[3];
        node.documents = responses[4]
        this.node.next(node);
        console.log(node);
        this.loadingService.taskFinished(taskID)
      })

    /*
    if (nodeID) {
      this.http.get(this.nodeRetrieveUpdateUrl + nodeID + '/')
        .pipe(concatMap(node => {
          this.node.next(node)
          localStorage.setItem('node', JSON.stringify(node));
          this.userPermissions.next({
            permissions: node.user_permissions,
            role: node.user_role
          });

          let parents = this.http.get(this.getNodeParentsUrl + node._id + '/')
          let tree = this.http.get(this.nodesTreeUrl + node._id + '/');
          let userPermissionsList = this.http.get(this.permissionsListUrl+node._id+'/?nodeType='+node.node_type)

          return forkJoin([parents, tree, userPermissionsList])
          
          // return this.http.get(this.getNodeParentsUrl + node._id + '/')
        }))
        .subscribe(response => {
          console.log('Http Tree', response)
          this.nodeParents.next(response[0])
          this.nodeTree.next(response[1])
          this.userPermissionsList.next(response[2])
          this.loadingService.taskFinished(taskID)
        })
    }
    */
  }

  getUserPermissions (nodeID: string, nodeType: string) {
    this.http.get(this.permissionsDetailUrl+nodeID+'/?nodeType='+nodeType)
      .subscribe(response => {
        var node = this.node.value
        node.user_permissions = response.permissions
        node.user_role = response.role
        this.node.next(node)
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
