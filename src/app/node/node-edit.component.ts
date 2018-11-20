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
  severityList: any[] = [
    {value: '1', text: 'Low'},
    {value: '2', text: 'Medium'},
    {value: '3', text: 'High'}
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._nodeService.node.subscribe(node => {
        if (node) {
          this.node = node
          if (this.node.content == null) {
            this.node.content = ''
          }
        } else {
          this._nodeService.getNodeDetails(params['id'])
        }
      })
    })
  }


  saveContent () {
    console.log('saveContent', this.node)
    this._nodeService.partialUpdateNode(this.node._id, this.node)
      .subscribe(
        node => this.node = node 
      );
  }
  
}
