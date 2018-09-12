import { Injectable } from '@angular/core';
import { INodeDto } from './tree-structure-model';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { appConfig } from '../app.config';

import { Observable } from '../../../node_modules/rxjs/Observable';
import "rxjs"

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
  private baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = `${appConfig.apiUrl}/project`;
  }

  public deleteNode(id: string): any {
    console.log("removeNode ", id);
    return this.http.delete(this.baseUrl + '/' + id).subscribe();
  }
  public updateNode(data: INodeDto): any {
    console.log("update ", data);
    return this.http.put(this.baseUrl + '/' + data._id, data).subscribe(); 
  }

  public addNode(data: INodeDto): any {
    console.log("addNode ", data);
    return this.http.post(this.baseUrl, data).subscribe();
  }

  public getTree(cb): void {
    this.http.get(this.baseUrl)
      .catch(e => { 
        console.log("errror getTree",this.dumpData);
        cb(this.dumpData);
        return Observable.throwError(e); 
      })
      .subscribe(res => {
          cb(res.json());       
      });
  }
}

