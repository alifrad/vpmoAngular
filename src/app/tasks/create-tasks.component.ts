import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';

@Component({
  selector: 'create-tasks',
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.css']
})


export class CreateTasksComponent implements OnInit {
	title = 'Create Tasks';

	constructor(
		private _tasksService: TasksService
	){ }

	nodeID: string;
 	nodeType: string;

	taskTitle: string;
	taskDueDate: any;
	filteredAssignableUsers: any = [];
	selectedUser: any;

	ngOnInit () {
		this.nodeID = JSON.parse(localStorage.getItem('node'))._id;
   		this.nodeType = localStorage.getItem('nodeType');
	}

	createTask () {
		if (!this.taskTitle || !this.taskDueDate || !this.selectedUser) {
			alert('Missing Data')
			return
		}
		this._tasksService.createTask(this.nodeID, this.nodeType, this.taskDueDate, this.selectedUser, this.taskTitle)
			.subscribe(resp => alert('Task Created'))
	}

	filterUsers (e) {
		if (e.length < 5) {
			return
		}
		this._tasksService.getAssignableUsers(this.nodeID, this.nodeType, e)
			.subscribe(assignableUsers => this.filteredAssignableUsers = assignableUsers)
	}
}