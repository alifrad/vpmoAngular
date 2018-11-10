import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from './tasks.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'reassign-task',
  templateUrl: './reassign-task.component.html',
  styleUrls: ['./reassign-task.component.css']
})


export class ReassignTaskComponent implements OnInit {
	title = 'Reassign Task';

	constructor(
		private _tasksService: TasksService,
		@Inject(MAT_DIALOG_DATA) public data: any
	){ }

	nodeID: string;
 	nodeType: string;
 	taskID: string;

	filteredAssignableUsers: any = [];
	selectedUser: any;

	ngOnInit () {
		this.nodeID = this.data.nodeID
   		this.nodeType = this.data.nodeType
   		this.taskID = this.data.taskID
	}

	filterUsers (e) {
		if (e.length < 5) {
			return
		}
		this._tasksService.getAssignableUsers(this.nodeID, this.nodeType, e)
			.subscribe(assignableUsers => this.filteredAssignableUsers = assignableUsers)
	}

	reassignTask () {
		this._tasksService.reassignTask(this.nodeID, this.nodeType, this.taskID, this.selectedUser)
			.subscribe(
				resp => alert('Task Reassigned')
			)
	}
}