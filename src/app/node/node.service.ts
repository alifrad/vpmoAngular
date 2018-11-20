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
  nav: any = [ 
    {
    'id'      : 'general',
    'title'   : 'General',
    'type'    : 'group',
    'url'  : '',
    'children': [
    {
        'id'   : 'home',
        'title': 'Home',
        // 'translate': 'NAV.SAMPLE.TITLE',
        'type' : 'item',
        'icon' : 'home',
        'url'  : '/',
        'hidden' : false,
    },
    {
        'id'   : 'teams',
        'title': 'My Teams',
        'type' : 'item',
        'icon' : 'business_center',
        'url'  : '/team/all',
        'hidden' : false,
    },
    ]},
    {
    'id'      : 'nodePages',
    'title'   : 'Node',
    'type'    : 'group',
    'hidden' : false,
    // 'icon' : 'business_center',
    'url'  : '',
    'children': [
        {
            'id'   : 'tree',
            'title': 'Tree',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : '',
            'hidden' : true,
        },
        {
        'id'   : 'details',
        'title': 'Details',
        'type' : 'item',
        'icon' : 'business_center',
        'url'  : 'app-node-edit',
        'hidden' : true,
        },
        {
            'id'   : 'chat',
            'title': 'Chat',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : 'app-chat',
            'hidden' : true,
        },
        {
            'id'   : 'docs',
            'title': 'Documents',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : 'project/all',
            'hidden' : true,
        },
        {
            'id'   : 'tasks',
            'title': 'Tasks',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : 'project/all',
            'hidden' : true,
        },
        {
            'id'   : 'perms',
            'title': 'Permissions',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : 'project/all',
            'hidden' : true,
        },
    ]},
    {
        'id'      : 'favouritsGroup',
        'title'   : 'FAVOURITES',
        'type'    : 'group',
        // 'icon' : 'business_center',
        'url'  : '',
        'children': [
        {
            'id'   : 'fav001',
            'title': 'Issue 123',
            // 'translate': 'NAV.SAMPLE.TITLE',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : '',
            'hidden' : false,
        },
        {
            'id'   : 'fav002',
            'title': 'Project XYZ',
            'type' : 'item',
            // 'icon' : 'business_center',
            'url'  : '',
            'hidden' : false,
        },
        ]},

  ];
  node = new BehaviorSubject(null);
  navigation = new BehaviorSubject(this.nav);
  nodeLink: string = '';
  // currenNode = this.node.asObservable();
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
      .subscribe(val => {
        // debugger;
        this.loadingService.hide();
        // this.nodeItem = node;
        this.node.next(val);
        localStorage.setItem('node', JSON.stringify(val));
        this.userPermissions.next({
          permissions: val.user_permissions,
          role: val.user_role
        });
        this.updateNavigation(val);
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


  updateNavigation(node) {
    this.nodeLink = node.type + '/' + node.id;
    
    this.updateNodeNav();
    if (node.type === 'Team') {
          this.updateTeamNav();
      } else if (node.type === 'Project') {
          this.updateProjectNav();
      } else if (node.type === 'Topic') {
          this.updateTopicNav();
      }
    
    
    // alert('nav:' + this.navigation);
    localStorage.setItem('naigation', JSON.stringify(this.nav));
  }
  
  updateNodeNav() {
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'details').url = '/node/details/' + this.nodeLink;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'tree').url = '/node/tree/' + this.nodeLink;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'chat').url = '/node/chat/' + this.nodeLink;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'docs').url = '/node/douments/' + this.nodeLink;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'tasks').url = '/node/tasks/' + this.nodeLink;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'tasks').url = '/node/permissions/' + this.nodeLink;
    localStorage.setItem('naigation', JSON.stringify(this.nav));
    this.navigation.next(this.nav);
  }

  updateTeamNav() {
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'details').hidden = true;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'tasks').hidden = true;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'docs').hidden = true;
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'chat').hidden = true;
    localStorage.setItem('naigation', JSON.stringify(this.nav));
    this.navigation.next(this.nav);
  }

  updateProjectNav() {
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'tasks').hidden = true;
    localStorage.setItem('naigation', JSON.stringify(this.nav));
    this.navigation.next(this.nav);
  }

  updateTopicNav() {
    this.nav
        .find(item => item.id === 'nodePages').children
        .find(item => item.id === 'tree').hidden = true;
    localStorage.setItem('naigation', JSON.stringify(this.nav));
    this.navigation.next(this.nav);
  }
  
}
