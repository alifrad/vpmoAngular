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
  selectedIndex: any;

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

  onTabChanged (e) {
    this.selectedIndex = e.index
  }

  showContent () {
    if (this.nodeType == 'Topic') {
      return this.selectedIndex == 0 || this.selectedIndex == undefined || this.selectedIndex == null
    } else {
      return this.selectedIndex == 1
    }
  }

}
