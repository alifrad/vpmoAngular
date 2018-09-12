import { Injectable } from '@angular/core';
import { INodeDto } from './tree-structure-model';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { appConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class TreeStructureHttpService {

  constructor(private http: Http) { }

  public removeNode(id: string): void {
    console.log("removeNode ", id);
  }
  public updateNode(data: INodeDto): any {
    console.log("update ", data);
  }

  public addNode(data: INodeDto): any {
    console.log("addNode ", data);
  }

  public getTree(cb): void {
    //let url = `${appConfig.apiUrl}/getTree`;
   // url='https://jsonplaceholder.typicode.com/posts';
   // this.http.get(url).subscribe(res => {
   //   cb(res.json());
   // }
   // );
   
    const dumpData= [{
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
    cb(dumpData);
  }

}
