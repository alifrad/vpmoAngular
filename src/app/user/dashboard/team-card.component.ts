import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.less']
})
export class TeamCardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  teams() {
    this.router.navigate(['/team/all']);
  }
}
