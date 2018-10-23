import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/_services/authentication.service';
import { TeamService } from './team.service';
import { Team } from './team';
import { Router } from '@angular/router';
import { GlobalService } from '../_services/global.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  teams: Team[] = [];
  errorMessage: string;
  constructor(
      private authenticationService: AuthenticationService,
      private teamService: TeamService,
      private router: Router,
      private globalService: GlobalService,
  ) { }

  teamTree(team: Team) {
    localStorage.setItem('nodeType', 'Team');
    this.globalService.team = JSON.stringify(team);
    this.globalService.node = JSON.stringify(team);
    this.router.navigate(['/team/tree']);
  }


  ngOnInit() {
    this.teamService.getTeams().subscribe(
      teams =>  
      {
        this.teams = teams;
      },
      error => this.errorMessage = <any>error
    );
  }

  
}
