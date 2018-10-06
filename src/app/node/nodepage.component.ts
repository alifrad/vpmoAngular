import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nodepage',
  templateUrl: './nodepage.component.html',
  styleUrls: ['./nodepage.component.less']
})
export class NodepageComponent implements OnInit {
  errorMessage: string;

  constructor(
          private router: Router,
  ) { }

  ngOnInit() {
  }

}
