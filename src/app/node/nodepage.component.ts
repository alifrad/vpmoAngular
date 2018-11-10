import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../_services/global.service';

@Component({
  selector: 'app-nodepage',
  templateUrl: './nodepage.component.html',
  styleUrls: ['./nodepage.component.less']
})
export class NodepageComponent implements OnInit {
  errorMessage: string;
  nodeID: any;
  nodeType: string;

  constructor(
          private router: Router,
          private route: ActivatedRoute,
          private globalService: GlobalService,
          ) { }  

  ngOnInit() {
    this.route.params.subscribe(
      params => { 
        this.nodeType = params['type'];
        this.nodeID = params['id']
      }
    );
    
    // this.nodeType = localStorage.getItem('nodeType');
    
  }

}
