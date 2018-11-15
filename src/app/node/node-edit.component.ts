import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectService } from 'app/project/project.service';
import { TeamService } from 'app/team/team.service';
import { flatten } from '@angular/router/src/utils/collection';
import { GlobalService } from 'app/_services/global.service';


@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.less']
})
export class NodeEditComponent implements OnInit {


  
  project: any;
  team: any;
  content = '';
  node: any;

  constructor(
    private _projectService: ProjectService,
    private _teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    globalService.nodeValue.subscribe(
      (nextValue) => {
        this.node = JSON.parse(nextValue);
        localStorage.setItem('nodeID', this.node._id)
    });
  }
  
  getContent(nodeType, nodeId) {

    if (nodeType === 'Team') {
      this.content = '';
    } else if (nodeType === 'Project') {
        console.log('Project.................');
        this._projectService.getProject(nodeId)
          .subscribe(
            project => this.content = project.content,
            err => console.error('Reading Project Content: ' + err)
          );
        // this.project = this._projectService.getProject(nodeId);
        // if (this.project.content !== null) {
        //   this.content = this.project.content;
        //   console.log('NOT NULL!', this.content);
        // }
    } else if (nodeType === 'Deliverable'){

    }
  }

  saveContent () {
    let nodeId: string;
    let nodeType: string;

    nodeType = JSON.parse(localStorage.getItem('nodeType'));
    nodeId = JSON.parse(localStorage.getItem('nodeID'));

    if (nodeType === 'Project') {
      this._projectService.partialUpdateProject(nodeId, this.content)
      .subscribe(
        project => this.project = project
      );
    } else if (nodeType === 'Deliverable') {
      
    }
    
  }

  ngOnInit(): void {
    // read content against this.node

    this.route.params.subscribe(
      params => { 
        this.getContent(params['type'], params['id']);
      }
    );
    
    

  }


  
}
