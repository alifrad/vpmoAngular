import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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

	ngOnInit () {
		console.log('Init Create Node', this.data.parentNode)
		this.parentNode = this.data.parentNode.data
	}


}