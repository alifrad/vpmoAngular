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

	ngOnInit () {
		this.nodeType = localStorage.getItem('nodeType')
		this.nodeID = localStorage.getItem('nodeID')
		this._permissionsService.getAssignableUsers(this.nodeID, this.nodeType)
			.subscribe(
				users => this.usersList = users
			)
	}

	addUser () {
		console.log(this.selectedUser)
	}
}