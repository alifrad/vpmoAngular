import { Component, OnInit } from '@angular/core';
import { PermissionsService } from './permissions.service';

@Component({
  selector: 'add-permissions',
  templateUrl: './add-permissions.component.html',
  styleUrls: ['./add-permissions.component.css']
})


export class AddPermissionsComponent implements OnInit {
	title = 'Add Permissions';

	constructor(
		private _permissionsService: PermissionsService
	){ }

	nodeID: string;
	nodeType: string;
	usersList: any[] = [];
	selectedUser: any;
	assignableRoles: any[] = [];

	ngOnInit () {
		this.nodeType = localStorage.getItem('nodeType')
		this.nodeID = localStorage.getItem('nodeID')
		this.assignableRoles = JSON.parse(localStorage.getItem('assignableRoles'))
		this._permissionsService.getAssignableUsers(this.nodeID, this.nodeType)
			.subscribe(
				users => this.usersList = users
			)
	}

	addUser () {
		var role = this.assignableRoles[0]
		this._permissionsService.assignUserToNode(this.nodeID, this.nodeType, this.selectedUser, role)
			.subscribe(
				response => this.usersList = this.usersList.filter(item => item._id !== this.selectedUser)
			)
	}
}