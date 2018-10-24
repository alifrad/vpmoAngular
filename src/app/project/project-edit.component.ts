import { Component, OnInit } from '@angular/core';

import { IProject } from './project';
import { ProjectService } from './project.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../app/_services/global.service';


@Component({
  selector: 'node-details',
  templateUrl: './project-edit.component.html',
})

export class ProjectEditComponent implements OnInit {
  errorMessage: string;

  constructor(
          private _projectService: ProjectService,
          private router: Router,
          private global: GlobalService,
        ) {}

  project: any;
  projectContent: string;

  ngOnInit(): void {
    this.project = JSON.parse(localStorage.getItem('project'));
    
    if (this.project.content !== null) {
      this.projectContent = this.project.content;
      // console.log('NOT NULL!', this.projectContent);
    }
  }

  saveContent () {
    let id: string;

    id = JSON.parse(localStorage.getItem('project'))._id;
    // this.global.projectValue.subscribe(
    //   (data) => { id = JSON.parse(data)._id; },
    //   (err: any) => console.log('error: project id')
    // );
    this._projectService.partialUpdateProject(id, this.projectContent)
      .subscribe(
        project => this.project = project 
      );
  }
  
}
