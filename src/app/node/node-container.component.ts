import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-node-container',
  templateUrl: './node-container.component.html',
  styleUrls: ['./node-container.component.less']
})
export class NodeContainerComponent implements OnInit {

  contentType: any;
  nodeID: any;
  nodeType: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contentType = params['contentType'];
      this.nodeID = params['id']
      this.nodeType = params['type']
    })
  }

  

}
