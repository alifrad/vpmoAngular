import { Injectable } from '@angular/core';
import { INodeDto } from './tree-structure-model';
import { appConfig } from '../app.config';

import { Observable } from '../../../node_modules/rxjs/Observable';
import "rxjs"
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';
import { AuthenticationService } from 'app/_services';

@Injectable({
  providedIn: 'root'
})
export class TreeStructureHttpService {
  dumpData = [{
    "_id": "000",
    "path": null,
    "index": 0,
    "name": "Inventions",
    "children": [{
      "_id": "000-0",
      "path": ",5b8c464900f0fa25849696bc,",
      "index": 0,
      "node_type": "Project",
      "name": "Lut Forest",
      "children": [{
        "_id": "000-0-0",
        "path": ",5b8c464900f0fa25849696bc,5b937c3e00f0fa34e087909a,",
        "index": 0,
        "node_type": "Project",
        "name": "Water Supply",
        "children": []
      }, {
        "_id": "000-0-1",
        "path": ",5b8c464900f0fa25849696bc,5b937c3e00f0fa34e087909a,",
        "index": 1,
        "node_type": "Project",
        "name": "Soil Supply",
        "children": []
      }
      ]
    }, {
      "_id": "000-1",
      "path": ",5b8c464900f0fa25849696bc,",
      "index": 1,
      "node_type": "Project",
      "name": "Bubble Car",
      "children": []
    }
    ],
    "node_type": "Team"
  }];

  private readonly teamsTreeUrl: string = `${appConfig.apiUrl}/teams_tree/`;

  constructor(private http: HttpClient, private authUser: AuthenticationService) {

  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authUser.getToken
    })
  };

  public deleteNode(id: string): any {
    console.log("removeNode ", id);
    return this.http.delete(this.teamsTreeUrl + id, this.httpOptions).subscribe();
  }
  public updateNode(data: INodeDto): any {
    console.log("update ", data);
    return this.http.put(this.teamsTreeUrl + data._id, data, this.httpOptions).subscribe();
  }

  public addNode(data: INodeDto): any {
    console.log("addNode ", data);
    return this.http.post(this.teamsTreeUrl, data, this.httpOptions).subscribe();
  }

  public getTree(id: string): Observable<INodeDto[]> {
    return this.http.get<INodeDto[]>(this.teamsTreeUrl + id+"/", this.httpOptions);
  }
}

