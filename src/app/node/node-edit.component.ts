import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project/project.service';
import { IProject } from '../project/project';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.less']
})
export class NodeEditComponent implements OnInit {


  
  project: any;
  content: string;

  constructor(
    private _projectService: ProjectService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const nodeId = JSON.parse(localStorage.getItem('node'))._Id;
    const nodeType = localStorage.getItem('nodeType');

    if (nodeType === 'Team') {

    } else if (nodeType === 'Project') {
        console.log('Project.................');
        this.project = JSON.parse(localStorage.getItem('project'));
        if (this.project.content !== null) {
          this.content = this.project.content;
          console.log('NOT NULL!', this.content);
        }
    } else if (nodeType === 'Deliverable'){

    }

  }
}


