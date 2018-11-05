import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';

@Component({
  selector: 'reassign-task',
  templateUrl: './reassign-task.component.html',
  styleUrls: ['./reassign-task.component.css']
})


export class ReassignTaskComponent implements OnInit {
	title = 'Reassign Task';

	constructor(
		private _tasksService: TasksService
	){ }

	nodeID: string;
 	nodeType: string;
 	taskID: string;

	filteredAssignableUsers: any = [];
	selectedUser: any;

	ngOnInit () {
		this.nodeID = JSON.parse(localStorage.getItem('node'))._id;
   		this.nodeType = localStorage.getItem('nodeType');
   		this.taskID = localStorage.getItem('taskID')
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