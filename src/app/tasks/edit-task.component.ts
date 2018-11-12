import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from './tasks.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})


export class EditTaskComponent implements OnInit {
	title = 'Edit Task';

	constructor(
		private _tasksService: TasksService,
		@Inject(MAT_DIALOG_DATA) public data: any
	){ }

	nodeID: string;
 	nodeType: string;
 	taskID: string;

	filteredAssignableUsers: any = [];
	selectedUser: any;
	newTitle: string;
	newDueDate: string;

	ngOnInit () {
		this.nodeID = this.data.nodeID
   		this.nodeType = this.data.nodeType
   		this.taskID = this.data.taskID
   		this.newTitle = this.data.taskTitle
   		this.newDueDate = this.data.taskDueDate
   		this.selectedUser = this.data.taskAssignee
   		// Filtering the assignable users so that the options list can be populated
   		this.filterUsers(this.selectedUser)
	}

	filterUsers (e) {
		if (e.length < 3) {
			return
		}
		this._tasksService.getAssignableUsers(this.nodeID, this.nodeType, e)
			.subscribe(assignableUsers => this.filteredAssignableUsers = assignableUsers)
	}

	editTask () {
		this._tasksService.editTask(this.nodeID, this.nodeType, this.taskID, this.selectedUser, this.newTitle, this.newDueDate)
			.subscribe(
				resp => alert('Task Reassigned')
			)
	}
}