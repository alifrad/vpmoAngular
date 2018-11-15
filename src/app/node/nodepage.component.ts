import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../_services/global.service';
import { NodeService } from './node.service';

@Component({
  selector: 'app-nodepage',
  templateUrl: './nodepage.component.html',
  styleUrls: ['./nodepage.component.less']
})
export class NodepageComponent implements OnInit {
  errorMessage: string;
  node: any;
  nodeType: string;
  
  constructor(
          private router: Router,
          private route: ActivatedRoute,
          private globalService: GlobalService,
          private nodeService: NodeService,
          ) { 
              globalService.nodeValue.subscribe(
                (nextValue) => {
                  this.node = JSON.parse(nextValue);
              });
          }

  updateGlobal(nodeType, nodeId) {
    localStorage.setItem('nodeType', nodeType);
    
    this.nodeService.getNodeParents(nodeId)
      .subscribe(
        params => {
          // this.globalService.team = JSON.stringify(params.root);
          // this.globalService.project = JSON.stringify(params.immediate_parent);
          this.globalService.node = JSON.stringify(params.node);
          console.log('node parents: ' + JSON.stringify(params));
        },
        err => console.error('getNodeParents service error: ' + err)
      );
  }

  ngOnInit() {
    let nodeType: string;
    let nodeId: string;
    this.route.params.subscribe(
      params => { 
        nodeType = params['type'];
        nodeId = params['id'];
        this.updateGlobal(nodeType, nodeId);
        console.log(params);
      }
    );

   
    // this.nodeType = localStorage.getItem('nodeType');
    
  }

}
