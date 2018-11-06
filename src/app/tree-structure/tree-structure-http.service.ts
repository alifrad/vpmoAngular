import { Injectable } from '@angular/core';
import { IVisualNodeData, INodeDto } from './tree-structure-model';
import { appConfig } from '../app.config';

import { Observable } from '../../../node_modules/rxjs/Observable';
import 'rxjs';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';
import { AuthenticationService } from 'app/_services';

@Injectable({
  providedIn: 'root'
})
export class TreeStructureHttpService {

  // url for crud operation of teamTree
  private readonly nodesTreeUrl: string = `${appConfig.apiUrl}/nodes_tree/`;
  private readonly nodeCreateUrl: string = `${appConfig.apiUrl}/create_node/`;
  private readonly nodeUpdateUrl: string = `${appConfig.apiUrl}/update_node/`;

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  private httpOptions = {
    // for auntification
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken
    })
  };

  /*
  public deleteNode(nodeId: string): any {
    console.log('removeNode ', nodeId);
    return this.http.delete(this.teamsTreeUrl + nodeId, this.httpOptions).subscribe();
  }
  */

  public updateNode(nodeID: string, nodeType: string, updateData: any): Observable<any> {
    console.log('update ', updateData);
    return this.http.patch(this.nodeUpdateUrl + nodeType + '/' + nodeID + '/', updateData, this.httpOptions)
  }

  // update bunch of nodes
  public updateNodeList(nodeList: INodeDto[], teamId: string): any {
    console.log('updateNodeList ', nodeList);
    return this.http.put(this.nodesTreeUrl + teamId + '/', nodeList, this.httpOptions).subscribe();
  }

  public createNode(formData: any, nodeType: string): Observable<any> {
    return this.http.post(this.nodeCreateUrl + nodeType + '/', formData, this.httpOptions)
  }

  public getTree(nodeType: string, Id: string): Observable<INodeDto[]> {
    return this.http.get<IVisualNodeData[]>(this.nodesTreeUrl + Id + '/', this.httpOptions);
  }
}
 
