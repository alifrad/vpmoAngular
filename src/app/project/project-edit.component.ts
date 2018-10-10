import { Component, OnInit } from '@angular/core';

import { IProject } from './project';
import { ProjectService } from './project.service';
import { Router } from '@angular/router';


@Component({
  selector: 'node-details',
  templateUrl: './project-edit.component.html',
})

export class ProjectEditComponent implements OnInit {
  errorMessage: string;

  constructor(
          private _projectService: ProjectService,
          private router: Router,
        ) {}

  project: any;
  projectContent: string;

  ngOnInit(): void {
    this.project = JSON.parse(localStorage.getItem('project'));
    
    if (this.project.content !== null) {
      this.projectContent = this.project.content;
      console.log('NOT NULL!', this.projectContent);
    }
  }

  saveContent () {
    this._projectService.partialUpdateProject(this.project._id, this.projectContent)
      .subscribe(
        project => this.project = project 
      );
  }
  
}
