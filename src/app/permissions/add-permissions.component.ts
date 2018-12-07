import { Component, OnInit, Inject } from '@angular/core';
import { PermissionsService } from './permissions.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { appConfig } from '../app.config';
import { LoadingService } from '../_services/loading.service';

@Component({
  selector: 'add-permissions',
  templateUrl: './add-permissions.component.html',
  styleUrls: ['./add-permissions.component.css']
})


export class AddPermissionsComponent implements OnInit {
	title = 'Add Permissions';

	constructor(
		private _permissionsService: PermissionsService,
		private dialogRef: MatDialogRef<AddPermissionsComponent>,
		private loadingService: LoadingService,
		@Inject(MAT_DIALOG_DATA) public data: any
	){ }

	nodeID: string;
	nodeType: string;
	usersList: any[] = [];
	selectedUser: any;
	assignableRoles: any[] = [];
	filteredAssignableUsers: any[] = [];
	searchUrl: string;

	ngOnInit () {
		this.nodeType = this.data.nodeType
		this.nodeID = this.data.nodeID
		this.assignableRoles = JSON.parse(localStorage.getItem('assignableRoles'))
		this.searchUrl = `${appConfig.apiAuthUrl}/assignable_users/`+this.nodeID+'/?nodeType='+this.nodeType+'&search='
	}

	addUser () {
		var role = this.assignableRoles[0]
		if (!this.selectedUser || this.usersList.length == 0) {
			alert('Please select a valid user')
			return
		}
		console.log(this.selectedUser, role)
		var taskID = this.loadingService.startTask()
		this._permissionsService.assignUserToNode(this.nodeID, this.nodeType, this.selectedUser, role)
			.subscribe(
				response => {
					this.loadingService.taskFinished(taskID)
				 	this.usersList = this.usersList.filter(item => item._id !== this.selectedUser);
				 	this.dialogRef.close()
				 }
			)
	}

	userSelected (e) {
		this.usersList = e.filteredUsers
		this.selectedUser = e.selectedUser
	}
}
