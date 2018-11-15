import { Injectable } from '@angular/core';
import { AuthenticationService } from 'app/_services';
import { appConfig } from '../app.config';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private readonly apiUrl: string = `${appConfig.apiUrl}`;
  
  constructor(
    private http: HttpClient, 
    private authUser: AuthenticationService,
    ) { }

  private httpOptions = {
    // for authentication
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken()
    })
  };  

  constructNodeHierarchy(nodeType, nodeId) {
    // based on nodeType and nodeId to retreive
    // Team, Project and Topic related data:
    // if nodeType is Team: retrieve Team attributes and update GlobalService
    // if nodeType is Project: retrieve Team and Project 
    // attributes and update GlobalService
    // if nodeType is Topic: retrieve 
    // Team, Project and Topic attributes and update GlobalService
    if (nodeType === 'Team') {
      
      // this.globalService.team = JSON.stringify('_id':);

    } else if (nodeType === 'Project') {

    } else if (nodeType === 'Topic') {

    }
  }

  getNodeParents(nodeID: string): Observable<any> {
    return this.http.get(this.apiUrl + '/node_parents/' + nodeID + '/', this.httpOptions)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
