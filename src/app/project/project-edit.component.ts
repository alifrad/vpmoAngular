import { Component, OnInit } from '@angular/core';

import { IProject } from './project';
import { ProjectService } from './project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../app/_services/global.service';


@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
})

export class ProjectEditComponent implements OnInit {
  errorMessage: string;

  constructor(
          private _projectService: ProjectService,
          private router: Router,
          private global: GlobalService,
          private route: ActivatedRoute
        ) {}

  project: any;
  projectContent: string;

  ngOnInit(): void {
    this.route.params.subscribe(
      params => { 
        this.getProject(params['id'])
      }
    );    
    
  }

  getProject (nodeID) {
    this.projectContent = '';
    this._projectService.getProject(nodeID)
      .subscribe(project => {
        this.project = project
        if (this.project.content !== null) {
          this.projectContent = this.project.content;
        }
      })
  }

  saveContent () {
    this._projectService.partialUpdateProject(this.project._id, this.projectContent)
      .subscribe(
        project => this.project = project 
      );
  }
  
}
