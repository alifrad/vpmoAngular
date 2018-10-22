import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../_services/global.service';

@Component({
  selector: 'app-node-navigation',
  templateUrl: './node-navigation.component.html',
  styleUrls: ['./node-navigation.component.less']
})
export class NodeNavigationComponent implements OnInit {

  team: any;
  project: any;
  topic: any;
  favourites: any[];
  navigation: any[];

  constructor(
    private globalService: GlobalService,
  ) {
    globalService.teamValue.subscribe(
      (nextValue) => this.team = nextValue
    );
    globalService.projectValue.subscribe(
      (nextValue) => this.project = nextValue
    );
    globalService.topicValue.subscribe(
      (nextValue) => this.topic = nextValue
    );
    globalService.navigationValue.subscribe(
      (nextValue) => this.navigation = nextValue
    );
   }

  ngOnInit() {
    
  }

}
