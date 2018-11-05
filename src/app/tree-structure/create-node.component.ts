import { Component, OnInit, ViewChild, Inject, EventEmitter } from '@angular/core';
import { TreeStructureHttpService } from './tree-structure-http.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-create-node',
	templateUrl: './create-node.component.html',
	styleUrls: ['./create-node.component.css']
})

export class CreateNodeComponent implements OnInit {

	constructor(
		private treeStructureHttpService: TreeStructureHttpService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	parentNode: any;

	selectableNodeTypes: string[];
	selectedNodeType: string;
	
	createNodeFormData: any;

	onCreate = new EventEmitter();

	ngOnInit () {
		console.log('Init Create Node', this.data.parentNode)
		this.parentNode = this.data.parentNode.data

		// Setting the creatable node types under a particular parent node type
		if (this.parentNode.node_type == 'Team') {
			this.selectableNodeTypes = ['Project']
		} else if (this.parentNode.node_type == 'Project') {
			this.selectableNodeTypes = ['Project', 'Deliverable']
		}
	}

	createEmptyFormData (e) {
		var nodeType = e.value
		if (nodeType == 'Project') {
			this.createNodeFormData = {
				name: '',
				description: '',
				start: '',
				parentID: this.parentNode._id
			}
		} else {
			this.createNodeFormData = {
				name: '',
				due_date: '',
				parentID: this.parentNode._id
			}
		}
		console.log('Create Node Form Data')
	}

	createNode () {
		var self = this
		this.treeStructureHttpService.createNode(this.createNodeFormData, this.selectedNodeType)
			.subscribe(response => {
				self.onCreate.emit(response)
			})
	}

}