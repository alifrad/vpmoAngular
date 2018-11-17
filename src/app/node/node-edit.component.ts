import { Component, OnInit } from '@angular/core';

import { NodeService } from './node.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../app/_services/global.service';


@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.css']
})

export class NodeEditComponent implements OnInit {
  errorMessage: string;

  constructor(
          private _nodeService: NodeService,
          private router: Router,
          private global: GlobalService,
          private route: ActivatedRoute
        ) {}

  node: any = {};
  nodeID: string;
  severityList: any[] = [
    {value: '1', text: 'Low'},
    {value: '2', text: 'Medium'},
    {value: '3', text: 'High'}
  ];

  ngOnInit(): void {
    this.route.params.subscribe(
      params => { 
        this.nodeID = params['id']
        this.getNodeDetail()
      }
    )
  }

  getNodeDetail () {
    this._nodeService.getNodeDetails(this.nodeID)
      .subscribe(node => {
        this.node = node;
        console.log('Content', this.node)
        // Setting the content to an empty string if it's null
        if (this.node.content == null) {
          this.node.content = ''
        }
      });
  }

  saveContent () {
    console.log('saveContent', this.node)
    this._nodeService.partialUpdateNode(this.node._id, this.node)
      .subscribe(
        node => this.node = node 
      );
  }
  
}
