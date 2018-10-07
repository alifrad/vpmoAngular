import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { PermissionsService } from './permissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})

export class PermissionsComponent implements OnInit {
  
  title = 'Permissions';

  constructor(
    private authUser: AuthenticationService,
    private _permissionsService: PermissionsService
  ) { }

  nodePermissions: any[] = [];
  displayedColumns: string[] = ['username', 'role']

  ngOnInit() {
    console.log("Permissions Module initialized")
    var nodeID = localStorage.getItem('nodeID')
    var nodeType = localStorage.getItem('nodeType')
    this._permissionsService.getPermissions(nodeID, nodeType)
      .subscribe(
        permissions => this.nodePermissions = permissions
      )
  }
}
