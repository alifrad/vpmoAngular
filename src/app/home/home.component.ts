import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector   : 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private fuseConfig: FuseConfigService,
  ) {
    this.fuseConfig.setConfig({
      layout: {
          navigation: 'none',
          // toolbar   : 'none',
          // footer    : 'none'
      }
    });
  }


  ngOnInit() {}



}
