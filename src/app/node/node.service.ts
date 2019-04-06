import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthenticationService } from 'app/_services';
import { appConfig } from '../app.config';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/index';

import { LoadingService } from '../_services/loading.service';
import { CustomHttpClient } from '../_services/custom-http.service';
import { mergeMap, exhaustMap, merge, delay, combineAll, concatMap, toArray } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";
import { concat, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TopicPanelService } from '../main/topic-panel/topic-panel.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  private readonly nodeRetrieveUpdateUrl: string = this.apiUrl + '/node/';
  private readonly childrenListUrl: string = this.apiUrl + '/nodes/'
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
    private loadingService: LoadingService,
    private topicPanelService: TopicPanelService
  ) { }
  
  getNodeDetails (nodeID: string, nodeType: string) {
    var taskID = this.loadingService.startTask()

    var nodeDetails = this.http.get(this.nodeRetrieveUpdateUrl + nodeID + '/');
    var nodeParents = this.http.get(this.getNodeParentsUrl + nodeID + '/');
    var nodeTree = this.http.get(this.nodesTreeUrl + nodeID + '/');
    var nodeUsers = this.http.get(this.permissionsUserListUrl + nodeID + '/?nodeType=' + nodeType);
    var nodeDocuments = this.http.get(this.getDocumentsUrl + nodeID + '/?nodeType=' + nodeType)
      .pipe(catchError(val => of([])))
    // NOTE - This may be unnecessary at this point since the nodeDetails for teams/projects has a child_nodes attribute
    var children = this.http.get(this.childrenListUrl+'?nodeType=Project&parentNodeID='+nodeID);
    var requests = concat(nodeDetails, nodeParents, children, nodeTree, nodeUsers, nodeDocuments);

    requests
      .pipe(toArray())
      .subscribe(responses => {
        var node = responses[0];
        node.parents = responses[1];        
        node.children = responses[2];
        node.tree = responses[3];
        node.users = responses[4];
        node.documents = responses[5];
        this.node.next(node);
        localStorage.setItem('node', JSON.stringify(node));
        console.log(node);
        this.loadingService.taskFinished(taskID);
        this.topicPanelService.selectedTopicType.next('Issue');
      })
    }

  getNodeTree () {  
    if (this.node) {
      var taskID = this.loadingService.startTask()
      this.http.get(this.nodesTreeUrl + this.node.value._id + '/')
        .subscribe(response => {
          var node = this.node.value;
          node.tree = response;
          this.node.next(node);
          localStorage.setItem('node', JSON.stringify(node));
          
        });
      this.loadingService.taskFinished(taskID);
    }
  }

  getNodeDocuments () {
    if (this.node) {
      var taskID = this.loadingService.startTask()
      this.http.get(this.getDocumentsUrl + this.node.value._id + '/?nodeType=' + this.node.value.node_type)
        .pipe(catchError(val => of([])))
        .subscribe(response => {
          var node = this.node.value;
          node.documents = response;
          this.node.next(node);
          localStorage.setItem('node', JSON.stringify(node));
          
        });
      this.loadingService.taskFinished(taskID);
    }
  }

  getNodePermissions () {
    if (this.node) {
      var taskID = this.loadingService.startTask()
      this.http.get(this.permissionsUserListUrl + this.node.value._id + '/?nodeType=' + this.node.value.node_type)
        .subscribe(response => {
          var node = this.node.value;
          node.users = response;
          this.node.next(node);
          localStorage.setItem('node', JSON.stringify(node));
          
        });
      this.loadingService.taskFinished(taskID);
    }
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
