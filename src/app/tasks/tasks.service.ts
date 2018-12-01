import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { appConfig } from '../app.config';
import { AuthenticationService } from '../_services';
import { CustomHttpClient } from '../_services/custom-http.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class TasksService {
	private readonly apiUrl: string = `${appConfig.taskApiUrl}`;
	private readonly getAssignedTasksUrl: string = this.apiUrl + '/list_assigned_tasks/';
	private readonly getAssignableUsersUrl: string = this.apiUrl + '/assignable_task_users/';
	private readonly createDeleteUpdateTaskUrl: string = this.apiUrl + '/delete_update_create_task/';
	private readonly taskListsGetUrl: string = this.apiUrl + '/assignable_scrumboard_task_lists/';


	constructor(private http: CustomHttpClient, private authService: AuthenticationService) { }

	getAssignedTasks (nodeID: string): Observable<any> {
		// Returns the list of tasks assigned to the user
		return this.http.get(this.getAssignedTasksUrl+nodeID+'/')
	}

	getTaskLists (nodeID: string): Observable<any> {
		return this.http.get(this.taskListsGetUrl+nodeID+'/')
	}

	getAssignableUsers(nodeID: string, nodeType: string, searchQuery: string): Observable<any> {
		// Returns a filtered (searched) observable of a list of users that can be assigned a task for a node
		return this.http.get(this.getAssignableUsersUrl+nodeID+'/?nodeType='+nodeType+'&search='+searchQuery)
	}

	createTask (nodeID: string, nodeType: string, dueDate: any, assignee: string, taskTitle: string, taskList: string): Observable<any> {
		// Sends a post request with given data to create the task
		var data = {
			due_date: dueDate,
			status: 'NEW',
			title: taskTitle,
			'assignee': assignee,
			node: nodeID,
			task_list_id: taskList
		}
		return this.http.post(this.createDeleteUpdateTaskUrl+'?nodeType='+nodeType+'&nodeID='+nodeID, data)
	}

	updateTaskStatus (nodeID: string, nodeType: string, taskID: string, status: string): Observable<any> {
		// Sends a Patch request for updating the task status for the given task
		var data = {
			_id: taskID,
			'status': status
		}
		return this.http.patch(this.createDeleteUpdateTaskUrl+'?nodeType='+nodeType+'&nodeID='+nodeID, data)
	}

	deleteTask (nodeID: string, nodeType: string, taskID: string): Observable<any> {
		var data = {
			_id: taskID
		}
		return this.http.request('delete', this.createDeleteUpdateTaskUrl+'?nodeType='+nodeType+'&nodeID='+nodeID, data)
	}

	editTask (nodeID: string, nodeType: string, taskID: string, assigneeUsername: string, taskTitle: string, dueDate: string): Observable<any> {
		var data = {
			assignee: assigneeUsername,
			_id: taskID,
			title: taskTitle,
			due_date: dueDate
		}
		return this.http.put(this.createDeleteUpdateTaskUrl+'?nodeType='+nodeType+'&nodeID='+nodeID, data)
	}
}