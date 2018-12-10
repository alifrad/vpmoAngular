import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { NodeBreadcrumbsService } from './node-breadcrumbs.service';
import { PermissionsService } from '../permissions/permissions.service'
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { NodeService } from '../node/node.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-node-breadcrumbs',
  templateUrl: './node-breadcrumbs.component.html',
  styleUrls: ['./node-breadcrumbs.component.css']
})

export class NodeBreadcrumbsComponent implements OnInit, OnDestroy {
  
  title = 'NodeBreadcrumbs';

  constructor(
    private authService: AuthenticationService,
    private _breadcrumbsService: NodeBreadcrumbsService,
    private _permissionsService: PermissionsService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private nodeService: NodeService
  ) { }

  nodeID: string;
  nodeType: string;

  nodeParents: any = [];

  private nodeSubscription: Subscription;
  private nodeParentsSubscription: Subscription;

  ngOnInit () {
    this.nodeSubscription = this.nodeService.node.subscribe(node => {
      console.log('Node updated', node)
      if (node != null) {
        this.nodeType = node.node_type;
        this.nodeID = node._id;
      } else {
        this.nodeType = ''
        this.nodeID = ''
        this.nodeParents = []
      }
    })

    this.nodeParentsSubscription = this.nodeService.nodeParents.subscribe(nodeParents => {
      console.log('NodeParents updated', nodeParents)
      this.nodeParents = nodeParents
    })
  }

  ngOnDestroy () {
    this.nodeSubscription.unsubscribe()
    this.nodeParentsSubscription.unsubscribe()
  }

  switchToNode (nodeID, nodeType) {
    localStorage.setItem('nodeID', nodeID);
    this.router.navigate(['node/' + nodeType + '/' + nodeID + '/tree']);
  }

  openNodeParentsPanel(panel) {
    this.bottomSheet.open(panel);
  }
}
