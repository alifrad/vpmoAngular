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
    var nodeID = localStorage.getItem('nodeID')
    var nodeType = localStorage.getItem('nodeType')

    this.getUserPermissions(nodeID, nodeType)

    this.getPermissionsList(nodeID, nodeType)

    this.nodeID = nodeID
    this.nodeType = nodeType
  }

  getUserPermissions (nodeID, nodeType) {
    this._permissionsService.getUserPermissions(nodeID, nodeType)
      .subscribe(
        userPermissions => {
          this.currentUserPermissions = userPermissions.permissions
          this.currentUserRole = userPermissions.role
        }
      )
  }

  getPermissionsList (nodeID, nodeType) {
    this._permissionsService.getPermissionsList(nodeID, nodeType)
      .subscribe(
        permissions => {
          this.userList = permissions
        }
      )
  }

  openAddDialog () {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '350';
    dialogConfig.height = '500';

    var dialogRef = this.dialog.open(AddPermissionsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getPermissionsList(this.nodeID, this.nodeType)
    });
  }

  removeUserPermissions (user) {
    this._permissionsService.removeUserPermissions(this.nodeID, this.nodeType, user._id)
       .subscribe(
        response => {
          this.userList = this.userList.filter(item => item._id != user._id)
          // this.userList.splice(this.userList.indexOf(user), 1)
        }
      )
  }
}
