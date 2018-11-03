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
  node: any;
  nodeType: string;

  constructor(
          private router: Router,
          private route: ActivatedRoute,
          private globalService: GlobalService,
          ) { 
              globalService.nodeValue.subscribe(
                (nextValue) => {
                  this.node = JSON.parse(nextValue);
                  localStorage.setItem('nodeID', this.node._id)
              });
          }

  updateGlobal(nodeType) {
    localStorage.setItem('nodeType', nodeType)
    if (nodeType === 'Team') {
      this.globalService.team = localStorage.getItem('team');
      this.globalService.node = localStorage.getItem('team');
    }
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => { 
        this.nodeType = params['type'];
        this.updateGlobal(this.nodeType);
      }
    );
    
    // this.nodeType = localStorage.getItem('nodeType');
    
  }

}
