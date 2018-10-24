import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../_services/global.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent implements OnInit {

  node: any;
  team: any;
  project: any;
  topic: any;

  constructor(
    private globalService: GlobalService,
    ) { 
      globalService.teamValue.subscribe(
        (nextValue) => {
          this.team = nextValue;
      });
      globalService.projectValue.subscribe(
        (nextValue) => {
          this.project = nextValue;
      });
      globalService.topicValue.subscribe(
        (nextValue) => {
          this.topic = nextValue;
      });
      globalService.nodeValue.subscribe(
        (nextValue) => {
          this.node = nextValue;
      });
    }

  teamUpdate() {

  }

  projectUpdate() {

  }

  topicUpdate() {

  }


  ngOnInit() {
  }

}
