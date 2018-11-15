import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from './tasks.service';
import { MAT_DIALOG_DATA } from '@angular/material'

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

	ngOnInit () {
		this.nodeID = this.data.nodeID;
   		this.nodeType = this.data.nodeType;
	}

	createTask () {
		if (!this.taskTitle || !this.taskDueDate || !this.selectedUser) {
			alert('Missing Data')
			return;
		}
		this._tasksService.createTask(this.nodeID, this.nodeType, this.taskDueDate, this.selectedUser, this.taskTitle)
			.subscribe(resp => alert('Task Created'))
	}

	filterUsers (e) {
		if (e.length < 3) {
			return;
		}
		this._tasksService.getAssignableUsers(this.nodeID, this.nodeType, e)
			.subscribe(assignableUsers => this.filteredAssignableUsers = assignableUsers);
	}
}