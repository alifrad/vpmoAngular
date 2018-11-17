import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from './tasks.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { appConfig } from '../app.config';

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
	searchUrl: string;

	ngOnInit () {
		this.nodeID = this.data.nodeID;
   		this.nodeType = this.data.nodeType;
   		this.taskID = this.data.taskID;
   		this.newTitle = this.data.taskTitle;
   		this.newDueDate = this.data.taskDueDate;
   		this.selectedUser = this.data.taskAssignee;
   		this.searchUrl = `${appConfig.apiUrl}` + '/assignable_task_users/' + this.nodeID +'/' + '?nodeType='+this.nodeType + '&search='
	}

	editTask () {
		if (!this.selectedUser || !this.filteredAssignableUsers) {
			alert('Please select a valid user')
			return
		}
		this._tasksService.editTask(this.nodeID, this.nodeType, this.taskID, this.selectedUser, this.newTitle, this.newDueDate)
			.subscribe(
				resp => alert('Task Reassigned')
			);
	}

	userSelected (e) {
		this.filteredAssignableUsers = e.filteredUsers
		this.selectedUser = e.selectedUser
	}
}