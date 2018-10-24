import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';

@Component({
  selector: 'app-nodepage',
  templateUrl: './nodepage.component.html',
  styleUrls: ['./nodepage.component.less']
})
export class NodepageComponent implements OnInit {
  errorMessage: string;
  node: string;

  constructor(
          private router: Router,
          private globalService: GlobalService,
  ) {
    globalService.nodeValue.subscribe(
      (nextValue) => {
        this.node = nextValue;
    });
   }

  ngOnInit() {
    
  }

}
