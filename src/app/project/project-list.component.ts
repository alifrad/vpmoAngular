import { Component, OnInit } from '@angular/core';

import { IProject } from './project';
import { ProjectService } from './project.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  errorMessage: string;

  constructor(
          private _projectService: ProjectService,
          private router: Router,
        ) {}

  projects: IProject[] = [];

  ngOnInit(): void {
    this._projectService.getProjects()
          .subscribe(
                projects => this.projects = projects,
                error => this.errorMessage = <any>error);
    }

  projectTree(id: string) {
    localStorage.setItem('project', id);
    localStorage.setItem('treeType', 'Project');
    this.router.navigate(['/team/tree']);
  }
  
  }
