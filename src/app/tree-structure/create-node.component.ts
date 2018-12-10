import { Component, OnInit, ViewChild, Inject, EventEmitter } from '@angular/core';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TasksService } from 'app/tasks/tasks.service';
import { LoadingService } from '../_services/loading.service';

@Component({
	selector: 'app-create-node',
	templateUrl: './create-node.component.html',
	styleUrls: ['./create-node.component.css']
})

export class CreateNodeComponent implements OnInit {
	nodeID: string;
	nodeType: string;
	filteredAssignableUsers: any = [];
	severityList: any[] = [
		{value: '1', text: 'Low'},
		{value: '2', text: 'Medium'},
		{value: '3', text: 'High'}
	  ];
	impactList: any[] = [
		{value: '1', text: 'Minor'},
		{value: '2', text: 'Moderate'},
		{value: '3', text: 'High'}
	  ];
	probabilityList: any[] = [
		{value: '1', text: 'Low probability'},
		{value: '2', text: 'Medium probability'},
		{value: '3', text: 'High'}
	  ];
	
	constructor(
		private treeStructureHttpService: TreeStructureHttpService,
		private _tasksService: TasksService,
		private loadingService: LoadingService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	parentNode: any;

	selectableNodeTypes: string[];
	selectedNodeType: string;
	selectedUser: any;
	createNodeFormData: any;

	onCreate = new EventEmitter();

	ngOnInit() {
		this.nodeID = this.data.nodeID;
		this.nodeType = this.data.nodeType;
		console.log('Init Create Node', this.data.parentNode);
		this.parentNode = this.data.parentNode.data;

		// Setting the creatable node types under a particular parent node type
		if (this.parentNode.node_type === 'Team') {
			this.selectableNodeTypes = ['Project'];
		} else if (this.parentNode.node_type === 'Project') {
			this.selectableNodeTypes = ['Project', 'Deliverable', 'Issue', 'Risk','Meeting'];
		}
	}


	
	createEmptyFormData(e) {
		const nodeType = e.value;
		if (nodeType === 'Project') {
			this.createNodeFormData = {
				name: '',
				description: '',
				start: '',
				parentID: this.parentNode._id
			};
		} else if (nodeType === 'Issue') {
			this.createNodeFormData = {
				name: '',
				due_date: '',
				parentID: this.parentNode._id,
				severity: '',
			};
		} else if (nodeType === 'Deliverable') {
			this.createNodeFormData = {
				name: '',
				due_date: '',
				parentID: this.parentNode._id,
			};
		} else if (nodeType === 'Risk') {
			this.createNodeFormData = {
				name: '',
				due_date: '',
				parentID: this.parentNode._id,
				impact:'',
				probability:''
			};
		} else if (nodeType === 'Meeting') {
			this.createNodeFormData = {
				name: '',
				date_time: '',
				venue: '',
				parentID: this.parentNode._id,
			};
		}
		console.log('Create Node Form Data');
	}

	createNode() {
		const self = this;
		var taskID = this.loadingService.startTask()
		this.treeStructureHttpService.createNode(this.createNodeFormData, this.selectedNodeType)
			.subscribe(response => {
				self.loadingService.taskFinished(taskID)
				self.onCreate.emit(response);
			});
	}

	filterUsers (e) {
		if (e.length < 3) {
			return;
		}
		this._tasksService.getAssignableUsers(this.nodeID, this.nodeType, e)
			.subscribe(assignableUsers => this.filteredAssignableUsers = assignableUsers);
	}

}