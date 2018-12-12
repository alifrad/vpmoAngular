import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AddPermissionsComponent } from './add-permissions.component';
import { AuthenticationService } from '../_services';
import { PermissionsService } from './permissions.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoadingService } from '../_services/loading.service';
import { NodeService } from '../node/node.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})

export class PermissionsComponent implements OnInit, OnDestroy {
  
  title = 'Permissions';

  constructor(
    private authService: AuthenticationService,
    private _permissionsService: PermissionsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private nodeService: NodeService
  ) {
    this._unsubscribeAll = new Subject();
  }

  userList: any[] = [];
  nodeID: string;
  nodeType: string;
  // Permissions the current user has for the node
  currentUserPermissions: string[] = [];
  // Role of the current user for the node
  currentUserRole: string;
  displayedColumns: string[] = ['username', 'role', 'controlsColumn'];
  // The roles assignable by the user
  assignableRoles: string[] = [];
  currentUser: any;
  nodeOwner: string;

  private _unsubscribeAll: Subject<any>;

  ngOnInit() {
    this.authService.user
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.currentUser = user
      })

    this.nodeService.node
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(node => {
        if (node) {
          this.nodeType = node.node_type
          this.nodeID = node._id

          if (node.user_linked != false && node.user_linked != undefined) {
            this.nodeOwner = node.user_team
          } else {
            this.nodeOwner = ''
          }

          this.userList = node.users
          this.currentUserPermissions = node.user_permissions
          this.currentUserRole = node.user_role
          // TODO: Move into the nodeService
          this.getAssignableRoles(this.nodeID, this.nodeType);
        }
      })
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  getPermissionsList (nodeID, nodeType) {
    // Gets a list of users that have permissions for this node
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
    var taskID = this.loadingService.startTask()
    this._permissionsService.assignUserToNode(this.nodeID, this.nodeType, user.username, newRole)
      .subscribe(
        response => {
          this.loadingService.taskFinished(taskID)
          if (user._id === self.authService.getUser()._id) {
            self.nodeService.getUserPermissions(self.nodeID, self.nodeType);
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
    var taskID = this.loadingService.startTask()

    this._permissionsService.removeUserPermissions(this.nodeID, this.nodeType, user._id)
       .subscribe(
        response => {
          this.loadingService.taskFinished(taskID)
          this.userList = this.userList.filter(item => item._id !== user._id);
          // this.userList.splice(this.userList.indexOf(user), 1)
        }
      );
  }
}
