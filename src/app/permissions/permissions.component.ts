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
  // Permissions the current user has for the node
  currentUserPermissions: string[] = [];
  // Role of the current user for the node
  currentUserRole: string;
  currentUserID: string;
  displayedColumns: string[] = ['username', 'role', 'controlsColumn']
  // The roles assignable by the user
  assignableRoles: string[] = [];

  ngOnInit() {
    var nodeID = localStorage.getItem('nodeID')
    var nodeType = localStorage.getItem('nodeType')

    this.getUserPermissions(nodeID, nodeType)

    this.getPermissionsList(nodeID, nodeType)

    this.getAssignableRoles(nodeID, nodeType)

    this.nodeID = nodeID
    this.nodeType = nodeType
    console.log("Init Node Permissions", this.nodeID, this.nodeType, this.currentUserRole)
  }

  getUserPermissions (nodeID, nodeType) {
    this._permissionsService.getUserPermissions(nodeID, nodeType)
      .subscribe(
        userPermissions => {
          this.currentUserPermissions = userPermissions.permissions
          this.currentUserRole = userPermissions.role
          this.currentUserID = userPermissions._id
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

  getAssignableRoles (nodeID, nodeType) {
    this._permissionsService.getAssignableRoles(nodeID, nodeType)
      .subscribe(
        roles => {
          this.assignableRoles = roles
        }
      )
  }

  assignRole (newRole, user) {
    console.log(newRole, user)
    this._permissionsService.assignUserToNode(this.nodeID, this.nodeType, user._id, newRole)
      .subscribe(
        response => console.log('Role updated for ' + user.username + ' to ' + newRole)
      )
  }

  openAddDialog () {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '350';
    dialogConfig.height = '500';

    localStorage.setItem('assignableRoles', JSON.stringify(this.assignableRoles))
    var dialogRef = this.dialog.open(AddPermissionsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getPermissionsList(this.nodeID, this.nodeType)
    });
  }

  // TODO: Get a list of assignable users by current user to current node, and pass that to add-permissions as well
  // Use it in add permissions to set the base role when adding a user

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
