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

  nodeParents: any = [];

  private nodeParentsSubscription: Subscription;

  ngOnInit () {
    this.nodeParentsSubscription = this.nodeService.node.subscribe(node => {
      if (node) {
        this.nodeParents = node.parents
      }
    })
  }

  ngOnDestroy () {
    if (this.nodeParentsSubscription !== undefined) {
      this.nodeParentsSubscription.unsubscribe()
    }
  }

  switchToNode (nodeID, nodeType) {
    localStorage.setItem('nodeID', nodeID);
    this.router.navigate(['node/' + nodeType + '/' + nodeID + '/tree']);
  }

  openNodeParentsPanel(panel) {
    this.bottomSheet.open(panel);
  }
}
