import { Component, OnInit, OnDestroy } from '@angular/core';

import { NodeService } from './node.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../app/_services/global.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.css']
})

export class NodeEditComponent implements OnInit, OnDestroy {
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

  private nodeSubscription: Subscription;

  ngOnInit(): void {
    this.nodeSubscription = this._nodeService.node.subscribe(node => {
      if (node) {
        this.node = node
        if (this.node.content == null) {
          this.node.content = ''
        }
      }
    })
  }

  ngOnDestroy () {
    this.nodeSubscription.unsubscribe();
  }


  saveContent () {
    console.log('saveContent', this.node)
    this._nodeService.partialUpdateNode(this.node._id, this.node)
      .subscribe(
        node => this.node = node 
      );
  }
  
}
