import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})

export class PermissionsComponent implements OnInit {

  constructor(
    private authUser: AuthenticationService,
  ) { }

  nodeID: any;

  ngOnInit() {
    console.log("Permissions Module initialized")
    this.nodeID = localStorage.getItem('nodeID')
  }
}
