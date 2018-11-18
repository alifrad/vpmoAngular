import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';
import { NodeBreadcrumbsService } from './node-breadcrumbs.service';
import { PermissionsService } from '../permissions/permissions.service'
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { NodeService } from '../node/node.service';


@Component({
  selector: 'app-node-breadcrumbs',
  templateUrl: './node-breadcrumbs.component.html',
  styleUrls: ['./node-breadcrumbs.component.css']
})

export class NodeBreadcrumbsComponent implements OnInit {
  
  title = 'NodeBreadcrumbs';

  constructor(
    private authUser: AuthenticationService,
    private _breadcrumbsService: NodeBreadcrumbsService,
    private _permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private nodeService: NodeService
  ) { }

  nodeID: string;
  nodeType: string;
  currentUser: any;

  nodeParents: any = [];

  ngOnInit () {
    this.currentUser = this.authUser.getUser()

    this.nodeService.node.subscribe(node => {
      this.nodeType = node.node_type
      this.nodeID = node._id
      this._breadcrumbsService.getNodeParents(this.nodeID)
          .subscribe(nodeParents => {
            this.nodeParents = nodeParents;
          });
    })
  }

  switchToNode (nodeID, nodeType) {
    localStorage.setItem('nodeID', nodeID);
    this.router.navigate(['node/' + nodeType + '/' + nodeID]);
  }

  openNodeParentsPanel(panel) {
    this.bottomSheet.open(panel);
  }
}
