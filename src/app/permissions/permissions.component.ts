import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddPermissionsComponent } from './add-permissions.component';
import { AuthenticationService } from '../_services';
import { PermissionsService } from './permissions.service';
import { MatDialog, MatDialogConfig } from '@angular/material';

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
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  userList: any[] = [];
  nodeID: string;
  nodeType: string;
  // Permissions the current user has for the node
  currentUserPermissions: string[] = [];
  // Role of the current user for the node
  currentUserRole: string;
  currentUserID: string;
  displayedColumns: string[] = ['username', 'role', 'controlsColumn'];
  // The roles assignable by the user
  assignableRoles: string[] = [];

  ngOnInit() {
    this.route.params.subscribe(
      params => { 
        this.nodeType = params['type']
        this.nodeID = params['id']

        this.getUserPermissions(this.nodeID, this.nodeType);

        this.getPermissionsList(this.nodeID, this.nodeType);

        this.getAssignableRoles(this.nodeID, this.nodeType);
      }
    );
  }

  getUserPermissions (nodeID, nodeType) {
    this._permissionsService.getUserPermissions(nodeID, nodeType)
      .subscribe(
        userPermissions => {
          this.currentUserPermissions = userPermissions.permissions;
          this.currentUserRole = userPermissions.role;
          this.currentUserID = userPermissions._id;
        }
      );
  }

  getPermissionsList (nodeID, nodeType) {
    this._permissionsService.getPermissionsList(nodeID, nodeType)
      .subscribe(
        permissions => {
          this.userList = permissions;
        }
      );
  }

  getAssignableRoles (nodeID, nodeType) {
    this._permissionsService.getAssignableRoles(nodeID, nodeType)
      .subscribe(
        roles => {
          this.assignableRoles = roles;
        }
      );
  }

  assignRole (newRole, user) {
    const self = this;
    this._permissionsService.assignUserToNode(this.nodeID, this.nodeType, user.username, newRole)
      .subscribe(
        response => {
          if (user._id === self.currentUserID) {
            self.getUserPermissions(self.nodeID, self.nodeType);
          }
        }
      );
  }

  canAddUser () {
    const addPerms = [];
    this.currentUserPermissions.forEach(function (i) {
      if (i.indexOf('add_') >= 0) {
        addPerms.push(i);
      }
    });
    return addPerms.length >= 1;
  }

  canRemoveUsers () {
    const removePerms = [];
    this.currentUserPermissions.forEach(function (i) {
      if (i.indexOf('remove_') >= 0) {
        removePerms.push(i);
      }
    });
    return removePerms.length >= 1;
  }

  canEditUserRoles () {
    const editPerms = [];
    const self = this;
    this.currentUserPermissions.forEach(function (i) {
      if (i === 'update_' + self.nodeType.toLowerCase() + '_user_role') {
        editPerms.push(i);
      }
    });
    return editPerms.length >= 1;
  }

  openAddDialog () {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '350';
    dialogConfig.height = '500';

    localStorage.setItem('assignableRoles', JSON.stringify(this.assignableRoles));
    const dialogRef = this.dialog.open(AddPermissionsComponent, {
      'autoFocus': true,
      width: '350',
      height: '500',
      data: {nodeType: this.nodeType, nodeID: this.nodeID}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPermissionsList(this.nodeID, this.nodeType);
    });
  }

  // TODO: Get a list of assignable users by current user to current node, and pass that to add-permissions as well
  // Use it in add permissions to set the base role when adding a user

  removeUserPermissions (user) {
    this._permissionsService.removeUserPermissions(this.nodeID, this.nodeType, user._id)
       .subscribe(
        response => {
          this.userList = this.userList.filter(item => item._id !== user._id);
          // this.userList.splice(this.userList.indexOf(user), 1)
        }
      );
  }
}
