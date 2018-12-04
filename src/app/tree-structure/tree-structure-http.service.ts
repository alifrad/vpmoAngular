import { Injectable } from '@angular/core';
import { IVisualNodeData, INodeDto } from './tree-structure-model';
import { appConfig } from '../app.config';

import { Observable } from '../../../node_modules/rxjs/Observable';
import 'rxjs';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';
import { AuthenticationService } from 'app/_services';
import { map } from 'rxjs/operators';
import { CustomHttpClient } from '../_services/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class TreeStructureHttpService {

  // url for crud operation of teamTree
  private readonly nodesTreeUrl: string = `${appConfig.apiUrl}/nodes_tree/`;
  private readonly nodeCreateUrl: string = `${appConfig.apiUrl}/create_node/`;
  private readonly nodeUpdateUrl: string = `${appConfig.apiUrl}/node/`;

  constructor(private http: CustomHttpClient, private authService: AuthenticationService) { }


  public updateNode(nodeID: string, nodeType: string, updateData: any): Observable<any> {
    return this.http.patch(this.nodeUpdateUrl + nodeType + '/' + nodeID + '/', updateData)
  }

  // update bunch of nodes
  public updateNodeList(nodeList: INodeDto[], teamId: string): any {
    return this.http.put(this.nodesTreeUrl + teamId + '/', nodeList).subscribe();
  }

  public createNode(formData: any, nodeType: string): Observable<any> {
    return this.http.post(this.nodeCreateUrl + nodeType + '/', formData)
              .pipe(map(node => {
                 if (node) {
                  return node;
                } else {
                  throw new Error('coud not create the node');
                }
              })
              )
  }

  public getTree(nodeType: string, Id: string): Observable<any> {
    return this.http.get(this.nodesTreeUrl + Id + '/');
  }
}
 
