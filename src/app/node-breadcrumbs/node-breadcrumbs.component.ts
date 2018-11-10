import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';
import { NodeBreadcrumbsService } from './node-breadcrumbs.service';
import { PermissionsService } from '../permissions/permissions.service'
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';


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
    private bottomSheet: MatBottomSheet
  ) { }

  nodeID: string;
  nodeType: string;
  currentUser: any;

  nodeParents: any;

  ngOnInit () {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

   this.route.params.subscribe(
      params => { 
        this.nodeType = params['type']
        this.nodeID = params['id']
        this._breadcrumbsService.getNodeParents(this.nodeID)
          .subscribe(nodeParents => {
            this.nodeParents = nodeParents
          })
      }
    );
  }

  switchToNode (nodeID, nodeType) {
    this.router.navigate(['node/' + nodeType + '/' + nodeID]);
  }

  openNodeParentsPanel(panel) {
    this.bottomSheet.open(panel)
  }
}
