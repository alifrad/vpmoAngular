import { Component, OnInit, Inject } from '@angular/core';
import { PermissionsService } from './permissions.service';
import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'add-permissions',
  templateUrl: './add-permissions.component.html',
  styleUrls: ['./add-permissions.component.css']
})


export class AddPermissionsComponent implements OnInit {
	title = 'Add Permissions';

	constructor(
		private _permissionsService: PermissionsService,
		@Inject(MAT_DIALOG_DATA) public data: any
	){ }

	nodeID: string;
	nodeType: string;
	usersList: any[] = [];
	selectedUser: any;
	assignableRoles: any[] = [];
	filteredAssignableUsers: any[] = [];

	ngOnInit () {
		this.nodeType = this.data.nodeType
		this.nodeID = this.data.nodeID
		this.assignableRoles = JSON.parse(localStorage.getItem('assignableRoles'))
	}

	addUser () {
		var role = this.assignableRoles[0]
		this._permissionsService.assignUserToNode(this.nodeID, this.nodeType, this.selectedUser, role)
			.subscribe(
				response => {
				 	this.usersList = this.usersList.filter(item => item._id !== this.selectedUser);
				 	alert('User Added');
				 }
			)
	}

	filterUsers (username) {
		if (username.length >= 3) {
			this._permissionsService.getAssignableUsers(this.nodeID, this.nodeType, username)
				.subscribe(
					users => this.usersList = users
				);
		}
	}
}
