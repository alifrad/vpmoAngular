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
    // localStorage.setItem('project', id);
    // localStorage.setItem('treeType', 'Project');
    localStorage.setItem('projectID', id);
    localStorage.setItem('nodeID', id);
    localStorage.setItem('nodeType', 'Project');
    this.router.navigate(['/team/tree']);
  }

  editProject (project: any) {
    localStorage.setItem('node', JSON.stringify(project));
    localStorage.setItem('project', JSON.stringify(project));
    localStorage.setItem('nodeID', project._id);
    this.router.navigate(['/node/details']);
  }
  
  openChat (node: any) {
    // localStorage.setItem('node', node);
    localStorage.setItem('nodeID', node);
    this.router.navigate(['/chat']);
  }

  openPermissions (node: any) {
    localStorage.setItem('nodeID', node);
    localStorage.setItem('nodeType', 'Project')
    this.router.navigate(['/permissions'])
  }
}
