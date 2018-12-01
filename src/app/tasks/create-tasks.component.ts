import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from './tasks.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
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
		private dialogRef: MatDialogRef<CreateTasksComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	){ }

	nodeID: string;
 	nodeType: string;
 	taskLists: any[] = [];

	taskTitle: string;
	taskDueDate: any;
	filteredAssignableUsers: any = [];
	selectedUser: any;
	searchUrl: string;
	selectedTaskList: string;

	ngOnInit () {
		this.nodeID = this.data.nodeID;
   		this.nodeType = this.data.nodeType;
   		this.searchUrl = `${appConfig.taskApiUrl}` + '/assignable_task_users/' + this.nodeID +'/' + '?nodeType='+this.nodeType + '&search='

   		this.getTaskLists(this.nodeID)
	}

	getTaskLists (nodeID) {
		this._tasksService.getTaskLists(this.nodeID)
			.subscribe(response => {
				this.taskLists =  response.map(list => {
					return { _id: list._id, title: list.title }
				})
			})
	}

	createTask () {
		console.log(this.selectedTaskList)
		if (!this.taskTitle || !this.taskDueDate || !this.selectedUser || this.filteredAssignableUsers.length == 0 || !this.selectedTaskList) {
			alert('Missing Data')
			return;
		}
		this._tasksService.createTask(this.nodeID, this.nodeType, this.taskDueDate, this.selectedUser, this.taskTitle, this.selectedTaskList)
			.subscribe(resp => this.dialogRef.close())
	}

	userSelected (e) {
		this.filteredAssignableUsers = e.filteredUsers
		this.selectedUser = e.selectedUser
	}
}