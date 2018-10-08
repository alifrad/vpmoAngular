import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddPermissionsComponent } from './add-permissions.component';
import { AuthenticationService } from '../_services';
import { PermissionsService } from './permissions.service';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})

export class PermissionsComponent implements OnInit {
  
  title = 'Permissions';

  constructor(
    private authUser: AuthenticationService,
    private _permissionsService: PermissionsService,
    private dialog: MatDialog
  ) { }

  userList: any[] = [];
  nodeID: string;
  nodeType: string;
  currentUserPermissions: string[] = [];
  currentUserRole: string;
  displayedColumns: string[] = ['username', 'role', 'controlsColumn']

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

    this.nodeID = nodeID
    this.nodeType = nodeType
  }

  openAddDialog () {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '350';
    dialogConfig.height = '500';

    this.dialog.open(AddPermissionsComponent, dialogConfig);
  }

  private removeUserPermissions (user) {
    this._permissionsService.removeUserPermissions(this.nodeID, this.nodeType, user._id)
       .subscribe(
        response => {
          console.log(user, this.userList.indexOf(user))
          this.userList.splice(this.userList.indexOf(user), 1)
        }
      )
  }
}
