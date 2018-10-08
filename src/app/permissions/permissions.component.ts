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

  userList: any[] = [];
  currentUserPermissions: string[] = [];
  currentUserRole: string;
  displayedColumns: string[] = ['username', 'role']

  ngOnInit() {
    console.log("Permissions Module initialized")
    var nodeID = localStorage.getItem('nodeID')
    var nodeType = localStorage.getItem('nodeType')

    this._permissionsService.getUserPermissions(nodeID, nodeType)
      .subscribe(
        userPermissions => {
          this.currentUserPermissions = userPermissions.permissions
          this.currentUserRole = userPermissions.role
        }
      )

    this._permissionsService.getPermissionsList(nodeID, nodeType)
      .subscribe(
        permissions => {
          this.userList = permissions
        }
      )
  }
}
