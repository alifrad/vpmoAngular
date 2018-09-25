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
  private readonly teamsTreeUrl: string = `${appConfig.apiUrl}/teams_tree/`;
  private readonly projectsTreeUrl: string = `${appConfig.apiUrl}/project_tree/`;
  private readonly projectUrl: string = `${appConfig.apiUrl}/projects/`;

  constructor(private http: HttpClient, private authUser: AuthenticationService) { }

  private httpOptions = {
    // for auntification
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken
    })
  };

  public deleteNode(nodeId: string): any {
    console.log('removeNode ', nodeId);
    return this.http.delete(this.teamsTreeUrl + nodeId, this.httpOptions).subscribe();
  }

  public updateNode(data: INodeDto): any {
    console.log('update ', data);
    if (data.node_type === 'Project') {
      return this.http.put(this.projectUrl + data._id + '/', data, this.httpOptions).subscribe();
    }

  }

  // update bunch of nodes
  public updateNodeList(nodeList: INodeDto[], teamId: string): any {
    console.log('updateNodeList ', nodeList);
    return this.http.put(this.teamsTreeUrl + teamId + '/', nodeList, this.httpOptions).subscribe();
  }

  public addNode(node: INodeDto): Observable<INodeDto> {
    console.log('addNode ', node);
    return this.http.post<INodeDto>(this.projectUrl + 'add/', node, this.httpOptions);
  }

  public getTree(nodeType: string, Id: string): Observable<INodeDto[]> {
    if (nodeType === 'Team') {
      return this.http.get<IVisualNodeData[]>(this.teamsTreeUrl + Id + '/', this.httpOptions);
    } else if (nodeType === 'Project') {
      return this.http.get<IVisualNodeData[]>(this.projectsTreeUrl + Id + '/', this.httpOptions);
    }
    
  }
}
 
