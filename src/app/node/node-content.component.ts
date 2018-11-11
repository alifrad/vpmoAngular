import { Component, OnInit } from '@angular/core';

import { NodeService } from './node.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../app/_services/global.service';


@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.css']
})

export class NodeContentComponent implements OnInit {
  errorMessage: string;

  constructor(
          private _nodeService: NodeService,
          private router: Router,
          private global: GlobalService,
          private route: ActivatedRoute
        ) {}

  node: any;
  nodeContent: string;

  ngOnInit(): void {
    this.route.params.subscribe(
      params => { 
        this.getNodeDetail(params['id'])
      }
    );    
    
  }

  getNodeDetail (nodeID) {
    this.nodeContent = '';
    this._nodeService.getNodeDetails(nodeID)
      .subscribe(node => {
        this.node = node
        if (this.node.content !== null) {
          this.nodeContent = this.node.content;
        }
      })
  }

  saveContent () {
    this._nodeService.partialUpdateNode(this.node._id, this.nodeContent)
      .subscribe(
        node => this.node = node 
      );
  }
  
}
