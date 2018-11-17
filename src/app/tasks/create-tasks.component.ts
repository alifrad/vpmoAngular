import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from './tasks.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { appConfig } from '../app.config';

@Component({
  selector: 'create-tasks',
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.css']
})


export class CreateTasksComponent implements OnInit {
	title = 'Create Tasks';

	constructor(
		private _tasksService: TasksService,
		@Inject(MAT_DIALOG_DATA) public data: any
	){ }

	nodeID: string;
 	nodeType: string;

	taskTitle: string;
	taskDueDate: any;
	filteredAssignableUsers: any = [];
	selectedUser: any;
	searchUrl: string;

	ngOnInit () {
		this.nodeID = this.data.nodeID;
   		this.nodeType = this.data.nodeType;
   		this.searchUrl = `${appConfig.apiUrl}` + '/assignable_task_users/' + this.nodeID +'/' + '?nodeType='+this.nodeType + '&search='
	}

	createTask () {
		if (!this.taskTitle || !this.taskDueDate || !this.selectedUser || this.filteredAssignableUsers.length == 0) {
			alert('Missing Data')
			return;
		}
		this._tasksService.createTask(this.nodeID, this.nodeType, this.taskDueDate, this.selectedUser, this.taskTitle)
			.subscribe(resp => alert('Task Created'))
	}

	userSelected (e) {
		this.filteredAssignableUsers = e.filteredUsers
		this.selectedUser = e.selectedUser
	}
}