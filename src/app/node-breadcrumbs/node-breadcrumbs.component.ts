import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';
// import { NodeBreadcrumbsService } from './node-breadcrumbs.service';


@Component({
  selector: 'app-node-breadcrumbs',
  templateUrl: './node-breadcrumbs.component.html',
  styleUrls: ['./node-breadcrumbs.component.css']
})

export class NodeBreadcrumbsComponent implements OnInit {
  
  title = 'NodeBreadcrumbs';

  constructor(
    private authUser: AuthenticationService,
    // private _breadcrumbsService: NodeBreadcrumbsService,
    private route: ActivatedRoute
  ) { }

  nodeID: string;
  nodeType: string;
  currentUser: any;

  ngOnInit () {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

   this.route.params.subscribe(
      params => { 
        this.nodeType = params['type']
        this.nodeID = params['id']
      }
    );
  }
}
